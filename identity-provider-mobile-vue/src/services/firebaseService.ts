import {
    collection,
    doc,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    onSnapshot,
    Timestamp,
    serverTimestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';

const ROAD_ISSUES_COLLECTION = 'roadIssues';

export interface FirebaseRoadIssue {
    id?: string;
    reporterId: number;
    issueType: string;
    description: string;
    latitude: number;
    longitude: number;
    status: string;
    photoUrl?: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
    syncedAt?: Timestamp;
}

const firebaseService = {
    // ===== ROAD ISSUES =====

    /**
     * Get all road issues from Firebase
     */
    getAllRoadIssues: async (): Promise<FirebaseRoadIssue[]> => {
        const querySnapshot = await getDocs(collection(db, ROAD_ISSUES_COLLECTION));
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as FirebaseRoadIssue));
    },

    /**
     * Get road issues by status
     */
    getRoadIssuesByStatus: async (status: string): Promise<FirebaseRoadIssue[]> => {
        const q = query(
            collection(db, ROAD_ISSUES_COLLECTION),
            where('status', '==', status),
            orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as FirebaseRoadIssue));
    },

    /**
     * Get road issues by reporter
     */
    getRoadIssuesByReporter: async (reporterId: number): Promise<FirebaseRoadIssue[]> => {
        const q = query(
            collection(db, ROAD_ISSUES_COLLECTION),
            where('reporterId', '==', reporterId),
            orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as FirebaseRoadIssue));
    },

    /**
     * Get a single road issue by ID
     */
    getRoadIssueById: async (id: string): Promise<FirebaseRoadIssue | null> => {
        const docRef = doc(db, ROAD_ISSUES_COLLECTION, id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return {
                id: docSnap.id,
                ...docSnap.data()
            } as FirebaseRoadIssue;
        }
        return null;
    },

    /**
     * Create a new road issue in Firebase
     */
    createRoadIssue: async (issue: Omit<FirebaseRoadIssue, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
        const docRef = await addDoc(collection(db, ROAD_ISSUES_COLLECTION), {
            ...issue,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            syncedAt: serverTimestamp()
        });
        return docRef.id;
    },

    /**
     * Update a road issue in Firebase
     */
    updateRoadIssue: async (id: string, updates: Partial<FirebaseRoadIssue>): Promise<void> => {
        const docRef = doc(db, ROAD_ISSUES_COLLECTION, id);
        await updateDoc(docRef, {
            ...updates,
            updatedAt: serverTimestamp(),
            syncedAt: serverTimestamp()
        });
    },

    /**
     * Delete a road issue from Firebase
     */
    deleteRoadIssue: async (id: string): Promise<void> => {
        const docRef = doc(db, ROAD_ISSUES_COLLECTION, id);
        await deleteDoc(docRef);
    },

    /**
     * Listen to real-time updates for all road issues
     */
    subscribeToRoadIssues: (callback: (issues: FirebaseRoadIssue[]) => void) => {
        const q = query(
            collection(db, ROAD_ISSUES_COLLECTION),
            orderBy('createdAt', 'desc')
        );

        return onSnapshot(q, (querySnapshot) => {
            const issues = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as FirebaseRoadIssue));
            callback(issues);
        });
    },

    /**
     * Listen to real-time updates for a specific road issue
     */
    subscribeToRoadIssue: (id: string, callback: (issue: FirebaseRoadIssue | null) => void) => {
        const docRef = doc(db, ROAD_ISSUES_COLLECTION, id);

        return onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                callback({
                    id: docSnap.id,
                    ...docSnap.data()
                } as FirebaseRoadIssue);
            } else {
                callback(null);
            }
        });
    },

    /**
     * Sync local data to Firebase
     * This method takes data from the backend API and syncs it to Firebase
     */
    syncFromBackend: async (backendIssues: any[]): Promise<void> => {
        const batch: Promise<void>[] = [];

        for (const issue of backendIssues) {
            // Check if issue already exists in Firebase
            const q = query(
                collection(db, ROAD_ISSUES_COLLECTION),
                where('id', '==', issue.id)
            );
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                // Create new document
                batch.push(
                    addDoc(collection(db, ROAD_ISSUES_COLLECTION), {
                        reporterId: issue.reporter?.id || issue.reporterId,
                        issueType: issue.issueType,
                        description: issue.description,
                        latitude: issue.latitude,
                        longitude: issue.longitude,
                        status: issue.status,
                        photoUrl: issue.photoUrl,
                        createdAt: issue.createdAt ? Timestamp.fromDate(new Date(issue.createdAt)) : serverTimestamp(),
                        updatedAt: serverTimestamp(),
                        syncedAt: serverTimestamp()
                    }).then(() => { })
                );
            } else {
                // Update existing document
                const docId = querySnapshot.docs[0].id;
                batch.push(
                    updateDoc(doc(db, ROAD_ISSUES_COLLECTION, docId), {
                        reporterId: issue.reporter?.id || issue.reporterId,
                        issueType: issue.issueType,
                        description: issue.description,
                        latitude: issue.latitude,
                        longitude: issue.longitude,
                        status: issue.status,
                        photoUrl: issue.photoUrl,
                        updatedAt: serverTimestamp(),
                        syncedAt: serverTimestamp()
                    })
                );
            }
        }

        await Promise.all(batch);
    }
};

export default firebaseService;

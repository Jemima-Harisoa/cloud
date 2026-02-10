package com.identityprovider.service;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.identityprovider.entity.RoadIssue;
import com.identityprovider.repository.RoadIssueRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;

@Service
@RequiredArgsConstructor
@Slf4j
public class FirebaseSyncService {

    private final Firestore firestore;
    private final RoadIssueRepository roadIssueRepository;
    
    private static final String ROAD_ISSUES_COLLECTION = "roadIssues";

    /**
     * Sync a single road issue to Firebase
     */
    public void syncRoadIssueToFirebase(RoadIssue issue) {
        try {
            Map<String, Object> data = convertRoadIssueToMap(issue);
            
            // Use the database ID as the document ID for easier tracking
            DocumentReference docRef = firestore.collection(ROAD_ISSUES_COLLECTION)
                    .document(String.valueOf(issue.getId()));
            
            ApiFuture<WriteResult> result = docRef.set(data, SetOptions.merge());
            result.get(); // Wait for completion
            
            log.info("Successfully synced road issue {} to Firebase", issue.getId());
        } catch (InterruptedException | ExecutionException e) {
            log.error("Error syncing road issue {} to Firebase", issue.getId(), e);
            Thread.currentThread().interrupt();
        }
    }

    /**
     * Sync all road issues to Firebase
     */
    public void syncAllRoadIssuesToFirebase() {
        try {
            List<RoadIssue> issues = roadIssueRepository.findAll();
            log.info("Starting sync of {} road issues to Firebase", issues.size());
            
            WriteBatch batch = firestore.batch();
            int count = 0;
            
            for (RoadIssue issue : issues) {
                Map<String, Object> data = convertRoadIssueToMap(issue);
                DocumentReference docRef = firestore.collection(ROAD_ISSUES_COLLECTION)
                        .document(String.valueOf(issue.getId()));
                batch.set(docRef, data, SetOptions.merge());
                count++;
                
                // Firestore batch limit is 500 operations
                if (count % 500 == 0) {
                    batch.commit().get();
                    batch = firestore.batch();
                }
            }
            
            // Commit remaining operations
            if (count % 500 != 0) {
                batch.commit().get();
            }
            
            log.info("Successfully synced {} road issues to Firebase", issues.size());
        } catch (InterruptedException | ExecutionException e) {
            log.error("Error syncing all road issues to Firebase", e);
            Thread.currentThread().interrupt();
        }
    }

    /**
     * Delete a road issue from Firebase
     */
    public void deleteRoadIssueFromFirebase(Long issueId) {
        try {
            DocumentReference docRef = firestore.collection(ROAD_ISSUES_COLLECTION)
                    .document(String.valueOf(issueId));
            ApiFuture<WriteResult> result = docRef.delete();
            result.get();
            
            log.info("Successfully deleted road issue {} from Firebase", issueId);
        } catch (InterruptedException | ExecutionException e) {
            log.error("Error deleting road issue {} from Firebase", issueId, e);
            Thread.currentThread().interrupt();
        }
    }

    /**
     * Listen to Firebase changes and sync to local database
     * This method sets up a real-time listener for Firebase changes
     */
    public void listenToFirebaseChanges() {
        CollectionReference collectionRef = firestore.collection(ROAD_ISSUES_COLLECTION);
        
        collectionRef.addSnapshotListener((snapshots, error) -> {
            if (error != null) {
                log.error("Error listening to Firebase changes", error);
                return;
            }

            if (snapshots != null) {
                for (DocumentChange dc : snapshots.getDocumentChanges()) {
                    switch (dc.getType()) {
                        case ADDED:
                            log.info("New road issue added in Firebase: {}", dc.getDocument().getId());
                            // Handle new document
                            break;
                        case MODIFIED:
                            log.info("Road issue modified in Firebase: {}", dc.getDocument().getId());
                            // Handle modified document
                            break;
                        case REMOVED:
                            log.info("Road issue removed from Firebase: {}", dc.getDocument().getId());
                            // Handle removed document
                            break;
                    }
                }
            }
        });
        
        log.info("Started listening to Firebase changes for road issues");
    }

    /**
     * Get sync status - check if Firebase is in sync with local database
     */
    public Map<String, Object> getSyncStatus() {
        try {
            long localCount = roadIssueRepository.count();
            
            ApiFuture<QuerySnapshot> future = firestore.collection(ROAD_ISSUES_COLLECTION).get();
            QuerySnapshot querySnapshot = future.get();
            long firebaseCount = querySnapshot.size();
            
            Map<String, Object> status = new HashMap<>();
            status.put("localCount", localCount);
            status.put("firebaseCount", firebaseCount);
            status.put("inSync", localCount == firebaseCount);
            status.put("lastChecked", Instant.now().toString());
            
            return status;
        } catch (InterruptedException | ExecutionException e) {
            log.error("Error getting sync status", e);
            Thread.currentThread().interrupt();
            
            Map<String, Object> errorStatus = new HashMap<>();
            errorStatus.put("error", e.getMessage());
            return errorStatus;
        }
    }

    /**
     * Convert RoadIssue entity to Firestore map
     */
    private Map<String, Object> convertRoadIssueToMap(RoadIssue issue) {
        Map<String, Object> data = new HashMap<>();
        data.put("id", issue.getId());
        data.put("reporterId", issue.getReporter() != null ? issue.getReporter().getId() : null);
        // data.put("issueType", issue.getIssueType()); // Field does not exist in Entity
        data.put("description", issue.getDescription());
        data.put("latitude", issue.getLatitude());
        data.put("longitude", issue.getLongitude());
        data.put("status", issue.getStatus());
        data.put("photoUrl", issue.getPhotoUrl());
        data.put("createdAt", issue.getCreatedAt() != null ? issue.getCreatedAt().toString() : null);
        data.put("updatedAt", issue.getUpdatedAt() != null ? issue.getUpdatedAt().toString() : null);
        data.put("syncedAt", Instant.now().toString());
        
        return data;
    }
}

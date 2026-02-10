import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCPfzypkvQ8nUhSdFfVwZ90Z6jn9qUjoIs",
    authDomain: "travaux-routiers-mobile.firebaseapp.com",
    projectId: "travaux-routiers-mobile",
    storageBucket: "travaux-routiers-mobile.firebasestorage.app",
    messagingSenderId: "352839760049",
    appId: "1:352839760049:web:620a81f0db894ed8788a90"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;

// Firebase SDK import
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCSeLwfGOuXG2BJvunXBRdiJsTt5JBqijM",
    authDomain: "meenakshi-control-system-8007.firebaseapp.com",
    projectId: "meenakshi-control-system-8007",
    storageBucket: "meenakshi-control-system-8007.firebasestorage.app",
    messagingSenderId: "1035844999798",
    appId: "1:1035844999798:web:1a04cef6a926a0a6bbdd57"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export { app, firebaseConfig };

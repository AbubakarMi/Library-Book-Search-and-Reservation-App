// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA55YvEZWsAMJstq7YyM4LkjD2FnkbUvbs",
  authDomain: "libraryapp-36fe6.firebaseapp.com",
  projectId: "libraryapp-36fe6",
  storageBucket: "libraryapp-36fe6.firebasestorage.app",
  messagingSenderId: "465122546999",
  appId: "1:465122546999:web:8a2f26f7ec35353006b6b2",
  measurementId: "G-KX621ENBW2"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firestore Database
const db = getFirestore(app);

// Initialize Analytics (only on client-side)
const analytics = (typeof window !== "undefined") ? getAnalytics(app) : null;

export { app, db, analytics };

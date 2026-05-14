import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// IMPORTANT: Replace these with your actual Firebase config values
const firebaseConfig = {
  apiKey: "AIzaSyD5Bi5WaWppYMiRxuZeMT0LLIdY49FjqOU",
  authDomain: "it-startup-spa.firebaseapp.com",
  projectId: "it-startup-spa",
  storageBucket: "it-startup-spa.firebasestorage.app",
  messagingSenderId: "861600044413",
  appId: "1:861600044413:web:b68998475393df662be814",
  measurementId: "G-JMTZSKY1JX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };

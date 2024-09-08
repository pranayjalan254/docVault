
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyDz3FCdDiNmAbp11g6P7fUWV6ErgERWne8",
  authDomain: "docvault-7ab87.firebaseapp.com",
  projectId: "docvault-7ab87",
  storageBucket: "docvault-7ab87.appspot.com",
  messagingSenderId: "486304912047",
  appId: "1:486304912047:web:bd605ebc77349ac2917a5a",
  measurementId: "G-R9GYYQVETH"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const database = getFirestore(app);

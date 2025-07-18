// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAw9mpRYKEMVV4_JDvMKPSXEGCcxKt1Qww",
  authDomain: "genfosis-epispan-actionable.firebaseapp.com",
  projectId: "genfosis-epispan-actionable",
  storageBucket: "genfosis-epispan-actionable.appspot.com",
  messagingSenderId: "672418045625",
  appId: "1:672418045625:web:39bc6663f07e007b9c4568",
  measurementId: "G-1MLXMKWS1S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCYibUWxTMEFFl5HbATeaMzZoDHMW5sDrk",
  authDomain: "manga-collection-tracker.firebaseapp.com",
  projectId: "manga-collection-tracker",
  storageBucket: "manga-collection-tracker.firebasestorage.app",
  messagingSenderId: "176412946902",
  appId: "1:176412946902:web:d62a7895adec1ab8247477",
  measurementId: "G-FMKK4XKEB5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);

// Exporta a instância do Firestore
export const db = getFirestore(app);
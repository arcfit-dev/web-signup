import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBDeP6o004nwQxwUlnMRs_naXXo7gCzfb4",
  authDomain: "arcfit-fad43.firebaseapp.com",
  projectId: "arcfit-fad43",
  storageBucket: "arcfit-fad43.firebasestorage.app",
  messagingSenderId: "425872373944",
  appId: "1:425872373944:web:0885145b8e62aaedfedc4d",
  measurementId: "G-YMDLSGE8FM"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCV76nlbXAqpHo8GkmFoGxdHCvKDps2ex4",
  authDomain: "edusister.firebaseapp.com",
  projectId: "edusister",
  storageBucket: "edusister.firebasestorage.app",
  messagingSenderId: "85683269476",
  appId: "1:85683269476:web:57ce27434648582600d471"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export {db, app, auth};

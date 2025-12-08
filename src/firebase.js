// Import Firebase (untuk Auth & Firestore saja)
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Konfigurasi Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAEmp4YcCkOdG109rRh5T5u_-b4cSTVnq8",
  authDomain: "grcas-33e8c.firebaseapp.com",
  projectId: "grcas-33e8c",
  storageBucket: "grcas-33e8c.firebasestorage.app",
  messagingSenderId: "563510995880",
  appId: "1:563510995880:web:989a764b880ef9744e4b9d"
};

// Init Firebase
const app = initializeApp(firebaseConfig);

// EXPORT hanya yang kamu mau tetap pakai
export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();


// Import Firebase (untuk Auth & Firestore saja)
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Konfigurasi Firebase
const firebaseConfig = {
  apiKey: "AIzaSyB5dhGx6pqMT-m--31IsznkNOxdKBRkKqY",
  authDomain: "kelaswebgraciavii.firebaseapp.com",
  projectId: "kelaswebgraciavii",
  storageBucket: "kelaswebgraciavii.appspot.com",
  messagingSenderId: "78780432839",
  appId: "1:78780432839:web:3cc702224ff8df002a59e2"
};

// Init Firebase
const app = initializeApp(firebaseConfig);

// EXPORT hanya yang kamu mau tetap pakai
export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

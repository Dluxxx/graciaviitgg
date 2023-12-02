// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore"

import {getAuth, GoogleAuthProvider} from 'firebase/auth'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB5dhGx6pqMT-m--31IsznkNOxdKBRkKqY",
  authDomain: "kelaswebgraciavii.firebaseapp.com",
  projectId: "kelaswebgraciavii",
  storageBucket: "kelaswebgraciavii.appspot.com",
  messagingSenderId: "78780432839",
  appId: "1:78780432839:web:3cc702224ff8df002a59e2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

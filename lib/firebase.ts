import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Firebase Config (dari Firebase Console Anda)
const firebaseConfig = {
  apiKey: "AIzaSyBTZzzRjzDWNhqv1EI-iw6cgA4QPK-JJ2A",
  authDomain: "rdcvboard.firebaseapp.com",
  projectId: "rdcvboard",
  storageBucket: "rdcvboard.firebasestorage.app",
  messagingSenderId: "275670278685",
  appId: "1:275670278685:web:4ffcd4046561d736ff5cf4",
  measurementId: "G-B68TCW5THJ" // ini boleh tetap ada
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);

// Ekspor auth supaya bisa digunakan di halaman login
export const auth = getAuth(app);

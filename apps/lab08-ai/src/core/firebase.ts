import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDgUm_wVIjFBcP7G12Qv5mj9h1a70D20dI",
  authDomain: "lab06-ionic-firebase-85fa6.firebaseapp.com",
  projectId: "lab06-ionic-firebase-85fa6",
  storageBucket: "lab06-ionic-firebase-85fa6.firebasestorage.app",
  messagingSenderId: "891208220463",
  appId: "1:891208220463:web:18cb8a4f3747c428c7abda",
  measurementId: "G-T0313MQQZC"
};

// ✅ ต้อง export แบบนี้
export const app = initializeApp(firebaseConfig);
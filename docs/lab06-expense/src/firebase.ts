import { initializeApp } from "firebase/app";
// 1. เพิ่มการ Import getFirestore เข้ามา [cite: 53]
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBbxuKLoGCBem70S8ihUk6WUtW4Je2NwQk",
  authDomain: "lab06-ionic-firebase-85fa6.firebaseapp.com",
  projectId: "lab06-ionic-firebase-85fa6",
  storageBucket: "lab06-ionic-firebase-85fa6.firebasestorage.app",
  messagingSenderId: "891208220463",
  appId: "1:891208220463:web:13cb1b69eefebedbc7abda",
  measurementId: "G-BL9T03SGDL"
};

// 2. Initialize Firebase [cite: 59, 60]
const app = initializeApp(firebaseConfig);

// 3. สร้างและ Export ตัวแปร db (Firestore Instance) เพื่อเอาไปใช้ทำ CRUD [cite: 61, 62]
export const db = getFirestore(app);
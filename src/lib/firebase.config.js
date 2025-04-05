// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDJ0wZQnXkCbNShcVHh1vZVRYtAa7Mr4js",
  authDomain: "chess-game-d8f5e.firebaseapp.com",
  databaseURL:
    "https://chess-game-d8f5e-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "chess-game-d8f5e",
  storageBucket: "chess-game-d8f5e.firebasestorage.app",
  messagingSenderId: "458348179757",
  appId: "1:458348179757:web:f587f2dbaeaf8c25c2e3a4",
  measurementId: "G-7Q203CCYCX",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
export { app };

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyALMQJjm4lpRpPWfFNIejkN55d22lU9mhM",
  authDomain: "site-portal-de-noticias.firebaseapp.com",
  projectId: "site-portal-de-noticias",
  storageBucket: "site-portal-de-noticias.firebasestorage.app",
  messagingSenderId: "599416480971",
  appId: "1:599416480971:web:2bb7b43c86fc340e44274e",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;
export const db = getFirestore(app);
export const auth = getAuth(app);

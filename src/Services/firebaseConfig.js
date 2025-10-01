// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAlx72_3hnhblF7CCEyuSY8YsxzKO2mjF8",
  authDomain: "portal-noticias-bd23a.firebaseapp.com",
  projectId: "portal-noticias-bd23a",
  storageBucket: "portal-noticias-bd23a.firebasestorage.app",
  messagingSenderId: "1082091575155",
  appId: "1:1082091575155:web:a3769a358bc222843ad706",
  measurementId: "G-S2VL8PSGSD",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const analytics = getAnalytics(app);
export default app;
export const db = getFirestore(app);
export const auth = getAuth(app);

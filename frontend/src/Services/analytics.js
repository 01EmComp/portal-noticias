import { doc, setDoc, updateDoc, getDoc, increment } from "firebase/firestore";
import { db } from "./firebaseConfig.js";

export async function registerVisit() {
  try {
    const monthKey = new Date().toISOString().slice(0, 7); // "2025-10"
    const monthRef = doc(db, "analytics", "visitors", "monthly", monthKey);

    const snap = await getDoc(monthRef);

    if (snap.exists()) {
      await updateDoc(monthRef, {
        total: increment(1),
        lastUpdate: new Date(),
      });
    } else {
      await setDoc(monthRef, {
        total: 1,
        lastUpdate: new Date(),
      });
    }
  } catch (error) {
    console.error("Erro ao registrar visita:", error);
  }
}

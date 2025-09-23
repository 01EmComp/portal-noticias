import { createUserWithEmailAndPassword } from "firebase/auth";
import { signInWithEmailAndPassword } from "firebase/auth";
import {
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import {
  signOut,
  sendEmailVerification,
  deleteUser,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth, db } from "./firebaseConfig";
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";

// Register with Email And Password function
export async function register(name, email, phone, password) {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  const user = userCredential.user;

  // Salva dados do usuário no Firestore
  await setDoc(doc(db, "users", user.uid), {
    name,
    email,
    phone,
  });

  // Envia email de verificação
  await sendVerificationEmail(user);

  return user;
}

// Login with Email And Password function
export async function login(email, password) {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  const user = userCredential.user;

  if (!user.emailVerified) {
    throw new Error("Email não verificado. Verifique sua caixa de entrada.");
  }

  return user;
}

// Login with Google function
export const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Salva dados no Firestore
    const userRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(userRef);

    if (!docSnap.exists()) {
      await setDoc(userRef, {
        name: user.displayName || "",
        email: user.email || "",
        phone: "",
      });
    }

    return user;
  } catch (err) {
    console.error("Erro login Google:", err);
    throw err;
  }
};

// Login with Facebook function
export const loginWithFacebook = async () => {
  const provider = new FacebookAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Salva dados no Firestore
    const userRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(userRef);

    if (!docSnap.exists()) {
      await setDoc(userRef, {
        name: user.displayName || "",
        email: user.email || "",
        phone: "",
      });
    }

    return user;
  } catch (err) {
    console.error("Erro login Facebook:", err);
    throw err;
  }
};

// Logout function
export async function logout() {
  await signOut(auth);
}

// Email verification function
export const sendVerificationEmail = async (user) => {
  try {
    await sendEmailVerification(user);
    alert("Email de verificação enviado!");
  } catch (err) {
    console.error("Erro ao enviar email de verificação:", err);
  }
};

// email has already been verified fuction
export const isEmailVerified = () => {
  const user = auth.currentUser;
  return user ? user.emailVerified : false;
};

// Delete account function
export const deleteAccount = async () => {
  try {
    const user = auth.currentUser;

    if (!user) return;

    // Opcional: remover dados do Firestore
    const userDocRef = doc(db, "users", user.uid);
    await deleteDoc(userDocRef);
    // Excluir conta no Firebase Auth
    await deleteUser(user);
  } catch (err) {

    alert("Erro ao excluir conta:", err);

    if (err.code === "auth/requires-recent-login") {
      alert("Para excluir a conta, você precisa entrar novamente antes de tentar.");
    }
  }
};

// Reset password
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    alert("Email para redefinir senha enviado!");
  } catch (err) {
    console.error("Erro ao enviar email de redefinição de senha:", err);
  }
};
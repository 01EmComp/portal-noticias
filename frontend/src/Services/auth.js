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
import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  serverTimestamp,
  query,
  collection,
  where,
  getDocs,
} from "firebase/firestore";

// Register with Email And Password function
export async function register(
  name,
  email,
  phone,
  password,
  role = "leitor",
  provider = "email"
) {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return null;
    }

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      name: name,
      email: email,
      phone: phone || "",
      role: role,
      subscriptionType: "free",
      provider: provider,
      emailVerified: false,
      photoURL: user.photoURL || "https://via.placeholder.com/150",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
    });

    await sendVerificationEmail(user);

    return user;
  } catch (error) {
    if (error.code === "auth/email-already-in-use") {
      return null;
    }
    console.error("Erro no registro:", error);
    throw error;
  }
}

export async function login(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    if (!user.emailVerified) {
      throw new Error("Email não verificado. Verifique sua caixa de entrada.");
    }

    const userRef = doc(db, "users", user.uid);
    await setDoc(
      userRef,
      {
        lastLogin: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    return user;
  } catch (error) {
    console.error("Erro no login:", error);
    throw error;
  }
}

// Login with Google function
export const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({
    prompt: "select_account",
  });

  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", user.email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const existingUserDoc = querySnapshot.docs[0];
      const existingUserData = existingUserDoc.data();

      if (existingUserData.provider !== "google") {
        await auth.signOut();
        throw new Error(
          `Este email já está registrado com ${existingUserData.provider}. Use esse método para fazer login.`
        );
      }

      const userRef = doc(db, "users", user.uid);
      await setDoc(
        userRef,
        {
          lastLogin: serverTimestamp(),
          updatedAt: serverTimestamp(),
          emailVerified: true,
        },
        { merge: true }
      );

      return user;
    }

    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, {
      uid: user.uid,
      name: user.displayName || "Usuário",
      email: user.email || "",
      phone: "",
      role: "leitor",
      subscriptionType: "free",
      provider: "google",
      emailVerified: true,
      photoURL: user.photoURL || "https://via.placeholder.com/150",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
    });

    return user;
  } catch (err) {
    console.error("Erro login Google:", err);
    throw err;
  }
};

// Login with Facebook function
export const loginWithFacebook = async () => {
  const provider = new FacebookAuthProvider();
  provider.setCustomParameters({
    display: "popup",
  });

  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", user.email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const existingUserDoc = querySnapshot.docs[0];
      const existingUserData = existingUserDoc.data();

      if (existingUserData.provider !== "facebook") {
        await auth.signOut();
        throw new Error(
          `Este email já está registrado com ${existingUserData.provider}. Use esse método para fazer login.`
        );
      }

      const userRef = doc(db, "users", user.uid);
      await setDoc(
        userRef,
        {
          lastLogin: serverTimestamp(),
          updatedAt: serverTimestamp(),
          emailVerified: true,
        },
        { merge: true }
      );

      return user;
    }

    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, {
      uid: user.uid,
      name: user.displayName || "Usuário",
      email: user.email || "",
      phone: "",
      role: "leitor",
      subscriptionType: "free",
      provider: "facebook",
      emailVerified: true,
      photoURL: user.photoURL || "https://via.placeholder.com/150",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
    });

    return user;
  } catch (err) {
    console.error("Erro login Facebook:", err);
    throw err;
  }
};

// Logout function
export async function logout() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Erro no logout:", error);
    throw error;
  }
}

// Email verification function
export const sendVerificationEmail = async (user) => {
  try {
    await sendEmailVerification(user, {
      url: `${window.location.origin}/login`,
      handleCodeInApp: false,
    });
    console.log("Email de verificação enviado com sucesso!");
  } catch (err) {
    console.error("Erro ao enviar email de verificação:", err);
    throw err;
  }
};

export const isEmailVerified = () => {
  const user = auth.currentUser;
  return user ? user.emailVerified : false;
};

export const getUserData = async (uid) => {
  try {
    const userRef = doc(db, "users", uid);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      return userDoc.data();
    }
    return null;
  } catch (error) {
    console.error("Erro ao buscar dados do usuário:", error);
    throw error;
  }
};

export const hasRole = async (uid, requiredRole) => {
  try {
    const userData = await getUserData(uid);
    return userData && userData.role === requiredRole;
  } catch (error) {
    console.error("Erro ao verificar role:", error);
    return false;
  }
};

// Delete account function (admin)
export const deleteUserAdmin = async (userId) => {
  try {
    await deleteDoc(doc(db, "users", userId));
    console.log("Usuário deletado do Firestore!");
  } catch (error) {
    console.error("Erro ao deletar usuário:", error);
  }
};

// Delete account function (user)
export const deleteAccount = async () => {
  try {
    const user = auth.currentUser;

    if (!user) {
      throw new Error("Nenhum usuário autenticado.");
    }

    const userDocRef = doc(db, "users", user.uid);
    await deleteDoc(userDocRef);

    await deleteUser(user);

    console.log("Conta excluída com sucesso!");
  } catch (err) {
    console.error("Erro ao excluir conta:", err);

    if (err.code === "auth/requires-recent-login") {
      throw new Error(
        "Para excluir a conta, você precisa fazer login novamente."
      );
    }

    throw err;
  }
};

// Reset password
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    console.log("Email para redefinir senha enviado!");
  } catch (err) {
    console.error("Erro ao enviar email de redefinição de senha:", err);
  }
};

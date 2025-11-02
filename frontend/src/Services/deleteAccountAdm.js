import admin from "firebase-admin";

// Inicialize o admin SDK com as credenciais
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

const deleteUserAuth = async (uid) => {
  try {
    await admin.auth().deleteUser(uid);
    console.log("Usuário deletado do Firebase Auth!");
  } catch (error) {
    console.error("Erro ao deletar usuário do Auth:", error);
  }
};

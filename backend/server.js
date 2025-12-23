import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import multer from "multer";
import FormData from "form-data";
import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(cors());
const upload = multer();
app.use(express.json());

// Notifications
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const serviceAccountPath = path.join(__dirname, "serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(
    JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"))
  ),
});

// Listener para mudanças nas notícias
const dbAdmin = admin.firestore();

dbAdmin.collection("news").onSnapshot((snapshot) => {
  snapshot.docChanges().forEach(async (change) => {
    if (change.type === "modified") {
      const newsData = change.doc.data();
      const newsId = change.doc.id;

      console.log(
        "Detectada mudança na notícia:",
        newsId,
        "Título:",
        newsData.title
      );

      const statusFrases = {
        approved: "Sua notícia foi aprovada",
        rejected: "Sua notícia foi rejeitada",
        pending: "Sua notícia está em análise",
      };

      // Verificamos se o status existe
      if (newsData.status) {
        const userId = newsData.author?.uid;

        if (userId) {
          // GARANTIA: Se o title for undefined, usamos um fallback
          const finalTitle = newsData.title || "Notícia sem título";

          await dbAdmin.collection("notifications").add({
            userId: userId,
            newsId: newsId,
            title: finalTitle, // Salvando com garantia
            message: `${
              statusFrases[newsData.status] || "Status atualizado"
            }: ${finalTitle}`,
            status: newsData.status,
            type: "status_update",
            read: false,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
          });
        }
      }
    }
  });
});

// Delete user
app.post("/deleteUser", async (req, res) => {
  try {
    const { uid } = req.body;

    if (!uid) {
      return res.status(400).json({ error: "UID do usuário não informado." });
    }

    await admin.auth().deleteUser(uid);
    await admin.firestore().collection("users").doc(uid).delete();

    return res
      .status(200)
      .json({ message: `Usuário ${uid} deletado com sucesso.` });
  } catch (error) {
    console.error("Erro ao deletar usuário:", error);
    return res
      .status(500)
      .json({ error: "Erro ao deletar usuário.", details: error.message });
  }
});

app.post("/upload", upload.single("fileToUpload"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Nenhum arquivo enviado" });
    }

    const formData = new FormData();
    formData.append("reqtype", "fileupload");
    formData.append("fileToUpload", req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    const response = await fetch("https://catbox.moe/user/api.php", {
      method: "POST",
      body: formData,
      headers: formData.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Erro na resposta: ${response.status}`);
    }

    const imageUrl = (await response.text()).trim();

    if (!imageUrl || imageUrl.includes("error")) {
      throw new Error("Falha ao fazer upload da imagem");
    }

    res.json({ url: imageUrl });
  } catch (err) {
    console.error("Erro no upload:", err);
    res
      .status(500)
      .json({ error: "Erro ao enviar imagem", details: err.message });
  }
});

app.listen(4000, () => console.log("Proxy rodando em http://localhost:4000"));

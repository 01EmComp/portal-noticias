import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import multer from "multer";
import FormData from "form-data";

const app = express();
app.use(cors());
const upload = multer();

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
    res.status(500).json({ error: "Erro ao enviar imagem", details: err.message });
  }
});

app.listen(4000, () => console.log("Proxy rodando em http://localhost:4000"));
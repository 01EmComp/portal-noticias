import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import multer from "multer";

const app = express();
app.use(cors());
const upload = multer();

app.post("/upload", upload.single("fileToUpload"), async (req, res) => {
  try {
    const formData = new FormData();
    formData.append("reqtype", "fileupload");
    formData.append("fileToUpload", req.file.buffer, req.file.originalname);

    const response = await fetch("https://catbox.moe/user/api.php", {
      method: "POST",
      body: formData,
    });

    const imageUrl = (await response.text()).trim();
    res.json({ url: imageUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao enviar imagem" });
  }
});

app.listen(4000, () => console.log("Proxy rodando em http://localhost:4000"));

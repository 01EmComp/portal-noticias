import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

// Auth
import { auth, db } from "/src/Services/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

import "./CreateNews.css";

const CreateNews = () => {
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    category: "",
    image: null,
    text: "",
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [userData, setUserData] = useState(null);
  const [editorContent, setEditorContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState({ type: "", text: "" });
  const editorRef = useRef(null);

  const allowedRoles = ["admin", "editor"];

  const categories = [
    "Política",
    "Economia",
    "Educação",
    "Tecnologia",
    "Saúde",
    "Esportes",
    "Entretenimento",
    "Cultura",
    "Ciência"
  ];

  // Verificação de autenticação
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setUserData(docSnap.data());
          }
        } catch (err) {
          console.error("Erro ao buscar usuário:", err);
        }
      } else {
        setUserData(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (imageFile) => {
    if (!imageFile) return null;

    try {
      const formData = new FormData();
      formData.append("fileToUpload", imageFile);

      const response = await fetch("http://localhost:4000/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Erro ao enviar imagem via proxy");
      }

      const data = await response.json();
      return data.url; // URL

    } catch (error) {
      console.error("Falha no upload da imagem:", error);
      throw error;
    }
  };

  const handleEditorInput = () => {
    if (editorRef.current) {
      setEditorContent(editorRef.current.innerHTML);
    }
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setSubmitMessage({ type: "error", text: "O título é obrigatório" });
      return false;
    }

    if (!formData.subtitle.trim()) {
      setSubmitMessage({ type: "error", text: "O subtítulo é obrigatório" });
      return false;
    }

    if (!formData.category) {
      setSubmitMessage({ type: "error", text: "A categoria é obrigatória" });
      return false;
    }

    if (!formData.image) {
      setSubmitMessage({ type: "error", text: "A imagem é obrigatória" });
      return false;
    }

    if (!editorContent.trim() || editorContent === '<br>') {
      setSubmitMessage({ type: "error", text: "O conteúdo é obrigatório" });
      return false;
    }

    return true;
  };

  // Botão Enviar
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitMessage({ type: "", text: "" });

    try {
      const imageURL = await uploadImage(formData.image);

      // json
      const newsData = {
        title: formData.title,
        subtitle: formData.subtitle,
        category: formData.category,
        imageURL: imageURL,
        content: editorContent,
        status: "pending",
        author: {
          uid: auth.currentUser.uid,
          name: userData.name,
          email: userData.email,
        },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await addDoc(collection(db, "news"), newsData);

      setSubmitMessage({
        type: "success",
        text: "Notícia enviada para avaliação com sucesso!",
      });

      setTimeout(() => {
        handleCancel();
      }, 2000);

    } catch (error) {
      console.error("Erro ao enviar notícia:", error);
      setSubmitMessage({
        type: "error",
        text: "Erro ao enviar notícia. Tente novamente.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Botão Postar
  const handlePost = async () => {
    if (!validateForm()) return;

    if (userData.role !== "Admin") {
      setSubmitMessage({
        type: "error",
        text: "Apenas administradores podem postar diretamente.",
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage({ type: "", text: "" });

    try {
      const imageURL = await uploadImage(formData.image);

      const newsData = {
        title: formData.title,
        subtitle: formData.subtitle,
        category: formData.category,
        imageURL: imageURL,
        content: editorContent,
        status: "published",
        author: {
          uid: auth.currentUser.uid,
          name: userData.name,
          email: userData.email,
        },
        views: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        publishedAt: serverTimestamp(),
      };

      await addDoc(collection(db, "news"), newsData);

      setSubmitMessage({
        type: "success",
        text: "Notícia publicada com sucesso!",
      });

      setTimeout(() => {
        handleCancel();
      }, 2000);

    } catch (error) {
      console.error("Erro ao publicar notícia:", error);
      setSubmitMessage({
        type: "error",
        text: "Erro ao publicar notícia. Tente novamente.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      title: "",
      subtitle: "",
      category: "",
      image: null,
      text: "",
    });

    setImagePreview(null);
    setEditorContent("");
    if (editorRef.current) {
      editorRef.current.innerHTML = "";
    }
    setSubmitMessage({ type: "", text: "" });
  };

  const applyFormat = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  if (!userData) {
    return (
      <div className="not-authenticated">
        <h1>Acesso negado</h1>
        <p>Você precisa estar logado para criar notícias.</p>
        <Link to="/login">
          <button>Fazer login</button>
        </Link>
      </div>
    );
  }

  if (!allowedRoles.includes(userData.role)) {
    return (
      <div className="not-authorized">
        <h1>Permissão negada</h1>
        <p>Você não tem permissão para criar notícias.</p>

        <p className="role-info">
          Apenas usuários com cargo de <strong>Editor</strong> ou{" "}
          <strong>Admin</strong> podem criar notícias.
        </p>
        <Link to="/">
          <button>Voltar para início</button>
        </Link>
      </div>
    );
  }

  return (
    <div className="create-news-container">
      <h1 className="create-news-title">Criar Notícia</h1>

      <div className="create-news-form">
        <div className="form-group">
          <label htmlFor="title" className="form-label">
            Título
          </label>
          <input
            type="text"
            id="title"
            name="title"
            className="form-input"
            placeholder="Insira o título"
            value={formData.title}
            onChange={handleInputChange}
            disabled={isSubmitting}
          />
        </div>

        <div className="form-group">
          <label htmlFor="subtitle" className="form-label">
            Subtítulo
          </label>
          <input
            type="text"
            id="subtitle"
            name="subtitle"
            className="form-input"
            placeholder="Insira o subtítulo"
            value={formData.subtitle}
            onChange={handleInputChange}
            disabled={isSubmitting}
          />
        </div>

        <div className="form-group">
          <label htmlFor="category" className="form-label">
            Categoria
          </label>
          <select
            id="category"
            name="category"
            className="form-select"
            value={formData.category}
            onChange={handleInputChange}
            disabled={isSubmitting}
          >
            <option value="">Selecione uma categoria</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="image-upload" className="image-select-button">
            Selecionar Imagem
          </label>
          <input
            type="file"
            id="image-upload"
            accept="image/*"
            className="image-input-hidden"
            onChange={handleImageSelect}
            disabled={isSubmitting}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Imagem</label>
          <div className="image-preview-container">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                className="image-preview"
              />
            ) : (
              <div className="image-placeholder">
                <svg
                  className="placeholder-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
                <p className="placeholder-text">Preview</p>
              </div>
            )}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Texto</label>

          <div className="editor-toolbar">
            <button
              type="button"
              className="editor-btn"
              onClick={() => applyFormat("bold")}
              title="Negrito (Ctrl+B)"
              disabled={isSubmitting}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M4 2h4.5a3.5 3.5 0 0 1 2.5 6 3.5 3.5 0 0 1-2.5 6H4V2zm4.5 5a1.5 1.5 0 1 0 0-3H6v3h2.5zM6 9v3h2.5a1.5 1.5 0 1 0 0-3H6z" />
              </svg>
            </button>
            <button
              type="button"
              className="editor-btn"
              onClick={() => applyFormat("italic")}
              title="Itálico (Ctrl+I)"
              disabled={isSubmitting}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M6 2h6v2h-2l-2 8h2v2H4v-2h2l2-8H6V2z" />
              </svg>
            </button>
            <button
              type="button"
              className="editor-btn"
              onClick={() => applyFormat("underline")}
              title="Sublinhado (Ctrl+U)"
              disabled={isSubmitting}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 13c2.2 0 4-1.8 4-4V3h-2v6c0 1.1-.9 2-2 2s-2-.9-2-2V3H4v6c0 2.2 1.8 4 4 4zm-6 2h12v1H2v-1z" />
              </svg>
            </button>

            <div className="toolbar-separator"></div>

            <select
              className="editor-select"
              onChange={(e) => {
                applyFormat("formatBlock", e.target.value);
                e.target.value = "";
              }}
              defaultValue=""
              disabled={isSubmitting}
            >
              <option value="" disabled>
                Estilo
              </option>
              <option value="p">Normal</option>
              <option value="h2">Título</option>
              <option value="h3">Subtítulo</option>
            </select>

            <div className="toolbar-separator"></div>

            <button
              type="button"
              className="editor-btn"
              onClick={() => applyFormat("insertUnorderedList")}
              title="Lista com marcadores"
              disabled={isSubmitting}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M2 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3-1h9v1H5V3zm0 5h9v1H5V8zm0 5h9v1H5v-1zM2 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 5a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
              </svg>
            </button>
            <button
              type="button"
              className="editor-btn"
              onClick={() => applyFormat("insertOrderedList")}
              title="Lista numerada"
              disabled={isSubmitting}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M2 2h1v2H2V2zm0 3h1v2H2V5zm0 3h1v2H2V8zm0 3h1v2H2v-2zM5 3h9v1H5V3zm0 5h9v1H5V8zm0 5h9v1H5v-1z" />
              </svg>
            </button>

            <div className="toolbar-separator"></div>

            <button
              type="button"
              className="editor-btn"
              onClick={() => applyFormat("justifyLeft")}
              title="Alinhar à esquerda"
              disabled={isSubmitting}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M2 3h12v1H2V3zm0 3h8v1H2V6zm0 3h12v1H2V9zm0 3h8v1H2v-1z" />
              </svg>
            </button>
            <button
              type="button"
              className="editor-btn"
              onClick={() => applyFormat("justifyCenter")}
              title="Centralizar"
              disabled={isSubmitting}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M2 3h12v1H2V3zm2 3h8v1H4V6zm-2 3h12v1H2V9zm2 3h8v1H4v-1z" />
              </svg>
            </button>
            <button
              type="button"
              className="editor-btn"
              onClick={() => applyFormat("justifyRight")}
              title="Alinhar à direita"
              disabled={isSubmitting}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M2 3h12v1H2V3zm4 3h8v1H6V6zm-4 3h12v1H2V9zm4 3h8v1H6v-1z" />
              </svg>
            </button>

            <div className="toolbar-separator"></div>

            <button
              type="button"
              className="editor-btn"
              onClick={() => applyFormat("createLink", prompt("URL do link:"))}
              title="Inserir link"
              disabled={isSubmitting}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M6.5 10a3.5 3.5 0 0 0 4.95 0l2-2a3.5 3.5 0 0 0-4.95-4.95l-1.15 1.15a.5.5 0 0 1-.7-.7l1.15-1.15a4.5 4.5 0 0 1 6.36 6.36l-2 2a4.5 4.5 0 0 1-6.36 0 .5.5 0 0 1 .7-.7zm-3-3a3.5 3.5 0 0 0 4.95 0 .5.5 0 0 1 .7.7 4.5 4.5 0 0 1-6.36 0l-2-2a4.5 4.5 0 0 1 6.36-6.36l1.15 1.15a.5.5 0 0 1-.7.7L6.45 2.34A3.5 3.5 0 0 0 1.5 7.29l2 2z" />
              </svg>
            </button>
          </div>

          <div
            ref={editorRef}
            className="editor-content"
            contentEditable
            onInput={handleEditorInput}
            data-placeholder="Por favor, insira o conteúdo da notícia..."
            suppressContentEditableWarning
          />
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn-cancel"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Enviando..." : "Enviar"}
          </button>
          <button
            type="button"
            className="btn-post"
            onClick={handlePost}
            disabled={isSubmitting || userData.role !== "Admin"}
            title={
              userData.role !== "Admin"
                ? "Apenas administradores podem postar diretamente"
                : "Publicar notícia imediatamente"
            }
          >
            {isSubmitting ? "Publicando..." : "Postar"}
          </button>
        </div>

        {/* Mensagem de feedback */}
        {submitMessage.text && (
          <div className={`submit-message ${submitMessage.type}`}>
            {submitMessage.text}
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateNews;
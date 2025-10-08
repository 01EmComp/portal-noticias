import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// Auth
import { auth, db } from "/src/Services/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

import "./CreateNews.css";

const CreateNews = () => {
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    image: null,
    text: "",
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [userData, setUserData] = useState(null);
  const [editorContent, setEditorContent] = useState("");

  const allowedRoles = ["Admin", "Editor"];

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

  const handleSubmit = () => {
    const submitData = {
      ...formData,
      text: editorContent
    };

    console.log("Dados do formulário:", submitData);
    //enviar ao firebase
  };

  const handleCancel = () => {
    
    setFormData({
      title: "",
      subtitle: "",
      image: null,
      text: "",
    });

    setImagePreview(null);
    setEditorContent("");
  };

  const applyFormat = (command, value = null) => {
    document.execCommand(command, false, value);
  };

  const handleEditorInput = (e) => {
    setEditorContent(e.target.innerHTML);
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

        <p className="role-info">Apenas usuários com cargo de <strong>Editor</strong> ou <strong>Admin</strong> podem criar notícias.</p>
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
          />
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
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M4 2h4.5a3.5 3.5 0 0 1 2.5 6 3.5 3.5 0 0 1-2.5 6H4V2zm4.5 5a1.5 1.5 0 1 0 0-3H6v3h2.5zM6 9v3h2.5a1.5 1.5 0 1 0 0-3H6z"/>
              </svg>
            </button>
            <button
              type="button"
              className="editor-btn"
              onClick={() => applyFormat("italic")}
              title="Itálico (Ctrl+I)"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M6 2h6v2h-2l-2 8h2v2H4v-2h2l2-8H6V2z"/>
              </svg>
            </button>
            <button
              type="button"
              className="editor-btn"
              onClick={() => applyFormat("underline")}
              title="Sublinhado (Ctrl+U)"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 13c2.2 0 4-1.8 4-4V3h-2v6c0 1.1-.9 2-2 2s-2-.9-2-2V3H4v6c0 2.2 1.8 4 4 4zm-6 2h12v1H2v-1z"/>
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
            >
              <option value="" disabled>Estilo</option>
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
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M2 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3-1h9v1H5V3zm0 5h9v1H5V8zm0 5h9v1H5v-1zM2 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 5a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
              </svg>
            </button>
            <button
              type="button"
              className="editor-btn"
              onClick={() => applyFormat("insertOrderedList")}
              title="Lista numerada"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M2 2h1v2H2V2zm0 3h1v2H2V5zm0 3h1v2H2V8zm0 3h1v2H2v-2zM5 3h9v1H5V3zm0 5h9v1H5V8zm0 5h9v1H5v-1z"/>
              </svg>
            </button>
            
            <div className="toolbar-separator"></div>
            
            <button
              type="button"
              className="editor-btn"
              onClick={() => applyFormat("justifyLeft")}
              title="Alinhar à esquerda"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M2 3h12v1H2V3zm0 3h8v1H2V6zm0 3h12v1H2V9zm0 3h8v1H2v-1z"/>
              </svg>
            </button>
            <button
              type="button"
              className="editor-btn"
              onClick={() => applyFormat("justifyCenter")}
              title="Centralizar"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M2 3h12v1H2V3zm2 3h8v1H4V6zm-2 3h12v1H2V9zm2 3h8v1H4v-1z"/>
              </svg>
            </button>
            <button
              type="button"
              className="editor-btn"
              onClick={() => applyFormat("justifyRight")}
              title="Alinhar à direita"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M2 3h12v1H2V3zm4 3h8v1H6V6zm-4 3h12v1H2V9zm4 3h8v1H6v-1z"/>
              </svg>
            </button>
            
            <div className="toolbar-separator"></div>
            
            <button
              type="button"
              className="editor-btn"
              onClick={() => applyFormat("createLink", prompt("URL do link:"))}
              title="Inserir link"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M6.5 10a3.5 3.5 0 0 0 4.95 0l2-2a3.5 3.5 0 0 0-4.95-4.95l-1.15 1.15a.5.5 0 0 1-.7-.7l1.15-1.15a4.5 4.5 0 0 1 6.36 6.36l-2 2a4.5 4.5 0 0 1-6.36 0 .5.5 0 0 1 .7-.7zm-3-3a3.5 3.5 0 0 0 4.95 0 .5.5 0 0 1 .7.7 4.5 4.5 0 0 1-6.36 0l-2-2a4.5 4.5 0 0 1 6.36-6.36l1.15 1.15a.5.5 0 0 1-.7.7L6.45 2.34A3.5 3.5 0 0 0 1.5 7.29l2 2z"/>
              </svg>
            </button>
          </div>

          <div
            className="editor-content"
            contentEditable
            onInput={handleEditorInput}
            dangerouslySetInnerHTML={{ __html: editorContent }}
            data-placeholder="Por favor, insira o conteúdo da notícia..."
          />
        </div>

        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={handleCancel}>
            Enviar
          </button>
          <button type="button" className="btn-post" onClick={handleSubmit}>
            Postar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateNews;
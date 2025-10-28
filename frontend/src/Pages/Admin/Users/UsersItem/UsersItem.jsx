import { useState } from "react";
import { db } from "/src/Services/firebaseConfig";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";

// Font Awesome Icon's
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";

// Css
import "./UsersItem.css";

const UsersItem = ({ id, name, email, role }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState({ type: "", text: "" });
  
  const [formData, setFormData] = useState({
    name: name || "",
    email: email || "",
    role: role || "user"
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSave = async () => {
    if (!id) return;

    if (!formData.name.trim()) {
      setFeedbackMessage({
        type: "error",
        text: "O nome não pode estar vazio."
      });
      return;
    }

    if (!formData.email.trim() || !formData.email.includes("@")) {
      setFeedbackMessage({
        type: "error",
        text: "Por favor, insira um email válido."
      });
      return;
    }

    setIsUpdating(true);
    setFeedbackMessage({ type: "", text: "" });

    try {
      const userRef = doc(db, "users", id);
      await updateDoc(userRef, {
        name: formData.name.trim(),
        email: formData.email.trim(),
        role: formData.role,
        updatedAt: serverTimestamp()
      });

      setFeedbackMessage({
        type: "success",
        text: "Usuário atualizado com sucesso!"
      });

      setTimeout(() => {
        setShowPopup(false);
        setFeedbackMessage({ type: "", text: "" });
      }, 1500);
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      setFeedbackMessage({
        type: "error",
        text: "Erro ao atualizar usuário. Tente novamente."
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleOpenPopup = () => {
    setFormData({
      name: name || "",
      email: email || "",
      role: role || "user"
    });
    setFeedbackMessage({ type: "", text: "" });
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    if (!isUpdating) {
      setShowPopup(false);
    }
  };

  const translateRole = (roleValue) => {
    const roleMap = {
      user: "Usuário",
      admin: "Administrador",
      editor: "Editor"
    };
    return roleMap[roleValue] || roleValue;
  };

  return (
    <>
      <div className="users-item">
        <div className="user-name">{name}</div>
        <div className="user-email">{email}</div>
        <div className="user-actions">
          <button 
            className="user-action-button"
            onClick={handleOpenPopup}
            disabled={isUpdating}
            type="button"
          >
            <FontAwesomeIcon icon={faGear} />
          </button>
        </div>
      </div>

      {showPopup && (
        <div 
          className="popup-overlay" 
          onClick={handleClosePopup}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div 
            className="popup-container" 
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="popup-header">
              <h3>Configurar Usuário</h3>
              <button 
                className="popup-close-btn" 
                onClick={handleClosePopup}
                disabled={isUpdating}
                type="button"
              >
                ×
              </button>
            </div>

            <div className="popup-body">
              {/* Informações do usuário */}
              <div className="user-info-display">
                <h4>{name}</h4>
                <div className="info-item">
                  <span className="label">Autor:</span>
                  <span className="value">{name}</span>
                </div>
                <div className="info-item">
                  <span className="label">Email:</span>
                  <span className="value">{email}</span>
                </div>
                <div className="info-item">
                  <span className="label">Função:</span>
                  <span className="value">{translateRole(role || "user")}</span>
                </div>
              </div>

              <div className="popup-divider"></div>

              {/* Formulário de edição */}
              <div className="user-edit-form">
                <div className="form-field">
                  <label htmlFor="user-name">Nome</label>
                  <input
                    type="text"
                    id="user-name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={isUpdating}
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="user-email">Email</label>
                  <input
                    type="email"
                    id="user-email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={isUpdating}
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="user-role">Função</label>
                  <select
                    id="user-role"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    disabled={isUpdating}
                  >
                    <option value="user">Usuário</option>
                    <option value="editor">Editor</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>
              </div>

              {/* Mensagem de feedback */}
              {feedbackMessage.text && (
                <div className={`popup-feedback ${feedbackMessage.type}`}>
                  {feedbackMessage.text}
                </div>
              )}

              <div className="popup-actions">
                <button 
                  className="btn-save" 
                  onClick={handleSave}
                  disabled={isUpdating}
                  type="button"
                >
                  {isUpdating ? "Salvando..." : "Salvar"}
                </button>
                <button 
                  className="btn-close" 
                  onClick={handleClosePopup}
                  disabled={isUpdating}
                  type="button"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UsersItem;
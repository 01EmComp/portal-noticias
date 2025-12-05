import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

// Auth
import { auth, db } from "/src/Services/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { logout } from "/src/Services/auth.js";
import { doc, getDoc, updateDoc } from "firebase/firestore";

// Font Awesome Icon's
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import {
  faUser,
  faChevronDown,
  faChevronUp,
  faCog,
  faTimes,
  faEnvelope,
  faPhone,
  faUserTag,
  faCalendar,
  faSignInAlt,
  faIdCard,
  faPencilAlt,
  faFileAlt,
} from "@fortawesome/free-solid-svg-icons";
import { faGoogle, faFacebook } from "@fortawesome/free-brands-svg-icons";

// CSS
import "./Profile.css";

const Profile = () => {
  const [showMoreArticles, setShowMoreArticles] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [showDataPopup, setShowDataPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSettingsPopup, setShowSettingsPopup] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const navigate = useNavigate();

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
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Aplica configurações ao carregar
  useEffect(() => {
    if (userData?.settings) {
      applySettings(userData.settings);
    }
  }, [userData]);

  if (loading) return <p className="loading-data">Carregando...</p>;

  if (!userData)
    return (
      <div className="not-authenticated">
        <h1>Nenhum dado encontrado.</h1>
        <Link to="/login">
          <button>Fazer login</button>
        </Link>
      </div>
    );

  // Pegar histórico de notícias lidas
  const readingHistory = userData.readingHistory || [];
  
  const displayedArticles = showMoreArticles ? readingHistory : readingHistory.slice(0, 3);
  const hasMoreArticles = readingHistory.length > 3;

  const handleSeeMore = async () => {
    if (!showMoreArticles) {
      setIsLoadingMore(true);
      await new Promise((resolve) => setTimeout(resolve, 800));
      setIsLoadingMore(false);
    }

    setShowMoreArticles(!showMoreArticles);
  };

  const handleSaveSettings = async (newSettings) => {
    if (!auth.currentUser) return;

    setSavingSettings(true);
    try {
      const userRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userRef, {
        settings: newSettings,
      });

      setUserData((prev) => ({
        ...prev,
        settings: newSettings,
      }));

      applySettings(newSettings);

      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);
    } catch (error) {
      console.error("Erro ao salvar configurações:", error);
      alert("Erro ao salvar configurações. Tente novamente.");
    } finally {
      setSavingSettings(false);
    }
  };

  const applySettings = (settings) => {
    if (!settings) return;

    document.documentElement.setAttribute(
      "data-theme",
      settings.theme || "light"
    );

    document.documentElement.style.fontSize = `${settings.fontSize || 16}px`;

    if (settings.highContrast) {
      document.body.classList.add("high-contrast");
    } else {
      document.body.classList.remove("high-contrast");
    }

    if (settings.hideImages) {
      document.body.classList.add("hide-images");
    } else {
      document.body.classList.remove("hide-images");
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "Não disponível";

    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatTimeAgo = (dateString) => {
    if (!dateString) return "Agora";
    
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Agora";
    if (diffMins < 60) return `${diffMins}min atrás`;
    if (diffHours < 24) return `${diffHours}h atrás`;
    if (diffDays === 1) return "Ontem";
    if (diffDays < 7) return `${diffDays}d atrás`;
    
    return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
  };

  const getProviderIcon = (provider) => {
    switch (provider) {
      case "google":
        return faGoogle;
      case "facebook":
        return faFacebook;
      default:
        return faEnvelope;
    }
  };

  const getProviderName = (provider) => {
    switch (provider) {
      case "google":
        return "Google";
      case "facebook":
        return "Facebook";
      case "email":
        return "E-mail";
      default:
        return provider || "E-mail";
    }
  };

  const getRoleName = (role) => {
    switch (role) {
      case "admin":
        return "Administrador";
      case "editor":
        return "Editor";
      case "leitor":
        return "Leitor";
      default:
        return role || "Leitor";
    }
  };

  const handleArticleClick = (articleId) => {
    navigate(`/news/${articleId}`);
  };

  const EditPopup = () => {
    const [editData, setEditData] = useState({
      name: userData.name || "",
      phone: userData.phone || "",
      description: userData.description || "",
    });
    const [saving, setSaving] = useState(false);

    const canEditDescription = userData.role === "editor" || userData.role === "admin";

    const handleSave = async () => {
      if (!auth.currentUser) return;

      // Validações
      if (!editData.name.trim()) {
        alert("O nome não pode estar vazio!");
        return;
      }

      if (editData.phone && !/^\d{10,11}$/.test(editData.phone.replace(/\D/g, ""))) {
        alert("Digite um telefone válido (10 ou 11 dígitos)!");
        return;
      }

      setSaving(true);
      try {
        const userRef = doc(db, "users", auth.currentUser.uid);
        const updateData = {
          name: editData.name.trim(),
          phone: editData.phone.trim(),
        };

        if (canEditDescription) {
          updateData.description = editData.description.trim();
        }

        await updateDoc(userRef, updateData);

        setUserData((prev) => ({
          ...prev,
          ...updateData,
        }));

        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 3000);
        setShowEditPopup(false);
      } catch (error) {
        console.error("Erro ao salvar dados:", error);
        alert("Erro ao salvar dados. Tente novamente.");
      } finally {
        setSaving(false);
      }
    };

    const handleClose = () => {
      setShowEditPopup(false);
    };

    const formatPhoneInput = (value) => {
      const numbers = value.replace(/\D/g, "");
      if (numbers.length <= 10) {
        return numbers.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
      }
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    };

    return (
      <div className="settings-overlay" onClick={handleClose}>
        <div className="settings-popup" onClick={(e) => e.stopPropagation()}>
          <div className="settings-header">
            <h2>Editar Dados</h2>
            <button className="close-button" onClick={handleClose}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>

          <div className="edit-popup-content">
            <div className="edit-field">
              <label>
                <FontAwesomeIcon icon={faUser} className="field-icon" />
                Nome completo *
              </label>
              <input
                type="text"
                value={editData.name}
                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                placeholder="Digite seu nome completo"
                maxLength={100}
              />
            </div>

            <div className="edit-field">
              <label>
                <FontAwesomeIcon icon={faPhone} className="field-icon" />
                Telefone
              </label>
              <input
                type="tel"
                value={editData.phone}
                onChange={(e) => {
                  const formatted = formatPhoneInput(e.target.value);
                  setEditData({ ...editData, phone: formatted });
                }}
                placeholder="(00) 00000-0000"
                maxLength={15}
              />
            </div>

            {canEditDescription && (
              <div className="edit-field">
                <label>
                  <FontAwesomeIcon icon={faFileAlt} className="field-icon" />
                  Descrição
                </label>
                <textarea
                  value={editData.description}
                  onChange={(e) =>
                    setEditData({ ...editData, description: e.target.value })
                  }
                  placeholder="Escreva uma breve descrição sobre você..."
                  rows={4}
                  maxLength={500}
                />
                <span className="char-count">
                  {editData.description.length}/500
                </span>
              </div>
            )}
          </div>

          <div className="settings-footer">
            <button className="cancel-button" onClick={handleClose}>
              Cancelar
            </button>
            <button
              className="save-button"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Salvando..." : "Salvar alterações"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const DataPopup = () => {
    const handleClose = () => {
      setShowDataPopup(false);
    };

    const handleEditField = (field) => {
      setShowDataPopup(false);
      setShowEditPopup(true);
    };

    const canEditDescription = userData.role === "editor" || userData.role === "admin";

    return (
      <div className="settings-overlay" onClick={handleClose}>
        <div className="settings-popup" onClick={(e) => e.stopPropagation()}>
          <div className="settings-header">
            <h2>Meus Dados</h2>
            <button className="close-button" onClick={handleClose}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>

          <div className="data-popup-content">
            <div className="user-data-item editable" onClick={() => handleEditField('name')}>
              <div className="data-icon">
                <FontAwesomeIcon icon={faUser} />
              </div>
              <div className="data-content">
                <p className="data-label">Nome</p>
                <span className="data-value">
                  {userData.name || "Não fornecido"}
                </span>
              </div>
              <button className="field-edit-button" title="Editar nome">
                <FontAwesomeIcon icon={faPencilAlt} />
              </button>
            </div>

            <div className="user-data-item">
              <div className="data-icon">
                <FontAwesomeIcon icon={faEnvelope} />
              </div>
              <div className="data-content">
                <p className="data-label">E-mail</p>
                <span className="data-value">
                  {userData.email || "Não fornecido"}
                </span>
              </div>
            </div>

            <div className="user-data-item editable" onClick={() => handleEditField('phone')}>
              <div className="data-icon">
                <FontAwesomeIcon icon={faPhone} />
              </div>
              <div className="data-content">
                <p className="data-label">Telefone</p>
                <span className="data-value">
                  {userData.phone || "Não fornecido"}
                </span>
              </div>
              <button className="field-edit-button" title="Editar telefone">
                <FontAwesomeIcon icon={faPencilAlt} />
              </button>
            </div>

            {canEditDescription && (
              <div className="user-data-item editable" onClick={() => handleEditField('description')}>
                <div className="data-icon">
                  <FontAwesomeIcon icon={faFileAlt} />
                </div>
                <div className="data-content">
                  <p className="data-label">Descrição</p>
                  <span className="data-value">
                    {userData.description || "Não fornecido"}
                  </span>
                </div>
                <button className="field-edit-button" title="Editar descrição">
                  <FontAwesomeIcon icon={faPencilAlt} />
                </button>
              </div>
            )}

            <div className="user-data-item">
              <div className="data-icon">
                <FontAwesomeIcon icon={faUserTag} />
              </div>
              <div className="data-content">
                <p className="data-label">Tipo de conta</p>
                <span className="data-value">{getRoleName(userData.role)}</span>
              </div>
            </div>

            <div className="user-data-item">
              <div className="data-icon">
                <FontAwesomeIcon icon={getProviderIcon(userData.provider)} />
              </div>
              <div className="data-content">
                <p className="data-label">Método de login</p>
                <span className="data-value">
                  {getProviderName(userData.provider)}
                </span>
              </div>
            </div>

            <div className="user-data-item">
              <div className="data-icon">
                <FontAwesomeIcon icon={faIdCard} />
              </div>
              <div className="data-content">
                <p className="data-label">ID do usuário</p>
                <span className="data-value user-id">
                  {userData.uid || "Não disponível"}
                </span>
              </div>
            </div>

            <div className="user-data-item">
              <div className="data-icon">
                <FontAwesomeIcon icon={faCalendar} />
              </div>
              <div className="data-content">
                <p className="data-label">Conta criada em</p>
                <span className="data-value">
                  {formatDate(userData.createdAt)}
                </span>
              </div>
            </div>

            <div className="user-data-item">
              <div className="data-icon">
                <FontAwesomeIcon icon={faSignInAlt} />
              </div>
              <div className="data-content">
                <p className="data-label">Último acesso</p>
                <span className="data-value">
                  {formatDate(userData.lastLogin)}
                </span>
              </div>
            </div>
          </div>

          <div className="settings-footer">
            <button className="save-button" onClick={handleClose}>
              Fechar
            </button>
          </div>
        </div>
      </div>
    );
  };

  const SettingsPopup = () => {
    const defaultSettings = {
      theme: "light",
      language: "pt",
      emailNotifications: false,
      fontSize: 16,
      hideImages: false,
      highContrast: false,
    };

    const [tempSettings, setTempSettings] = useState(
      userData?.settings || defaultSettings
    );

    useEffect(() => {
      applySettings(tempSettings);
    }, [tempSettings]);

    const handleSave = () => {
      handleSaveSettings(tempSettings);
      setShowSettingsPopup(false);
    };

    const handleCancel = () => {
      if (userData?.settings) {
        applySettings(userData.settings);
      } else {
        applySettings(defaultSettings);
      }
      setShowSettingsPopup(false);
    };

    // Sair da conta
    const handleLogout = async () => {
      setLoading(true);
      try {
        const optionInput = confirm("Realmente deseja sair da conta?");
        if (optionInput) {
          logout();
          navigate("/");
        }
      } catch (err) {
        alert(err);
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="settings-overlay" onClick={handleCancel}>
        <div className="settings-popup" onClick={(e) => e.stopPropagation()}>
          <div className="settings-header">
            <h2>Configurações</h2>
            <button className="close-button" onClick={handleCancel}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>

          <div className="settings-content">
            {/* Tema */}
            <div className="setting-item">
              <label>Tema</label>
              <div className="theme-selector">
                <button
                  className={`theme-option ${
                    tempSettings.theme === "light" ? "active" : ""
                  }`}
                  onClick={() =>
                    setTempSettings({ ...tempSettings, theme: "light" })
                  }
                >
                  Claro
                </button>
                <button
                  className={`theme-option ${
                    tempSettings.theme === "dark" ? "active" : ""
                  }`}
                  onClick={() =>
                    setTempSettings({ ...tempSettings, theme: "dark" })
                  }
                >
                  Escuro
                </button>
              </div>
            </div>

            {/* Idioma */}
            <div className="setting-item">
              <label>Idioma</label>
              <select
                value={tempSettings.language}
                onChange={(e) =>
                  setTempSettings({ ...tempSettings, language: e.target.value })
                }
                className="language-select"
              >
                <option value="pt">Português</option>
                <option value="en">English</option>
              </select>
            </div>

            {/* Notificações por Email */}
            <div className="setting-item">
              <label>Notificações por e-mail</label>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={tempSettings.emailNotifications}
                  onChange={(e) =>
                    setTempSettings({
                      ...tempSettings,
                      emailNotifications: e.target.checked,
                    })
                  }
                />
                <span className="slider"></span>
              </label>
            </div>

            {/* Tamanho da Fonte */}
            <div className="setting-item">
              <label>Tamanho da fonte</label>
              <div className="font-size-control">
                <span className="font-size-label">A</span>
                <input
                  type="range"
                  min="10"
                  max="28"
                  value={tempSettings.fontSize}
                  onChange={(e) =>
                    setTempSettings({
                      ...tempSettings,
                      fontSize: parseInt(e.target.value),
                    })
                  }
                  className="font-size-slider"
                />
                <span className="font-size-label large">A</span>
              </div>
              <p
                className="font-preview"
                style={{ fontSize: `${tempSettings.fontSize}px` }}
              >
                Exemplo de texto com o tamanho selecionado
              </p>
            </div>

            {/* Ocultar Imagens */}
            <div className="setting-item">
              <label>Ocultar imagens (economizar dados)</label>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={tempSettings.hideImages}
                  onChange={(e) =>
                    setTempSettings({
                      ...tempSettings,
                      hideImages: e.target.checked,
                    })
                  }
                />
                <span className="slider"></span>
              </label>
            </div>

            {/* Contraste Alto */}
            <div className="setting-item">
              <label>Modo de alto contraste</label>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={tempSettings.highContrast}
                  onChange={(e) =>
                    setTempSettings({
                      ...tempSettings,
                      highContrast: e.target.checked,
                    })
                  }
                />
                <span className="slider"></span>
              </label>
            </div>

            {/* Fazer logout */}
            <div className="setting-item" onClick={() => handleLogout()}>
              <button className="Btn">
                <div className="sign">
                  <svg viewBox="0 0 512 512">
                    <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path>
                  </svg>
                </div>

                <div className="text">Sair da conta</div>
              </button>
            </div>
          </div>

          <div className="settings-footer">
            <button className="cancel-button" onClick={handleCancel}>
              Cancelar
            </button>
            <button
              className="save-button"
              onClick={handleSave}
              disabled={savingSettings}
            >
              {savingSettings ? "Salvando..." : "Salvar configurações"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="profile-container">
      {showSettingsPopup && <SettingsPopup />}
      {showDataPopup && <DataPopup />}
      {showEditPopup && <EditPopup />}
      {showSuccessToast && (
        <div className="success-toast">
          <span className="toast-icon">✓</span>
          Dados salvos com sucesso!
        </div>
      )}

      <div className="profile-frame">
        <div className="profile-card">
          <div className="profile-avatar">
            {userData.photoURL ? (
              <img
                src={userData.photoURL}
                alt="Foto de perfil"
                className="profile-image"
              />
            ) : (
              <FontAwesomeIcon icon={faUser} />
            )}
          </div>
          <div className="profile-text">
            <h1>Bem-vindo!</h1>
            <p>{userData.name}</p>
          </div>
          <button
            className="settings-icon-button"
            onClick={() => setShowSettingsPopup(true)}
            title="Configurações"
          >
            <FontAwesomeIcon icon={faCog} />
          </button>
        </div>
      </div>

      {/* Botão Meus Dados */}
      <div className="data-section">
        <button className="data-button" onClick={() => setShowDataPopup(true)}>
          Meus Dados
        </button>
      </div>

      {/* Notícias */}
      <div className="articles-section">
        <h3>Lidas recentemente</h3>
        
        {readingHistory.length === 0 ? (
          <div className="no-articles">
            <p>Você ainda não leu nenhuma notícia.</p>
            <Link to="/">
              <button className="browse-button">Explorar notícias</button>
            </Link>
          </div>
        ) : (
          <>
            {displayedArticles.map((article) => (
              <div 
                key={article.id} 
                className="article-item"
                onClick={() => handleArticleClick(article.id)}
              >
                <div className="article-image">
                  <img src={article.imageURL} alt={article.title} />
                </div>
                <div className="article-content">
                  <h3>{article.title}</h3>
                  <span className="article-category">{article.category}</span>
                  <div className="article-meta">
                    <div className="article-time">
                      <FontAwesomeIcon icon={faClock} />
                      <span>{formatTimeAgo(article.readAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Loading */}
            {isLoadingMore && (
              <div className="articles-loading">
                <div className="loading-spinner"></div>
              </div>
            )}

            {/* Ver Mais */}
            {hasMoreArticles && !isLoadingMore && (
              <div className="see-more-container">
                <button
                  className={`see-more-button ${
                    showMoreArticles ? "expanded" : ""
                  }`}
                  onClick={handleSeeMore}
                >
                  <span>{showMoreArticles ? "Ver menos" : "Ver mais"}</span>
                  <FontAwesomeIcon
                    icon={showMoreArticles ? faChevronUp : faChevronDown}
                  />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
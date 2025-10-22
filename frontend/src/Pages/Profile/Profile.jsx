import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

// Auth
import { auth, db } from "/src/Services/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";

// Images
import img1 from "/src/Assets/Images/art-1.jpg";

// Font Awesome Icon's
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import {
  faUser,
  faChevronDown,
  faChevronUp,
  faCog,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

// CSS
import "./Profile.css";

const Profile = () => {
  const [showMoreArticles, setShowMoreArticles] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [dataButtonClicked, setDataButtonClicked] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSettingsPopup, setShowSettingsPopup] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Informations about users
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // pega o doc do usuário pelo UID
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

  const articles = [
    {
      id: 1,
      title: "ENEM: Como se preparar para o ENEM 2025?",
      category: "Educação",
      source: "BBC News",
      timeAgo: "12h atrás",
      image: img1,
    },
    {
      id: 2,
      title: "ENEM: Como se preparar para o ENEM 2025?",
      category: "Educação",
      source: "BBC News",
      timeAgo: "12h atrás",
      image: img1,
    },
    {
      id: 3,
      title: "ENEM: Como se preparar para o ENEM 2025?",
      category: "Educação",
      source: "BBC News",
      timeAgo: "12h atrás",
      image: img1,
    },
    {
      id: 4,
      title: "ENEM: Como se preparar para o ENEM 2025?",
      category: "Educação",
      source: "BBC News",
      timeAgo: "12h atrás",
      image: img1,
    },
    {
      id: 5,
      title: "ENEM: Como se preparar para o ENEM 2025?",
      category: "Tecnologia",
      source: "TechNews",
      timeAgo: "1d atrás",
      image: img1,
    },
    {
      id: 6,
      title: "ENEM: Como se preparar para o ENEM 2025?",
      category: "Educação",
      source: "Estuda.com",
      timeAgo: "2d atrás",
      image: img1,
    },
  ];

  const displayedArticles = showMoreArticles ? articles : articles.slice(0, 3);
  const hasMoreArticles = articles.length > 3;

  const handleSeeMore = async () => {
    if (!showMoreArticles) {
      setIsLoadingMore(true);
      await new Promise((resolve) => setTimeout(resolve, 800));
      setIsLoadingMore(false);
    }

    setShowMoreArticles(!showMoreArticles);
  };

  const handleDataButtonClick = () => {
    setDataButtonClicked((prev) => !prev);
  };

  const handleSaveSettings = async (newSettings) => {
    if (!auth.currentUser) return;

    setSavingSettings(true);
    try {
      const userRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userRef, {
        settings: newSettings,
      });

      // Atualiza o estado local
      setUserData((prev) => ({
        ...prev,
        settings: newSettings,
      }));

      // Aplica as configurações imediatamente
      applySettings(newSettings);

      // Mostra toast de sucesso
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

    // Aplica tema
    document.documentElement.setAttribute(
      "data-theme",
      settings.theme || "light"
    );

    // Aplica tamanho da fonte
    document.documentElement.style.fontSize = `${settings.fontSize || 16}px`;

    // Aplica contraste alto
    if (settings.highContrast) {
      document.body.classList.add("high-contrast");
    } else {
      document.body.classList.remove("high-contrast");
    }

    // Aplica ocultar imagens
    if (settings.hideImages) {
      document.body.classList.add("hide-images");
    } else {
      document.body.classList.remove("hide-images");
    }
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

    // Aplica configurações temporárias em tempo real
    useEffect(() => {
      applySettings(tempSettings);
    }, [tempSettings]);

    const handleSave = () => {
      handleSaveSettings(tempSettings);
      setShowSettingsPopup(false);
    };

    const handleCancel = () => {
      // Reverte para as configurações salvas
      if (userData?.settings) {
        applySettings(userData.settings);
      } else {
        applySettings(defaultSettings);
      }
      setShowSettingsPopup(false);
    };

    return (
      <div className="settings-overlay" onClick={handleCancel}>
        <div className="settings-popup" onClick={(e) => e.stopPropagation()}>
          <div className="settings-header">
            <h2>Configurações</h2>
            <button
              className="close-button"
              onClick={handleCancel}
            >
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
              <p className="font-preview" style={{ fontSize: `${tempSettings.fontSize}px` }}>
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
          </div>

          <div className="settings-footer">
            <button
              className="cancel-button"
              onClick={handleCancel}
            >
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
      {showSuccessToast && (
        <div className="success-toast">
          <span className="toast-icon">✓</span>
          Configurações salvas com sucesso!
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
        <button className="data-button" onClick={handleDataButtonClick}>
          {dataButtonClicked ? "Fechar" : "Meus Dados"}
        </button>
      </div>

      {/* Dados do Usuário */}
      {dataButtonClicked && (
        <div className="my-data-section">
          <h3>Meus dados</h3>
          <div className="user-name">
            <p>Nome:</p>
            <span>{userData.name ? userData.name : "Não fornecido"}</span>
          </div>
          <div className="user-email">
            <p>Email:</p>
            <span>{userData.email ? userData.email : "Não fornecido"}</span>
          </div>
          <div className="user-phone">
            <p>Telefone:</p>
            <span>{userData.phone ? userData.phone : "Não fornecido"}</span>
          </div>
          <div className="user-role">
            <p>Tipo de conta:</p>
            <span>{userData.role ? userData.role : "Leitor"}</span>
          </div>
        </div>
      )}

      {/* Notícias */}
      <div className="articles-section">
        <h3>Lidas recentemente</h3>
        {displayedArticles.map((article) => (
          <div key={article.id} className="article-item">
            <div className="article-image">
              <img src={article.image} alt={article.title} />
            </div>
            <div className="article-content">
              <h3>{article.title}</h3>
              <span className="article-category">{article.category}</span>
              <div className="article-meta">
                <span className="article-source">{article.source}</span>
                <div className="meta-separator">•</div>
                <div className="article-time">
                  <FontAwesomeIcon icon={faClock} />
                  <span>{article.timeAgo}</span>
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
      </div>
    </div>
  );
};

export default Profile;
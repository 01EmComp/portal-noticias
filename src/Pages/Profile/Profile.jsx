import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

// Auth
import { auth, db } from "/src/Services/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

// Images
import img1 from "/src/Assets/Images/art-1.jpg";

// Font Awesome Icon's
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import {
  faUser,
  faChevronDown,
  faChevronUp,
} from "@fortawesome/free-solid-svg-icons";

// CSS
import "./Profile.css";

const Profile = () => {
  const [showMoreArticles, setShowMoreArticles] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [dataButtonClicked, setDataButtonClicked] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="profile-container">
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

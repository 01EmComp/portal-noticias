import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// Auth
import { auth, db } from "/src/Services/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

// Components
import MyNews from "./MyNews/MyNews";
import EditNews from "./EditNews/EditNews";

// Images
import createNews from "/src/Assets/Images/createNews.svg";
import blogs from "/src/Assets/Images/blogs.svg";
import news from "/src/Assets/Images/news.svg";
import notifications from "/src/Assets/Images/notifications.svg";
import settings from "/src/Assets/Images/settings.svg";
import statistics from "/src/Assets/Images/statistics.svg";

// Font Awesome Icon's
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-regular-svg-icons";

// Css
import "./WriterPainel.css";

const WriterPainel = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("menu");
  const [editingNewsId, setEditingNewsId] = useState(null);

  const allowedRoles = ["admin", "editor"];

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

  if (!userData) {
    return (
      <div className="not-authenticated" style={{ minHeight: "67vh" }}>
        <h1>Acesso negado</h1>
        <p>Você precisa estar logado para acessar está página.</p>
        <Link to="/login">
          <button>Fazer login</button>
        </Link>
      </div>
    );
  }

  if (loading) return <p className="loading-data">Carregando...</p>;

  if (!allowedRoles.includes(userData.role)) {
    return (
      <div className="not-authorized" style={{ minHeight: "67vh" }}>
        <h1>Permissão negada</h1>
        <p>Você não tem permissão para acessar essa página!</p>

        <p className="role-info">
          Apenas usuários com cargo de <strong>Editor</strong> ou{" "}
          <strong>Admin</strong> podem acessar essa página.
        </p>
        <Link to="/">
          <button>Voltar para início</button>
        </Link>
      </div>
    );
  }

  if (activeSection === "my-news") {
    return (
      <MyNews 
        onBack={() => setActiveSection("menu")} 
        onEditNews={(newsId) => {
          setEditingNewsId(newsId);
          setActiveSection("edit-news");
        }}
      />
    );
  }

  if (activeSection === "edit-news") {
    return (
      <EditNews 
        newsId={editingNewsId} 
        onBack={() => setActiveSection("my-news")} 
      />
    );
  }

  // Menu principal do Writer Painel
  return (
    <div className="writer-painel-container">
      <section className="wp-welcome">
        <div className="photo">
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
        <div className="text">
          <p>Bem-vindo</p>
          <h2>{userData.name || "Não fornecido"}</h2>
        </div>
      </section>
      <section className="wp-painel">
        <ul>
          <Link to="/">
            <li>
              <p>Criar Notícia / Blog</p>
              <img src={createNews} alt="Imagem criar n / b" />
            </li>
          </Link>
          <li onClick={() => setActiveSection("my-news")} style={{ cursor: "pointer" }}>
            <p>Minhas Noticias</p>
            <img src={news} alt="Imagem minhas notícias" />
          </li>
          <Link to="/">
            <li>
              <p>Meus Blogs</p>
              <img src={blogs} alt="Imagem meus blogs" />
            </li>
          </Link>
          <Link to="/">
            <li>
              <p>Notificações</p>
              <img src={notifications} alt="Imagem notificações" />
            </li>
          </Link>
          <Link to="/">
            <li>
              <p>Estatísticas</p>
              <img src={statistics} alt="Imagem estatísticas" />
            </li>
          </Link>
          <Link to="/">
            <li>
              <p>Configurações</p>
              <img src={settings} alt="Imagem configurações" />
            </li>
          </Link>
        </ul>
      </section>
    </div>
  );
};

export default WriterPainel;
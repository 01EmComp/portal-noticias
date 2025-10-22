import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// Auth
import { auth, db } from "/src/Services/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

// Components
import News from "./News/News";
import Categories from "./Categories/Categories";
import Users from "./Users/Users";
import Statistics from "./Statistics/Statistics";
import Settings from "./Settings/Settings";

// Font Awesome Icon's
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faNewspaper } from "@fortawesome/free-solid-svg-icons";
import { faBook } from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faChartPie } from "@fortawesome/free-solid-svg-icons";
import { faGears } from "@fortawesome/free-solid-svg-icons";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";

// Css
import "./AdmPainel.css";

const AdmPainel = () => {
  
  const [open, setOpen] = useState(false);
  const [width, setWidth] = useState("3.2rem");
  const [openTab, setOpenTab] = useState("news");
  const [userData, setUserData] = useState(null);

  const allowedRoles = ["admin", "editor"];

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
      <div className="not-authenticated">
        <h1>Acesso negado</h1>
        <p>Você precisa estar logado para acessar está página.</p>
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
        <p>Você não tem permissão para acessar essa página!</p>

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
    <div className="adm-painel-container">
      <div className="side-bar" style={{ width: `${width}` }}>
        <ul className={open == false ? "options" : "options-open"}>
          <li>
            {(open && (
              <>
                <div
                  className="icon"
                  onClick={() => {
                    setWidth("3.2rem");
                    setOpen(false);
                  }}
                >
                  <FontAwesomeIcon
                    icon={faAngleLeft}
                    style={{ transition: ".3s ease" }}
                  />
                </div>
                <p
                  onClick={() => {
                    setWidth("3.2rem");
                    setOpen(false);
                  }}
                >
                  Fechar
                </p>
              </>
            )) || (
              <>
                <div
                  className="icon"
                  onClick={() => {
                    setWidth("17rem");
                    setOpen(true);
                  }}
                >
                  <FontAwesomeIcon
                    icon={faAngleLeft}
                    style={{
                      transform: "rotateZ(-180deg)",
                      transition: ".3s ease",
                    }}
                  />
                </div>
                <p>Fechar</p>
              </>
            )}
          </li>
          <li
            className={openTab == "news" ? "active" : ""}
            onClick={() => setOpenTab("news")}
          >
            <div className="icon">
              <FontAwesomeIcon icon={faNewspaper} />
            </div>
            <div className="hidden-links">Notícias</div>
          </li>
          <li
            className={openTab == "categories" ? "active" : ""}
            onClick={() => setOpenTab("categories")}
          >
            <div className="icon">
              <FontAwesomeIcon icon={faBook} />
            </div>
            <div className="hidden-links">Categorias</div>
          </li>
          <li
            className={openTab == "users" ? "active" : ""}
            onClick={() => setOpenTab("users")}
          >
            <div className="icon">
              <FontAwesomeIcon icon={faUser} />
            </div>
            <div className="hidden-links">Usuários</div>
          </li>
          <li
            className={openTab == "statistics" ? "active" : ""}
            onClick={() => setOpenTab("statistics")}
          >
            <div className="icon">
              <FontAwesomeIcon icon={faChartPie} />
            </div>
            <div className="hidden-links">Estatísticas</div>
          </li>
          <li
            className={openTab == "settings" ? "active" : ""}
            onClick={() => setOpenTab("settings")}
          >
            <div className="icon">
              <FontAwesomeIcon icon={faGears} />
            </div>
            <div className="hidden-links">Configurações</div>
          </li>
        </ul>
      </div>
      <div className="adm-p-content">
        <h2>Painel do Administrador</h2>
        {openTab == "news" && <News />}
        {openTab == "categories" && <Categories />}
        {openTab == "users" && <Users />}
        {openTab == "statistics" && <Statistics />}
        {openTab == "settings" && <Settings />}
      </div>
    </div>
  );
};

export default AdmPainel;

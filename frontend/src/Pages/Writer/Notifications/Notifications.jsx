import { useState, useEffect } from "react";

// Firebase
import { getDocs, query, where, collection, orderBy } from "firebase/firestore";
import { db } from "/src/Services/firebaseConfig.js";

// Font Awesome Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faCheck } from "@fortawesome/free-solid-svg-icons";

// Components
import NotificationItem from "./NotificationItem/NotificationItem";

// Css
import "./Notifications.css";

const Notifications = ({ onBack }) => {
  const [sortBy, setSortBy] = useState("recent");
  const [notifications, setNotifications] = useState([]);
  const userId = "UID_DO_USUARIO"; // depois você liga com auth

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const q = query(
          collection(db, "notifications"),
          where("userId", "in", [userId, "ALL"])
        );

        const querySnapshot = await getDocs(q);

        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setNotifications(data);
      } catch (error) {
        console.error("Erro ao buscar notificações:", error);
      }
    };

    fetchNotifications();
  }, []);

  const sortedNotifications = [...notifications].sort((a, b) => {
    if (sortBy === "recent") {
      return b.createdAt?.seconds - a.createdAt?.seconds;
    }

    if (sortBy === "oldest") {
      return a.createdAt?.seconds - b.createdAt?.seconds;
    }

    if (sortBy === "name") {
      return a.title.localeCompare(b.title);
    }

    return 0;
  });

  return (
    <div className="notifications-container">
      <div className="notifications-header">
        <button className="back-button" onClick={onBack}>
          <FontAwesomeIcon icon={faChevronLeft} />
          Voltar
        </button>
        <h1>Notificações</h1>
      </div>
      <div className="main-box">
        <div className="header">
          <div className="filter">
            <div className="filter-section">
              <span className="filter-label">Ordenar por:</span>
              <div className="filter-buttons">
                <button
                  className={sortBy === "recent" ? "active" : ""}
                  onClick={() => setSortBy("recent")}
                >
                  Mais recentes
                </button>
                <button
                  className={sortBy === "oldest" ? "active" : ""}
                  onClick={() => setSortBy("oldest")}
                >
                  Mais antigos
                </button>
                <button
                  className={sortBy === "name" ? "active" : ""}
                  onClick={() => setSortBy("name")}
                >
                  Nome (A-Z)
                </button>
              </div>
            </div>
          </div>
          <button className="mark-read">
            Marcar tudo como lido{" "}
            <FontAwesomeIcon className="mark-read-icon" icon={faCheck} />
          </button>
        </div>

        <div className="sections">
          <section className="news">
            <div className="top">
              <div>
                <div className="left">Notícias</div>
                <div className="rigth">Status</div>
              </div>
            </div>
            <div className="bottom">
              <ul>
                <li>
                  <div className="left">Como se preparar para o ENEM 2025?</div>
                  <div className="rigth">Aprovado</div>
                </li>
                <li>
                  <div className="left">Como se preparar para o ENEM 2024?</div>
                  <div className="rigth">Reprovado</div>
                </li>
                <li>
                  <div className="left">Como se preparar para o ENEM 2023?</div>
                  <div className="rigth">Pendente</div>
                </li>

                {/* {sortedNotifications
    .filter(n => n.type === "POST_STATUS")
    .map(item => (
      <NotificationItem key={item.id} data={item} />
    ))} */}
              </ul>
            </div>
          </section>
          <section className="blogs">
            <div className="top">
              <div>
                <div className="left">Blogs</div>
                <div className="rigth">Status</div>
              </div>
            </div>
            <div className="bottom">
              <ul>
                <li>
                  <div className="left">Viagem para New York</div>
                  <div className="rigth">Aprovado</div>
                </li>
                <li>
                  <div className="left">Viagem para San Francisco</div>
                  <div className="rigth">Reprovado</div>
                </li>
                <li>
                  <div className="left">Viagem para Miami</div>
                  <div className="rigth">Pendente</div>
                </li>
              </ul>
            </div>
          </section>
          <section className="reactions-and-comments">
            <div className="top">Reações e Comentários</div>
            <div className="bottom">
              <ul>
                <li>
                  <div className="left">
                    12 novos comentários em “Viagem para New Y...”
                  </div>
                </li>
                <li>
                  <div className="left">
                    5 novas reações em “Viagem para New York”
                  </div>
                </li>

                {/* <ul>
  {sortedNotifications
    .filter(n =>
      n.type === "REACTION" || n.type === "COMMENT"
    )
    .map(item => (
      <NotificationItem key={item.id} data={item} />
    ))}
</ul>
 */}
              </ul>
            </div>
          </section>
          <section className="updates">
            <div className="top">Atualizações</div>
            <div className="bottom">
              <ul>
                <li>
                  <div className="left">Nossos termos de uso atualizaram</div>
                </li>

                {/*
  {sortedNotifications
    .filter(n => n.type === "SYSTEM_UPDATE")
    .map(item => (
      <li key={item.id}>
        <div className="left">{item.title}</div>
      </li>
    ))}
 */}
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Notifications;

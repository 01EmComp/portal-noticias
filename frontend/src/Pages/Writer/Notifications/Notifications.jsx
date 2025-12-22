import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Firebase
import { db, auth } from "/src/Services/firebaseConfig.js";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  getDocs,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

// Font Awesome Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faCheck } from "@fortawesome/free-solid-svg-icons";

// Css
import "./Notifications.css";

const Notifications = ({ onBack }) => {
  const [user, setUser] = useState(null);
  const [myNews, setMyNews] = useState([]);
  const [realTimeNotifs, setRealTimeNotifs] = useState([]); // Novo estado
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("recent");

  const updateMessages = {
    published: "Notícia aprovada",
    rejected: "Notícia rejeitada",
    pending: "Em análise",
  };

  const statusTranslations = {
    published: "Aprovado",
    pending: "Pendente",
    rejected: "Reprovado",
    draft: "Rascunho",
  };

  const navigate = useNavigate();

  // 1. Efeito de Autenticação
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) navigate("/profile");
    });
    return () => unsubscribe();
  }, [navigate]);

  // 2. Carregar Notificações (Status Update)
  useEffect(() => {
    if (!user) return;
    const notifRef = collection(db, "notifications");
    const q = query(notifRef, where("userId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setRealTimeNotifs(list);
    });
    return () => unsubscribe();
  }, [user]);

  // 3. Carregar Notícias com contagem de subcoleção (Comments)
  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "news"),
      where("author.uid", "==", user.uid)
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const newsData = await Promise.all(
        snapshot.docs.map(async (docSnapshot) => {
          const data = docSnapshot.data();
          const newsId = docSnapshot.id;

          // Busca a subcoleção de comentários
          const commentsRef = collection(db, "news", newsId, "comments");
          const commentsSnapshot = await getDocs(query(commentsRef));

          return {
            id: newsId,
            ...data,
            commentCount: commentsSnapshot.size, // Define o tamanho dinamicamente
          };
        })
      );
      setMyNews(newsData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user]);

  // --- LÓGICA DE ORDENAÇÃO E FILTRO (ORDEM IMPORTANTE) ---

  // Primeiro: Ordenamos a lista de notícias base
  const sortedNews = [...myNews].sort((a, b) => {
    const timeA = a.createdAt?.seconds || 0;
    const timeB = b.createdAt?.seconds || 0;
    return sortBy === "recent" ? timeB - timeA : timeA - timeB;
  });

  // Segundo: Filtramos os comentários a partir da lista já definida acima
  const newsWithComments = sortedNews.filter((news) => news.commentCount > 0);

  // Terceiro: Ordenamos as notificações de atualização
  const sortedNotifications = [...realTimeNotifs].sort((a, b) => {
    const timeA = a.createdAt?.seconds || 0;
    const timeB = b.createdAt?.seconds || 0;
    return sortBy === "recent" ? timeB - timeA : timeA - timeB;
  });
  // Verificar autenticação
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        navigate("/profile");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  // Define a cor do status
  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "published":
      case "aprovado":
        return { background: "green", color: "white" };
      case "pending":
      case "pendente":
        return { background: "orange", color: "white" };
      case "rejected":
      case "reprovado":
        return { background: "red", color: "white" };
      default:
        return { background: "grey", color: "white" };
    }
  };

  // Marcar como lido
  const markAllAsRead = async () => {
    try {
      const unreadNotifs = realTimeNotifs.filter((n) => !n.read);

      const promises = unreadNotifs.map((n) =>
        updateDoc(doc(db, "notifications", n.id), { read: true })
      );

      await Promise.all(promises);
    } catch (error) {
      console.error("Erro ao marcar como lido:", error);
    }
  };

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
              </div>
            </div>
          </div>
          <button className="mark-read" onClick={markAllAsRead}>
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
                {loading ? (
                  <p>Carregando notícias...</p>
                ) : sortedNews.length === 0 ? (
                  <div className="empty-state" style={{ marginTop: "10px" }}>
                    <h2>Você ainda não possui nenhuma notícia</h2>
                    <p>
                      Quando você postar novas notícias, elas aparecerão aqui.
                    </p>
                  </div>
                ) : (
                  sortedNews.map((news) => (
                    <li key={news.id}>
                      <div className="left">{news.title}</div>
                      <div
                        className="rigth"
                        style={getStatusStyle(news.status)}
                      >
                        {statusTranslations[news.status?.toLowerCase()] ||
                          news.status ||
                          "Pendente"}
                      </div>
                    </li>
                  ))
                )}
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
                {myNews.length === 0 ? (
                  <div className="empty-state" style={{ marginTop: "10px" }}>
                    <h2>Você ainda não possui nenhum blog</h2>
                    <p>Quando você postar novos blogs, elas aparecerão aqui.</p>
                  </div>
                ) : (
                  <div style={{ color: "rgba(0, 0, 0, 0.7)", fontWeight: 700 }}>
                    Disponível em Breve
                  </div>
                )}
              </ul>
            </div>
          </section>
          <section className="reactions-and-comments">
            <div className="top">
              <div className="left">Comentários</div>
            </div>
            <div className="bottom">
              <ul>
                {newsWithComments.length === 0 ? (
                  <div className="empty-state" style={{ marginTop: "10px" }}>
                    <p>Nenhum comentário novo.</p>
                  </div>
                ) : (
                  newsWithComments.map((news) => (
                    <li key={`comment-${news.id}`}>
                      <div className="left">
                        <strong>{news.commentCount}</strong>comentários em “
                        {news.title}”
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </section>
          <section className="updates">
            <div className="top">
              <div className="left">Resumo de Atualizações</div>
            </div>
            <div className="bottom">
              <ul>
                {sortedNotifications.length === 0 ? (
                  <div className="empty-state" style={{ marginTop: "10px" }}>
                    <p>Nenhuma atualização recente.</p>
                  </div>
                ) : (
                  sortedNotifications.map((notif) => (
                    <li
                      key={notif.id}
                      className={notif.read ? "read" : "unread"}
                    >
                      <div className="left">
                        <div>
                          <strong
                            style={{
                              color: getStatusStyle(notif.status).background,
                              marginRight: "5px",
                            }}
                          >
                            {updateMessages[notif.status?.toLowerCase()] ||
                              "Atualização"}
                            :
                          </strong>
                          {notif.title ||
                            (notif.message && notif.message.split(": ")[1]) ||
                            "Título indisponível"}
                        </div>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Notifications;

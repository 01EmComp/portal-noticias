import { useState, useEffect } from "react";

// Auth
import { db, auth } from "/src/Services/firebaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  onSnapshot,
} from "firebase/firestore";

// Components
import NewsItem from "./NewsItem/NewsItem";

// Css
import "./News.css";

const News = () => {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, pending, published, rejected
  const [dateOrder, setDateOrder] = useState("desc"); // desc, asc
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUserData({ uid: user.uid });
    }
  }, []);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        let q;

        if (filter === "all") {
          q = query(collection(db, "news"), orderBy("createdAt", "desc"));
        } else {
          const statusMap = {
            pending: "pending",
            published: "published",
            rejected: "rejected",
          };

          q = query(
            collection(db, "news"),
            where("status", "==", statusMap[filter])
          );
        }

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const newsData = [];
          querySnapshot.forEach((doc) => {
            newsData.push({
              id: doc.id,
              ...doc.data(),
            });
          });

          if (filter !== "all") {
            newsData.sort((a, b) => {
              if (!a.createdAt || !b.createdAt) return 0;
              const timeA = a.createdAt.toMillis();
              const timeB = b.createdAt.toMillis();
              return dateOrder === "desc" ? timeB - timeA : timeA - timeB;
            });
          } else {
            newsData.sort((a, b) => {
              if (!a.createdAt || !b.createdAt) return 0;
              const timeA = a.createdAt.toMillis();
              const timeB = b.createdAt.toMillis();
              return dateOrder === "desc" ? timeB - timeA : timeA - timeB;
            });
          }

          setNewsList(newsData);
          setLoading(false);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error("Erro ao buscar notícias:", error);
        setLoading(false);
      }
    };

    fetchNews();
  }, [filter, dateOrder]);

  const formatDate = (timestamp) => {
    if (!timestamp) return "Data não disponível";

    try {
      const date = timestamp.toDate();
      const dateStr = date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      const timeStr = date.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      });
      return `${dateStr} às ${timeStr}`;
    } catch (error) {
      return "Data inválida";
    }
  };

  const translateStatus = (status) => {
    const statusMap = {
      pending: "Em Análise",
      published: "Aprovado",
      rejected: "Reprovado",
    };
    return statusMap[status] || status;
  };

  return (
    <div className="news-list-container">
      <div className="news-controls">
        <div className="news-filters">
          <button
            className={filter === "all" ? "active" : ""}
            onClick={() => setFilter("all")}
          >
            Todas
          </button>
          <button
            className={filter === "pending" ? "active" : ""}
            onClick={() => setFilter("pending")}
          >
            Aguardando Avaliação
          </button>
          <button
            className={filter === "published" ? "active" : ""}
            onClick={() => setFilter("published")}
          >
            Aprovadas
          </button>
          <button
            className={filter === "rejected" ? "active" : ""}
            onClick={() => setFilter("rejected")}
          >
            Reprovadas
          </button>
        </div>

        <div className="date-sort">
          <button
            className={dateOrder === "desc" ? "active" : ""}
            onClick={() => setDateOrder("desc")}
            title="Mais recentes primeiro"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 12L3 7h10l-5 5z" />
            </svg>
            Mais recentes
          </button>
          <button
            className={dateOrder === "asc" ? "active" : ""}
            onClick={() => setDateOrder("asc")}
            title="Mais antigas primeiro"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 4l5 5H3l5-5z" />
            </svg>
            Mais antigas
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading">Carregando notícias...</div>
      ) : newsList.length === 0 ? (
        <div className="no-news">
          <p>Nenhuma notícia encontrada.</p>
        </div>
      ) : (
        <>
          <NewsItem
            title={"Título"}
            author={"Autor"}
            date={"Data"}
            status={"Status"}
            isHeader={true}
          />
          {newsList.map((news) => (
            <NewsItem
              key={news.id}
              id={news.id}
              title={news.title}
              author={news.author?.name || "Autor desconhecido"}
              date={formatDate(news.createdAt)}
              status={translateStatus(news.status)}
              statusRaw={news.status}
              userData={userData}
            />
          ))}
        </>
      )}
    </div>
  );
};

export default News;

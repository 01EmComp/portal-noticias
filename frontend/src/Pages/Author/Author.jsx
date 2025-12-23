import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

// Firestore
import { db } from "/src/Services/firebaseConfig.js";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  orderBy,
} from "firebase/firestore";

// Components
import NewItem from "../../Components/HomeComponents/NewItem";

// Font Awesome Icon's
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";

// Css
import "./Author.css";

const Author = () => {
  const { uid } = useParams();
  const [authorData, setAuthorData] = useState(null);
  const [authorNews, setAuthorNews] = useState([]); // Estado para as notícias
  const [loading, setLoading] = useState(true);
  const [newsLimit, setNewsLimit] = useState(3);

  useEffect(() => {
    const fetchAuthorAndNews = async () => {
      try {
        setLoading(true);

        // 1. Busca dados do Autor
        const authorRef = doc(db, "users", uid);
        const authorSnap = await getDoc(authorRef);

        if (authorSnap.exists()) {
          setAuthorData(authorSnap.data());

          // 2. Busca notícias deste autor
          const newsRef = collection(db, "news");
          const q = query(
            newsRef,
            where("author.uid", "==", uid),
            where("status", "==", "published"),
            orderBy("createdAt", "desc") // Notícias mais recentes primeiro
          );

          const querySnapshot = await getDocs(q);
          const newsList = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          setAuthorNews(newsList);
        }
      } catch (error) {
        console.error("Erro ao carregar dados do autor/notícias:", error);
      } finally {
        setLoading(false);
      }
    };

    if (uid) fetchAuthorAndNews();
  }, [uid]);

  if (loading) return <p>Carregando perfil...</p>;
  if (!authorData) return <p>Usuário não encontrado.</p>;

  return (
    <div className="author-container">
      <section className="about-author">
        <h2>{authorData.name}</h2>
        <div className="img-and-desc">
          <img
            src={authorData.photoURL}
            alt={`Foto de perfil do(a) autor(a) ${authorData.name}`}
          />
          <div className="description">
            <h3>Sobre o autor:</h3>
            <p>
              {authorData.description ||
                "Este autor ainda não adicionou uma biografia."}
            </p>
          </div>
        </div>
      </section>
      <section className="their-news">
        <p>Noticias Realizadas</p>
        <div className="published-news">
          {authorNews.length > 0 ? (
            authorNews
              .slice(0, newsLimit)
              .map((news) => <NewItem key={news.id} news={news} />)
          ) : (
            <p style={{ background: "rgba(0,0,0,0)" }}>
              Este autor ainda não publicou notícias.
            </p>
          )}
        </div>
        {authorNews.length > newsLimit && (
          <div
            className="more"
            onClick={() => setNewsLimit((prev) => prev + 3)}
          >
            <p>Ver mais</p>
            <FontAwesomeIcon icon={faAngleDown} className="icon-down" />
          </div>
        )}
      </section>
    </div>
  );
};

export default Author;

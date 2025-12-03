import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

// Font Awesome Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faWhatsapp, faInstagram } from "@fortawesome/free-brands-svg-icons";
import { faLink } from "@fortawesome/free-solid-svg-icons";

// Firebase
import { db } from "/src/Services/firebaseConfig";
import { 
  doc, 
  getDoc, 
  serverTimestamp, 
  updateDoc, 
  increment 
} from "firebase/firestore";

// Components
import ImageFullScreen from "../../Components/ImageFullScreen/ImageFullScreen";

// CSS
import "./News.css";

function News() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [newsData, setNewsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {

    const fetchNews = async () => {
      try {
        setLoading(true);

        const newsDocRef = doc(db, "news", id);
        const newsSnap = await getDoc(newsDocRef);

        if (!newsSnap.exists()) {
          setError("Notícia não encontrada");
          return;
        }

        const data = newsSnap.data();

        if (data.status !== "published") {
          setError("Notícia não encontrada");
          return;
        }

        // Incrementar visualizações
        await updateDoc(newsDocRef, {
          views: increment(1)
        });

        setNewsData({
          ...data,
          id: newsSnap.id
        });

        await saveToReadingHistory({
          ...data,
          id: newsSnap.id,
        });

      } catch (err) {
        console.error("Erro ao buscar notícia:", err);
        setError("Erro ao carregar notícia");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchNews();
  }, [id]);


  const saveToReadingHistory = async (article) => {
    try {
      const { auth } = await import("/src/Services/firebaseConfig");
      const { onAuthStateChanged } = await import("firebase/auth");
      
      return new Promise((resolve) => {
        onAuthStateChanged(auth, async (user) => {
          if (!user) return resolve();

          const { doc, getDoc, updateDoc } = await import("firebase/firestore");

          try {
            const userRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userRef);
            
            if (!userSnap.exists()) return resolve();

            const userData = userSnap.data();
            let readingHistory = userData.readingHistory || [];

            const readArticle = {
              id: article.id,
              title: article.title,
              category: article.category,
              imageURL: article.imageURL,
              readAt: serverTimestamp(),
            };

            readingHistory = readingHistory.filter(item => item.id !== article.id);

            // Inserir no início
            readingHistory.unshift(readArticle);
            readingHistory = readingHistory.slice(0, 5);

            await updateDoc(userRef, { readingHistory });

            resolve();
          } catch (error) {
            console.error("Erro ao salvar histórico de leitura:", error);
            resolve();
          }
        });
      });

    } catch (error) {
      console.error("Erro ao importar Firebase:", error);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "00/00/00";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getFullYear()).slice(-2)}`;
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "00:00:00";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
  };

  const renderBodyContent = (body) => {
    if (!body || !Array.isArray(body)) return null;

    return body.map((item, index) => {
      switch (item.type) {
        case "heading":
          return <h2 key={index} dangerouslySetInnerHTML={{ __html: item.text }} />;
        case "subheading":
          return <h3 key={index} dangerouslySetInnerHTML={{ __html: item.text }} />;
        case "list":
          return <div key={index} dangerouslySetInnerHTML={{ __html: item.text }} />;
        default:
          return <p key={index} dangerouslySetInnerHTML={{ __html: item.text }} />;
      }
    });
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const text = newsData?.title || "";

    switch (platform) {
      case "facebook":
        return window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
      case "whatsapp":
        return window.open(`https://wa.me/?text=${encodeURIComponent(text + " " + url)}`);
      case "instagram":
      case "link":
        navigator.clipboard.writeText(url);
        alert("Link copiado!");
        break;
    }
  };

  if (loading) {
    return (
      <div className="news-container">
        <div className="loading-message">
          <p>Carregando notícia...</p>
        </div>
      </div>
    );
  }

  if (error || !newsData) {
    return (
      <div className="news-container">
        <div className="error-message">
          <h2>{error || "Notícia não encontrada"}</h2>
          <button onClick={() => navigate("/")}>Voltar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="news-container">
      <section className="header">
        <div className="about">
          <div className="title-and-author">
            <h2>{newsData.title}</h2>
            {newsData.subtitle && <h3 className="subtitle">{newsData.subtitle}</h3>}

            <div className="author-and-time">
              <p>Autor: <span>{newsData.author?.name || "Desconhecido"}</span></p>
              <p>{formatDate(newsData.publishedAt || newsData.createdAt)} às {formatTime(newsData.publishedAt || newsData.createdAt)}</p>
            </div>
          </div>

          <div className="social-links">
            <div onClick={() => handleShare("facebook")}><FontAwesomeIcon icon={faFacebook} /></div>
            <div onClick={() => handleShare("whatsapp")}><FontAwesomeIcon icon={faWhatsapp} /></div>
            <div onClick={() => handleShare("instagram")}><FontAwesomeIcon icon={faInstagram} /></div>
            <div onClick={() => handleShare("link")}><FontAwesomeIcon icon={faLink} /></div>
          </div>
        </div>

        <div className="image">
          <ImageFullScreen src={newsData.imageURL} alt={newsData.title} />
        </div>
      </section>

      <section className="news-text">
        {renderBodyContent(newsData.body)}
      </section>
    </div>
  );
}

export default News;
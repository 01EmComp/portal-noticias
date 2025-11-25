import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

// Font Awesome Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook } from "@fortawesome/free-brands-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { faLink } from "@fortawesome/free-solid-svg-icons";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";

// Firebase
import { db } from "/src/Services/firebaseConfig";
import { collection, query, where, getDocs, doc, serverTimestamp, updateDoc, increment } from "firebase/firestore";

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
        
        const newsQuery = query(
          collection(db, "news"),
          where("id", "==", id),
          where("status", "==", "published")
        );
        
        const querySnapshot = await getDocs(newsQuery);
        
        if (querySnapshot.empty) {
          setError("Notícia não encontrada");
          return;
        }
        
        const newsDoc = querySnapshot.docs[0];
        const data = newsDoc.data();
        
        // Incrementar visualizações
        await updateDoc(doc(db, "news", newsDoc.id), {
          views: increment(1)
        });
        
        setNewsData(data);
        
        // Salvar leitura do usuário
        await saveToReadingHistory(data);
      } catch (err) {
        console.error("Erro ao buscar notícia:", err);
        setError("Erro ao carregar notícia");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchNews();
    }
  }, [id]);


  const saveToReadingHistory = async (newsData) => {
    try {

      const { auth } = await import("/src/Services/firebaseConfig");
      const { onAuthStateChanged } = await import("firebase/auth");
      
      return new Promise((resolve) => {
        onAuthStateChanged(auth, async (user) => {
          if (!user) {
            resolve();
            return;
          }

          const { doc, getDoc, updateDoc, arrayUnion, arrayRemove } = await import("firebase/firestore");
          
          try {
            const userRef = doc(db, "users", user.uid);
            const userDoc = await getDoc(userRef);
            
            if (!userDoc.exists()) {
              resolve();
              return;
            }

            const userData = userDoc.data();
            let readingHistory = userData.readingHistory || [];

            const readArticle = {
              id: newsData.id,
              title: newsData.title,
              category: newsData.category,
              imageURL: newsData.imageURL,
              readAt: serverTimestamp(),
            };

            readingHistory = readingHistory.filter(item => item.id !== newsData.id);

            readingHistory.unshift(readArticle);

            readingHistory = readingHistory.slice(0, 5);

            await updateDoc(userRef, {
              readingHistory: readingHistory
            });

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
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    
    return `${day}/${month}/${year}`;
  };

  const formatTime = (timestamp) => {
   
    if (!timestamp) return "00:00:00";
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${hours}:${minutes}:${seconds}`;
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
        case "paragraph":
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
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case "whatsapp":
        window.open(`https://wa.me/?text=${encodeURIComponent(text + " " + url)}`, '_blank');
        break;
      case "instagram":
      case "link":
        navigator.clipboard.writeText(url);
        alert("Link copiado para a área de transferência!");
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
          <button onClick={() => navigate("/")}>Voltar para início</button>
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
              <div className="author">
                <p>
                  Autor: <span>{newsData.author?.name || "Desconhecido"}</span>
                </p>
              </div>
              <div className="date">
                <p>{formatDate(newsData.publishedAt || newsData.createdAt)}</p>
                <p>às</p>
                <p>{formatTime(newsData.publishedAt || newsData.createdAt)}</p>
              </div>
            </div>
          </div>
          <div className="social-links">
            <div className="facebook" onClick={() => handleShare("facebook")}>
              <FontAwesomeIcon
                icon={faFacebook}
                style={{ color: "#0091ff", fontSize: "24px" }}
              />
            </div>
            <div className="whatsapp" onClick={() => handleShare("whatsapp")}>
              <FontAwesomeIcon
                icon={faWhatsapp}
                style={{ color: "#22cc00", fontSize: "24px" }}
              />
            </div>
            <div className="instagram" onClick={() => handleShare("instagram")}>
              <FontAwesomeIcon
                icon={faInstagram}
                style={{ color: "#FF3A37", fontSize: "24px" }}
              />
            </div>
            <div className="link" onClick={() => handleShare("link")}>
              <FontAwesomeIcon icon={faLink} style={{ fontSize: "20px" }} />
            </div>
          </div>
        </div>
        <div className="image">
          <ImageFullScreen 
            src={newsData.imageURL} 
            alt={newsData.title} 
          />
        </div>
      </section>
      <section className="news-text">
        {renderBodyContent(newsData.body)}
      </section>
    </div>
  );
}

export default News;
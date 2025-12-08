import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

// Font Awesome Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faWhatsapp, faInstagram } from "@fortawesome/free-brands-svg-icons";
import { faLink, faChevronDown } from "@fortawesome/free-solid-svg-icons";

// Firebase
import { db, auth } from "/src/Services/firebaseConfig";
import { 
  doc, 
  getDoc, 
  serverTimestamp, 
  updateDoc, 
  increment,
  collection,
  addDoc,
  query,
  onSnapshot
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

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
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  
  // Estados dos comentários
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [visibleComments, setVisibleComments] = useState(3);
  const [loadingComments, setLoadingComments] = useState(true);

  // Verificar autenticação
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        try {
          const userDocRef = doc(db, "users", currentUser.uid);
          const userSnap = await getDoc(userDocRef);
          if (userSnap.exists()) {
            setUserData(userSnap.data());
          }
        } catch (err) {
          console.error("Erro ao buscar dados do usuário:", err);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Carregar comentários
  useEffect(() => {
    if (!id || !newsData) return;

    if (newsData.allowComments === false) {
      setLoadingComments(false);
      return;
    }

    const commentsRef = collection(db, "news", id, "comments");
    const q = query(commentsRef);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const commentsData = snapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        .sort((a, b) => {
          const dateA = a.createdAt?.toDate?.() || new Date(0);
          const dateB = b.createdAt?.toDate?.() || new Date(0);
          return dateB - dateA;
        });
      
      setComments(commentsData);
      setLoadingComments(false);
    }, (error) => {
      console.error("Erro ao carregar comentários:", error);
      setLoadingComments(false);
    });

    return () => unsubscribe();
  }, [id, newsData]);

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

        const visibility = data.visibility || "public";
        
        if (visibility === "private") {

          /*
          const currentUser = auth.currentUser;
          
          if (!currentUser || currentUser.uid !== data.author?.uid) {
            setError("Notícia não encontrada");
            return;
          }
          */

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
      return new Promise((resolve) => {
        onAuthStateChanged(auth, async (user) => {
          if (!user) return resolve();

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

  const handleSubmitComment = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("Você precisa estar logado para comentar!");
      navigate("/profile");
      return;
    }

    if (newsData.allowComments === false) {
      alert("Comentários estão desativados para esta notícia.");
      return;
    }

    if (!commentText.trim()) {
      alert("Por favor, escreva um comentário!");
      return;
    }

    setSubmittingComment(true);

    try {
      const commentsRef = collection(db, "news", id, "comments");
      
      await addDoc(commentsRef, {
        text: commentText.trim(),
        userName: userData?.name || user.displayName || "Usuário",
        userEmail: user.email,
        userId: user.uid,
        createdAt: serverTimestamp()
      });

      setCommentText("");
    } catch (error) {
      console.error("Erro ao enviar comentário:", error);
      alert("Erro ao enviar comentário. Tente novamente!");
    } finally {
      setSubmittingComment(false);
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

  const formatCommentDate = (timestamp) => {
    if (!timestamp) return "Agora";
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Agora";
    if (diffMins < 60) return `${diffMins} min atrás`;
    if (diffHours < 24) return `${diffHours}h atrás`;
    if (diffDays === 1) return "Ontem";
    if (diffDays < 7) return `${diffDays}d atrás`;
    
    return date.toLocaleDateString("pt-BR", { 
      day: "2-digit", 
      month: "short" 
    });
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

    if (newsData.allowSharing === false) {
      alert("Compartilhamento está desativado para esta notícia.");
      return;
    }

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

  const loadMoreComments = () => {
    setVisibleComments(prev => prev + 5);
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

  const sharingAllowed = newsData.allowSharing !== false;
  const commentsAllowed = newsData.allowComments !== false;

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

          {sharingAllowed && (
            <div className="social-links">
              <div onClick={() => handleShare("facebook")}><FontAwesomeIcon icon={faFacebook} /></div>
              <div onClick={() => handleShare("whatsapp")}><FontAwesomeIcon icon={faWhatsapp} /></div>
              <div onClick={() => handleShare("instagram")}><FontAwesomeIcon icon={faInstagram} /></div>
              <div onClick={() => handleShare("link")}><FontAwesomeIcon icon={faLink} /></div>
            </div>
          )}
        </div>

        <div className="image">
          <ImageFullScreen src={newsData.imageURL} alt={newsData.title} />
        </div>
      </section>

      <section className="news-text">
        {renderBodyContent(newsData.body)}
      </section>

      {/* Seção de Comentários */}
      {commentsAllowed && (
        <section className="comments-section">
          <h3 className="comments-title">Comentários</h3>

          {/* Formulário de comentário */}
          <div className="comment-form-container">
            {user ? (
              <form onSubmit={handleSubmitComment} className="comment-form">
                <div className="comment-input-wrapper">
                  <div className="user-avatar">
                    {(userData?.name || user.displayName || "U")[0].toUpperCase()}
                  </div>
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Deixe seu comentário..."
                    className="comment-input"
                    rows="3"
                    maxLength="500"
                    disabled={submittingComment}
                  />
                </div>
                <div className="comment-form-footer">
                  <span className="char-count">{commentText.length}/500</span>
                  <button 
                    type="submit" 
                    className="submit-comment-btn"
                    disabled={submittingComment || !commentText.trim()}
                  >
                    {submittingComment ? "Enviando..." : "Comentar"}
                  </button>
                </div>
              </form>
            ) : (
              <div className="login-prompt">
                <p>Você precisa estar logado para comentar.</p>
                <button onClick={() => navigate("/profile")} className="login-btn">
                  Fazer Login
                </button>
              </div>
            )}
          </div>

          {/* Lista de comentários */}
          <div className="comments-list">
            {loadingComments ? (
              <p className="loading-comments">Carregando comentários...</p>
            ) : comments.length === 0 ? (
              <p className="no-comments">Nenhum comentário ainda. Seja o primeiro a comentar!</p>
            ) : (
              <>
                {comments.slice(0, visibleComments).map((comment) => (
                  <div key={comment.id} className="comment-item">
                    <div className="comment-avatar">
                      {(comment.userName || "U")[0].toUpperCase()}
                    </div>
                    <div className="comment-content">
                      <div className="comment-header">
                        <span className="comment-author">{comment.userName}</span>
                        <span className="comment-date">{formatCommentDate(comment.createdAt)}</span>
                      </div>
                      <p className="comment-text">{comment.text}</p>
                    </div>
                  </div>
                ))}

                {comments.length > visibleComments && (
                  <button onClick={loadMoreComments} className="load-more-btn">
                    Mais Comentários
                    <FontAwesomeIcon icon={faChevronDown} />
                  </button>
                )}
              </>
            )}
          </div>
        </section>
      )}
    </div>
  );
}

export default News;
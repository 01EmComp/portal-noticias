import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Font Awesome Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faChevronLeft,
  faSearch,
  faChevronDown,
  faComment,
  faEdit,
  faCog,
  faTimes,
  faTrash
} from "@fortawesome/free-solid-svg-icons";

// Firebase
import { db, auth } from "/src/Services/firebaseConfig";
import { 
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

// CSS
import "./MyNews.css";

function MyNews({ onBack, onEditNews }) {
  const navigate = useNavigate();
  
  const [myNews, setMyNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [visibleNews, setVisibleNews] = useState(5);
  const [sortBy, setSortBy] = useState("recent");
  const [expandedComments, setExpandedComments] = useState({});
  const [showSettings, setShowSettings] = useState(null);
  const [newsSettings, setNewsSettings] = useState({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  
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

  // Carregar notícias do usuário
  useEffect(() => {
    if (!user) return;

    const newsRef = collection(db, "news");
    const q = query(
      newsRef,
      where("author.uid", "==", user.uid)
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      if (snapshot.empty) {
        setMyNews([]);
        setLoading(false);
        return;
      }

      const newsData = await Promise.all(
        snapshot.docs.map(async (newsDoc) => {
          const data = newsDoc.data();
          
          const commentsRef = collection(db, "news", newsDoc.id, "comments");
          
          let commentsCount = 0;
          let comments = [];
          
          try {
            const commentsSnap = await new Promise((resolve) => {
              const unsubComments = onSnapshot(commentsRef, (snap) => {
                resolve(snap);
                unsubComments();
              }, (error) => {
                resolve({ size: 0, docs: [] });
              });
            });
            
            commentsCount = commentsSnap.size;
            comments = commentsSnap.docs
              .map(doc => ({
                id: doc.id,
                ...doc.data()
              }))
              .sort((a, b) => {
                const dateA = a.createdAt?.toDate?.() || new Date(0);
                const dateB = b.createdAt?.toDate?.() || new Date(0);
                return dateB - dateA;
              });
          } catch (err) {
            console.error("Erro ao carregar comentários:", err);
          }

          return {
            id: newsDoc.id,
            ...data,
            commentsCount,
            comments
          };
        })
      );

      const initialExpandedState = {};
      newsData.forEach(news => {
        initialExpandedState[news.id] = true;
      });
      setExpandedComments(initialExpandedState);
      
      setMyNews(newsData);
      setLoading(false);
    }, (error) => {
      console.error("Erro ao carregar notícias:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const formatDate = (timestamp) => {
    if (!timestamp) return "Data indisponível";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("pt-BR", { 
      day: "2-digit", 
      month: "short",
      year: "numeric"
    });
  };

  const getTimeAgo = (timestamp) => {
    if (!timestamp) return "Agora";
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffHours < 1) return "Agora";
    if (diffHours < 24) return `${diffHours}h atrás`;
    if (diffDays === 1) return "1 dia atrás";
    if (diffDays < 7) return `${diffDays} dias atrás`;
    
    return formatDate(timestamp);
  };

  const formatCommentDate = (timestamp) => {
    if (!timestamp) return "Agora";
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);

    if (diffMins < 1) return "Agora";
    if (diffMins < 60) return `${diffMins}min atrás`;
    if (diffHours < 24) return `${diffHours}h atrás`;
    
    return date.toLocaleDateString("pt-BR", { 
      day: "2-digit", 
      month: "short" 
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      "Educação": "#FF4000",
      "Saúde": "#4ECDC4",
      "Política": "#45B7D1",
      "Esporte": "#FFA07A",
      "Economia": "#98D8C8",
      "Cultura": "#FDDD0D",
      "Geral": "#BB8FCE",
      "Entretenimento": "#F8B739",
      "Cidade": "#52B788",
      "Eventos": "#F72585"
    };
    return colors[category] || "#95A5A6";
  };

  const handleNewsClick = (newsId) => {
    navigate(`/news/${newsId}`);
  };

  const toggleComments = (newsId, e) => {
    e.stopPropagation();
    setExpandedComments(prev => ({
      ...prev,
      [newsId]: !prev[newsId]
    }));
  };

  const handleEditClick = (newsId, e) => {
    e.stopPropagation();
    if (onEditNews) {
      onEditNews(newsId);
    }
  };

  const handleSettingsClick = (newsId, e) => {
    e.stopPropagation();
    const news = myNews.find(n => n.id === newsId);
    
    setNewsSettings({
      visibility: news.visibility || "public",
      allowComments: news.allowComments !== undefined ? news.allowComments : true,
      allowReactions: news.allowReactions !== undefined ? news.allowReactions : true,
      allowSharing: news.allowSharing !== undefined ? news.allowSharing : true
    });
    setShowSettings(newsId);
  };

  const handleSaveSettings = async (newsId) => {
    setIsUpdating(true);
    
    try {
      const newsDocRef = doc(db, "news", newsId);
      
      const updateData = {
        visibility: newsSettings.visibility,
        allowComments: newsSettings.allowComments,
        allowReactions: newsSettings.allowReactions,
        allowSharing: newsSettings.allowSharing
      };
      
      await updateDoc(newsDocRef, updateData);
      
      setShowSettings(null);
      alert("Configurações salvas com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar configurações:", error);
      alert("Erro ao salvar configurações. Tente novamente.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteNews = async (newsId) => {
    setIsUpdating(true);
    
    try {
      const newsDocRef = doc(db, "news", newsId);
      await deleteDoc(newsDocRef);
      
      setShowDeleteConfirm(null);
      setShowSettings(null);
    } catch (error) {
      console.error("Erro ao excluir notícia:", error);
      alert("Erro ao excluir notícia. Tente novamente.");
    } finally {
      setIsUpdating(false);
    }
  };

  const getSortedNews = () => {
    const sorted = [...myNews];
    
    switch (sortBy) {
      case "recent":
        return sorted.sort((a, b) => {
          const dateA = a.createdAt?.toDate?.() || new Date(0);
          const dateB = b.createdAt?.toDate?.() || new Date(0);
          return dateB - dateA;
        });
      
      case "oldest":
        return sorted.sort((a, b) => {
          const dateA = a.createdAt?.toDate?.() || new Date(0);
          const dateB = b.createdAt?.toDate?.() || new Date(0);
          return dateA - dateB;
        });
      
      case "name":
        return sorted.sort((a, b) => 
          (a.title || "").localeCompare(b.title || "")
        );
      
      default:
        return sorted;
    }
  };

  const loadMoreNews = () => {
    setVisibleNews(prev => prev + 5);
  };

  if (loading) {
    return (
      <div className="my-news-container">
        <div className="loading-message">
          <p>Carregando suas notícias...</p>
        </div>
      </div>
    );
  }

  const sortedNews = getSortedNews();

  return (
    <div className="my-news-container">
      <div className="my-news-header">
        <button className="back-button" onClick={onBack}>
          <FontAwesomeIcon icon={faChevronLeft} />
          Voltar
        </button>
        <h1>Minhas notícias</h1>
      </div>

      {myNews.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <FontAwesomeIcon icon={faSearch} size="3x" />
          </div>
          <h2>Você ainda não possui nenhuma notícia</h2>
          <p>Quando você postar novas notícias, elas aparecerão aqui.</p>
        </div>
      ) : (
        <>
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

          <div className="news-list">
            {sortedNews.slice(0, visibleNews).map((news) => (
              <div 
                key={news.id} 
                className="news-card"
              >
                <div className="news-image" onClick={() => handleNewsClick(news.id)}>
                  <img src={news.imageURL} alt={news.title} />
                </div>

                <div className="news-info">
                  <h3 className="news-title" onClick={() => handleNewsClick(news.id)}>
                    {news.title}
                  </h3>
                  
                  <div className="news-category">
                    <span 
                      className="category-badge"
                      style={{ backgroundColor: getCategoryColor(news.category) }}
                    >
                      {news.category}
                    </span>
                  </div>

                  <div className="news-meta">
                    <div className="news-source">
                      <span className="source-icon">●</span>
                      <span className="source-name">{news.author?.name || "Você"}</span>
                      <span className="separator">•</span>
                      <span className="time-ago">{getTimeAgo(news.publishedAt || news.createdAt)}</span>
                    </div>
                  </div>

                  <div className="news-actions">
                    <button 
                      className={`action-item ${expandedComments[news.id] ? 'active' : ''}`}
                      onClick={(e) => toggleComments(news.id, e)}
                      title="Comentários"
                    >
                      <FontAwesomeIcon icon={faComment} />
                    </button>
                    <button 
                      className="action-item"
                      onClick={(e) => handleEditClick(news.id, e)}
                      title="Editar"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button 
                      className="action-item"
                      onClick={(e) => handleSettingsClick(news.id, e)}
                      title="Configurações"
                    >
                      <FontAwesomeIcon icon={faCog} />
                    </button>
                  </div>

                  {/* Seção de comentários */}
                  {expandedComments[news.id] && (
                    <div className="comments-section-card">
                      <div className="comments-header">
                        <span className="comments-count">
                          Total: {news.commentsCount || 0} comentários
                        </span>
                      </div>

                      {news.comments && news.comments.length > 0 ? (
                        <div className="comments-list-card">
                          {news.comments.map((comment) => (
                            <div key={comment.id} className="comment-item-card">
                              <div className="comment-avatar-card">
                                {(comment.userName || "U")[0].toUpperCase()}
                              </div>
                              <div className="comment-content-card">
                                <div className="comment-header-card">
                                  <span className="comment-author-card">{comment.userName}</span>
                                  <span className="comment-date-card">
                                    {formatCommentDate(comment.createdAt)}
                                  </span>
                                </div>
                                <p className="comment-text-card">{comment.text}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="no-comments-card">Nenhum comentário ainda.</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {sortedNews.length > visibleNews && (
              <button onClick={loadMoreNews} className="load-more-btn">
                Carregar mais notícias
                <FontAwesomeIcon icon={faChevronDown} />
              </button>
            )}
          </div>
        </>
      )}

      {/* Modal de Configurações */}
      {showSettings && (
        <div className="settings-modal" onClick={() => setShowSettings(null)}>
          <div className="settings-content" onClick={(e) => e.stopPropagation()}>
            <div className="settings-header">
              <h3>Configurações</h3>
              <button 
                className="close-settings"
                onClick={() => setShowSettings(null)}
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            <div className="settings-body">
              <div className="setting-item">
                <label className="setting-label">Visibilidade da notícia:</label>
                <div className="visibility-buttons">
                  <button
                    type="button"
                    className={`visibility-btn ${newsSettings.visibility === "public" ? "active" : ""}`}
                    onClick={() => setNewsSettings(prev => ({ ...prev, visibility: "public" }))}
                  >
                    Público
                  </button>
                  <button
                    type="button"
                    className={`visibility-btn ${newsSettings.visibility === "private" ? "active" : ""}`}
                    onClick={() => setNewsSettings(prev => ({ ...prev, visibility: "private" }))}
                  >
                    Privado
                  </button>
                </div>
              </div>

              <div className="setting-item">
                <label className="setting-label">Permitir comentários:</label>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={newsSettings.allowComments}
                    onChange={(e) => setNewsSettings(prev => ({ ...prev, allowComments: e.target.checked }))}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="setting-item">
                <label className="setting-label">Permitir reações:</label>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={newsSettings.allowReactions}
                    onChange={(e) => setNewsSettings(prev => ({ ...prev, allowReactions: e.target.checked }))}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="setting-item">
                <label className="setting-label">Permitir compartilhamentos:</label>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={newsSettings.allowSharing}
                    onChange={(e) => setNewsSettings(prev => ({ ...prev, allowSharing: e.target.checked }))}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="setting-item danger-zone">
                <label className="setting-label">Excluir notícia:</label>
                <button
                  type="button"
                  className="btn-delete"
                  onClick={() => setShowDeleteConfirm(showSettings)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                  Excluir
                </button>
              </div>

              <div className="settings-footer">
                <button
                  type="button"
                  className="btn-save-settings"
                  onClick={() => handleSaveSettings(showSettings)}
                  disabled={isUpdating}
                >
                  {isUpdating ? "Salvando..." : "Salvar Alterações"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Exclusão */}
      {showDeleteConfirm && (
        <div className="delete-confirm-modal" onClick={() => setShowDeleteConfirm(null)}>
          <div className="delete-confirm-content" onClick={(e) => e.stopPropagation()}>
            <h3>Confirmar Exclusão</h3>
            <p>Tem certeza que deseja excluir esta notícia? Esta ação não pode ser desfeita.</p>
            <div className="delete-confirm-actions">
              <button
                type="button"
                className="btn-cancel-delete"
                onClick={() => setShowDeleteConfirm(null)}
                disabled={isUpdating}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn-confirm-delete"
                onClick={() => handleDeleteNews(showDeleteConfirm)}
                disabled={isUpdating}
              >
                {isUpdating ? "Excluindo..." : "Sim, Excluir"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyNews;
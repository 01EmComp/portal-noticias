import { useState, useEffect } from "react";

import { db } from "/src/Services/firebaseConfig";

// Firestore
import {
  doc,
  updateDoc,
  serverTimestamp,
  getDoc,
  collection,
  addDoc,
} from "firebase/firestore";

import { Link } from "react-router-dom";

// Css
import "./NewsItem.css";

const NewsItem = ({
  id,
  title,
  author,
  date,
  status,
  statusRaw,
  isHeader = false,
  userData,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState({
    type: "",
    text: "",
  });
  const [newsData, setNewsData] = useState(null);
  const [loadingNews, setLoadingNews] = useState(false);

  const statusColor = () => {
    if (status === "Aprovado") return "green";
    else if (status === "Em Análise") return "orange";
    else return "red";
  };

  useEffect(() => {
    const fetchNewsData = async () => {
      if (showModal && id && !isHeader) {
        setLoadingNews(true);
        try {
          const newsRef = doc(db, "news", id);
          const newsSnap = await getDoc(newsRef);

          if (newsSnap.exists()) {
            setNewsData({ id: newsSnap.id, ...newsSnap.data() });
          }
        } catch (error) {
          console.error("Erro ao carregar notícia:", error);
        } finally {
          setLoadingNews(false);
        }
      }
    };

    fetchNewsData();
  }, [showModal, id, isHeader]);

  const renderBodyContent = (bodyArray) => {
    if (!bodyArray || !Array.isArray(bodyArray)) return null;

    return bodyArray.map((item, index) => {
      switch (item.type) {
        case "heading":
          return (
            <h2 key={index} dangerouslySetInnerHTML={{ __html: item.text }} />
          );
        case "subheading":
          return (
            <h3 key={index} dangerouslySetInnerHTML={{ __html: item.text }} />
          );
        case "list":
          return (
            <div key={index} dangerouslySetInnerHTML={{ __html: item.text }} />
          );
        case "paragraph":
        default:
          return (
            <p key={index} dangerouslySetInnerHTML={{ __html: item.text }} />
          );
      }
    });
  };

  const createStatusNotification = async (newStatus) => {
    if (!newsData?.author?.uid) return;

    try {
      await addDoc(collection(db, "notifications"), {
        userId: newsData.author.uid,
        type: "NEWS_STATUS",
        postId: id,
        postTitle: title,
        status: newStatus,
        read: false,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Erro ao criar notificação:", error);
    }
  };

  const handleApprove = async () => {
    if (!id || isHeader) return;

    setIsUpdating(true);
    setFeedbackMessage({ type: "", text: "" });

    try {
      const newsRef = doc(db, "news", id);
      await updateDoc(newsRef, {
        status: "published",
        publishedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        views: 0,
      });

      await createStatusNotification("published");

      setFeedbackMessage({
        type: "success",
        text: "Notícia aprovada com sucesso!",
      });

      setTimeout(() => {
        setShowModal(false);
        setFeedbackMessage({ type: "", text: "" });
      }, 2000);
    } catch (error) {
      console.error("Erro ao aprovar notícia:", error);
      setFeedbackMessage({
        type: "error",
        text: "Erro ao aprovar notícia. Tente novamente.",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleReject = async () => {
    if (!id || isHeader) return;

    setIsUpdating(true);
    setFeedbackMessage({ type: "", text: "" });

    try {
      const newsRef = doc(db, "news", id);
      await updateDoc(newsRef, {
        status: "rejected",
        rejectedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      await createStatusNotification("rejected");

      setFeedbackMessage({
        type: "success",
        text: "Notícia reprovada.",
      });

      setTimeout(() => {
        setShowModal(false);
        setFeedbackMessage({ type: "", text: "" });
      }, 2000);
    } catch (error) {
      console.error("Erro ao reprovar notícia:", error);
      setFeedbackMessage({
        type: "error",
        text: "Erro ao reprovar notícia. Tente novamente.",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleEvaluate = () => {
    if (isHeader) return;
    setShowModal(true);
  };

  return (
    <>
      <div className={`news-item-container ${isHeader ? "header" : ""}`}>
        <ul>
          <li>{title}</li>
          <li>{author}</li>
          <li>{date}</li>
          <li>
            <p style={{ color: `${statusColor()}` }}>{status}</p>
            {!isHeader && statusRaw === "pending" && (
              <button onClick={handleEvaluate} disabled={isUpdating}>
                Avaliar
              </button>
            )}
            {!isHeader && statusRaw !== "pending" && (
              <button onClick={handleEvaluate} disabled={isUpdating}>
                Visualizar
              </button>
            )}
          </li>
        </ul>
      </div>

      {/* Modal de Avaliação */}
      {showModal && !isHeader && (
        <div
          className="modal-overlay"
          onClick={() => !isUpdating && setShowModal(false)}
        >
          <div
            className="modal-content modal-content-large"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>Avaliar Notícia</h3>
              <button
                className="close-btn"
                onClick={() => setShowModal(false)}
                disabled={isUpdating}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              {loadingNews ? (
                <div className="loading-news">
                  <p>Carregando notícia...</p>
                </div>
              ) : (
                <>
                  <div className="news-info-detailed">
                    <h4>{title}</h4>
                    <p>
                      <strong>Autor:</strong> {author}
                    </p>
                    <p>
                      <strong>Data:</strong> {date}
                    </p>
                    <p>
                      <strong>Status:</strong>{" "}
                      <span style={{ color: statusColor() }}>{status}</span>
                    </p>

                    {newsData && (
                      <>
                        {newsData.subtitle && (
                          <p>
                            <strong>Subtítulo:</strong> {newsData.subtitle}
                          </p>
                        )}

                        {newsData.category && (
                          <p>
                            <strong>Categoria:</strong> {newsData.category}
                          </p>
                        )}

                        {newsData.imageURL && (
                          <div className="news-image-preview">
                            <img src={newsData.imageURL} alt={title} />
                          </div>
                        )}

                        {newsData.body && Array.isArray(newsData.body) && (
                          <div className="news-content-preview">
                            <h5>Conteúdo:</h5>
                            <div className="content-text">
                              {renderBodyContent(newsData.body)}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {/* Botão de acessar notícia */}
                  {statusRaw === "published" && newsData && (
                    <div className="access-news-section">
                      <Link to={`/news/${id}`} target="_blank">
                        <button className="btn-access-news">
                          Acessar Notícia
                        </button>
                      </Link>
                    </div>
                  )}

                  {statusRaw === "pending" && (
                    <div className="modal-actions">
                      <button
                        className="btn-approve"
                        onClick={handleApprove}
                        disabled={isUpdating}
                      >
                        {isUpdating ? "Aprovando..." : "Aprovar"}
                      </button>
                      <button
                        className="btn-reject"
                        onClick={handleReject}
                        disabled={isUpdating}
                      >
                        {isUpdating ? "Reprovando..." : "Reprovar"}
                      </button>
                      <button
                        className="btn-cancel"
                        onClick={() => setShowModal(false)}
                        disabled={isUpdating}
                      >
                        Cancelar
                      </button>
                    </div>
                  )}

                  {statusRaw !== "pending" && (
                    <div className="modal-actions">
                      <button
                        className="btn-cancel"
                        onClick={() => setShowModal(false)}
                      >
                        Fechar
                      </button>
                    </div>
                  )}

                  {/* Mensagem de feedback */}
                  {feedbackMessage.text && (
                    <div className={`feedback-message ${feedbackMessage.type}`}>
                      {feedbackMessage.text}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NewsItem;

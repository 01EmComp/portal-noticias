import { useState } from "react";
import { Link } from "react-router-dom";

// Font Awesome Icon's
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faExternalLinkAlt, faEye } from "@fortawesome/free-solid-svg-icons";

// Css
import "./NewsModal.css";

const NewsModal = ({ category, news, loading, onClose }) => {
  const [selectedNews, setSelectedNews] = useState(null);

  const formatDate = (timestamp) => {
    if (!timestamp) return "Data não disponível";
    
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      const dateStr = date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      });
      const timeStr = date.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit"
      });
      return `${dateStr} às ${timeStr}`;
    } catch (error) {
      return "Data inválida";
    }
  };

  const translateStatus = (status) => {
    const statusMap = {
      pending: "Em Análise",
      published: "Publicado",
      rejected: "Reprovado"
    };
    return statusMap[status] || status;
  };

  const statusColor = (status) => {
    if (status === "published") return "#4CAF50";
    else if (status === "pending") return "#FF4000";
    else return "#f44336";
  };

  const renderBodyContent = (bodyArray) => {
    if (!bodyArray || !Array.isArray(bodyArray)) return null;

    return bodyArray.map((item, index) => {
      switch (item.type) {
        case 'heading':
          return <h2 key={index} dangerouslySetInnerHTML={{ __html: item.text }} />;
        case 'subheading':
          return <h3 key={index} dangerouslySetInnerHTML={{ __html: item.text }} />;
        case 'list':
          return <div key={index} dangerouslySetInnerHTML={{ __html: item.text }} />;
        case 'paragraph':
        default:
          return <p key={index} dangerouslySetInnerHTML={{ __html: item.text }} />;
      }
    });
  };

  const handleViewDetails = (newsItem) => {
    setSelectedNews(newsItem);
  };

  const handleCloseDetails = () => {
    setSelectedNews(null);
  };

  if (selectedNews) {
    return (
      <div className="modal-overlay" onClick={handleCloseDetails}>
        <div className="modal-content modal-content-details" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>Detalhes da Notícia</h2>
            <button className="close-button" onClick={handleCloseDetails}>
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </div>
          <div className="modal-body">
            <div className="news-details">
              <h3 className="news-details-title">{selectedNews.title}</h3>
              
              <div className="news-details-meta">
                <p><strong>Autor:</strong> {selectedNews.author?.name || "Autor desconhecido"}</p>
                <p><strong>Data:</strong> {formatDate(selectedNews.createdAt)}</p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span style={{ color: statusColor(selectedNews.status) }}>
                    {translateStatus(selectedNews.status)}
                  </span>
                </p>
                <p><strong>Categoria:</strong> {selectedNews.category}</p>
                {selectedNews.views !== undefined && (
                  <p><strong>Visualizações:</strong> {selectedNews.views}</p>
                )}
              </div>

              {selectedNews.subtitle && (
                <div className="news-details-subtitle">
                  <h4>Subtítulo</h4>
                  <p>{selectedNews.subtitle}</p>
                </div>
              )}

              {selectedNews.imageURL && (
                <div className="news-details-image">
                  <img src={selectedNews.imageURL} alt={selectedNews.title} />
                </div>
              )}

              {selectedNews.body && Array.isArray(selectedNews.body) && (
                <div className="news-details-content">
                  <h4>Conteúdo</h4>
                  <div className="content-preview">
                    {renderBodyContent(selectedNews.body)}
                  </div>
                </div>
              )}

              {selectedNews.status === "published" && (
                <div className="news-details-actions">
                  <Link to={`/news/${selectedNews.id}`} target="_blank">
                    <button className="btn-access-news">
                      <FontAwesomeIcon icon={faExternalLinkAlt} />
                      Acessar Notícia Completa
                    </button>
                  </Link>
                </div>
              )}

              <div className="news-details-back">
                <button className="btn-back" onClick={handleCloseDetails}>
                  Voltar à Lista
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Notícias - {category}</h2>
          <button className="close-button" onClick={onClose}>
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>
        <div className="modal-body">
          {loading ? (
            <p className="loading-news">Carregando notícias...</p>
          ) : news.length === 0 ? (
            <p className="no-news">Nenhuma notícia encontrada nesta categoria.</p>
          ) : (
            <div className="news-list">
              {news.map((item) => (
                <div key={item.id} className="news-card">
                  {item.imageURL && (
                    <div className="news-card-image">
                      <img src={item.imageURL} alt={item.title} />
                    </div>
                  )}
                  <div className="news-card-content">
                    <h3>{item.title || "Sem título"}</h3>
                    {item.subtitle && (
                      <p className="news-card-subtitle">{item.subtitle}</p>
                    )}
                    <div className="news-card-meta">
                      <span className="news-author">
                        {item.author?.name || "Autor desconhecido"}
                      </span>
                      <span className="news-date">
                        {formatDate(item.createdAt)}
                      </span>
                      <span 
                        className="news-status"
                        style={{ color: statusColor(item.status) }}
                      >
                        {translateStatus(item.status)}
                      </span>
                    </div>
                    <div className="news-card-actions">
                      <button 
                        className="btn-view-details"
                        onClick={() => handleViewDetails(item)}
                      >
                        <FontAwesomeIcon icon={faEye} />
                        Ver Detalhes
                      </button>
                      {item.status === "published" && (
                        <Link to={`/news/${item.id}`} target="_blank">
                          <button className="btn-access">
                            <FontAwesomeIcon icon={faExternalLinkAlt} />
                            Acessar
                          </button>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsModal;
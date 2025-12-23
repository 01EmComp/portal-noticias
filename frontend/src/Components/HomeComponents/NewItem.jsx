import { Link } from "react-router-dom";

// Função auxiliar para formatar a data (opcional, você pode usar a que já tem no News.js)
const formatTimeAgo = (timestamp) => {
  if (!timestamp) return "Recentemente";
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  const diffMs = new Date() - date;
  const diffHours = Math.floor(diffMs / 3600000);

  if (diffHours < 1) return "Agora mesmo";
  if (diffHours < 24) return `${diffHours}h atrás`;
  return date.toLocaleDateString("pt-BR");
};

// Css
import "./NewItem.css";

const NewItem = ({ news }) => {
  if (!news) return null;

  return (
    /* 1. Link dinâmico usando o ID da notícia */
    <Link to={`/news/${news.id}`} className="news-item-link">
      <div className="newItem">
        <div className="left-side">
          {/* 2. Imagem dinâmica */}
          <img src={news.imageURL || "/placeholder.jpg"} alt={news.title} />
        </div>
        <div className="right-side">
          <div className="news-title">
            {/* 3. Título e Categoria dinâmicos */}
            <p>{news.title}</p>
            <span style={{ color: "#ff0000ff" }}>{news.category}</span>
          </div>
          <div className="credits">
            {/* 4. Foto do autor (se houver) e Nome */}
            <div
              className="perfil-box"
              style={{
                backgroundImage: `url(${news.author?.photoURL})`,
                backgroundSize: "cover",
              }}
            ></div>
            <p>{news.author?.name || "Autor Desconhecido"}</p>-{" "}
            <span>{formatTimeAgo(news.createdAt)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default NewItem;

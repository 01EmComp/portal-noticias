import { Link } from "react-router-dom";

// Css
import "./NewItem.css";

// Images
import img from "/src/Assets/Images/art-1.jpg";

const NewItem = () => {
  return (
    <Link to="/news">
      <div className="newItem">
        <div className="left-side">
          <img src={img} alt="Notícia" />
        </div>
        <div className="right-side">
          <div className="news-title">
            <p>ENEM: Como se preparar para o ENEM 2025?</p>
            <span style={{ color: "#ff0000ff" }}>Educação</span>
          </div>
          <div className="credits">
            <div className="perfil-box"></div>
            <p>BBC News</p>-<span>12h atrás</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default NewItem;

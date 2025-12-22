// Font Awesome Icon's
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";

// Css
import "./CategoriesItem.css";

const CategoriesItem = ({ category, quant, action, isHeader, onViewNews, hasNews }) => {
  return (
    <div className="categories-item-container">
      <ul>
        <li>{category}</li>
        <li>{quant}</li>
        <div>
          {isHeader ? (
            <p className="action-header">{action}</p>
          ) : (
            <div className="icon">
              <button
                onClick={() => onViewNews(category)}
                disabled={!hasNews}
                className={`view-button ${!hasNews ? 'disabled' : ''}`}
                title={hasNews ? `Ver notícias de ${category}` : 'Nenhuma notícia disponível'}
              >
                <p>Visualizar</p>
                <FontAwesomeIcon icon={faEye} style={{ fontSize: "16px" }} />
              </button>
            </div>
          )}
        </div>
      </ul>
    </div>
  );
};

export default CategoriesItem;
// Font Awesome Icon's
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

// Css
import "./CategoriesItem.css";

const CategoriesItem = ({ category, quant, acess }) => {
  return (
    <div className="categories-item-container">
      <ul>
        <li>{category}</li>
        <li>{quant}</li>
        <div>
          <p>{acess}</p>
          <div className="icon">
            <p>Arquivo</p>
            <FontAwesomeIcon icon={faArrowRight} style={{ fontSize: "16px" }} />
          </div>
        </div>
      </ul>
    </div>
  );
};

export default CategoriesItem;

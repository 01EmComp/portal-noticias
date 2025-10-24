
// Font Awesome Icon's
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";

// Css
import "./UsersItem.css";

const UsersItem = ({ name, email }) => {
  return (
    <div className="users-item">
      <div className="user-name">{name}</div>
      <div className="user-email">{email}</div>
      <div className="user-actions">
        <button className="user-action-button">
          <FontAwesomeIcon icon={faGear} />
        </button>
      </div>
    </div>
  );
};

export default UsersItem;

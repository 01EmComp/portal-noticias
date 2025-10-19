import { useState } from "react";

// Font Awesome Icon's
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";

// Css
import "./UsersItem.css";

const UsersItem = ({ name, email }) => {
  return (
    <div className="users-item-container">
      <ul>
        <li>{name}</li>
        <li>{email}</li>
        <div>
          <button>
            <FontAwesomeIcon icon={faGear} style={{ fontSize: "18px" }} />
          </button>
        </div>
      </ul>
    </div>
  );
};

export default UsersItem;

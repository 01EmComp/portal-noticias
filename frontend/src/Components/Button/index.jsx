  import React from "react";
  import "./style.css";

  function ActionButton({ text, onClick, style = {}, type = "button" }) {
    return (
      <button className="action-button" onClick={onClick} style={style} type={type}>
        <h3>{text}</h3>
      </button>
    );
  }

  export default ActionButton;

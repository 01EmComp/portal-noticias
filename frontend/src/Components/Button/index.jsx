import React from "react";
import "./style.css";

function ActionButton({ text, onClick, style = {} }) {
  return (
    <button className="action-button" onClick={onClick} style={style}>
      <h3>{text}</h3>
    </button>
  );
}

export default ActionButton;

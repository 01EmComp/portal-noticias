import { useState } from "react";

// Css
import "./NewsItem.css";

const NewsItem = ({ title, author, date, status }) => {
  const statusColor = () => {
    if (status == "Aprovado") return "green";
    else if (status == "Em Análise") return "orange";
    else return "red";
  };

  return (
    <div className="news-item-container">
      <ul>
        <li>{title}</li>
        <ul>
          <li>{author}</li>
          <li>{date}</li>
          <li>
            <p style={{ color: `${statusColor()}` }}>{status}</p>
            <button>Avaliar</button>
          </li>
        </ul>
      </ul>
    </div>
  );
};

export default NewsItem;

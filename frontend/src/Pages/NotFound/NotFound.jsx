import React from "react";
import { useNavigate } from "react-router-dom";

import sad from "../../Assets/Images/sad.png";

import "./NotFound.css";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found-container">
      <div className="not-found-card">
        <img
          src={sad}
          alt="Ícone de página não encontrada"
          className="not-found-image"
        />
        <h1 className="not-found-title">OPS!</h1>
        <p className="not-found-desc">Pagina não encontrada!!</p>
        <p className="not-found-desc">Clique abaixo para retornar ao menu principal</p>
        <button
          className="not-found-button"
          onClick={() => navigate("/")}
          aria-label="Ir para o menu inicial"
        >
          Menu Inicial
        </button>
      </div>
    </div>
  );
};

export default NotFound;
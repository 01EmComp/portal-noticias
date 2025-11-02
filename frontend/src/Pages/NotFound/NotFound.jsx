import React from "react";
import { useNavigate } from "react-router-dom";
import sad from "../../Assets/Images/sad.png"
const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <img
          src={sad}
          alt="Ícone de página não encontrada"
          style={{ width: 150, marginBottom: 20 }}
        />
        <h1 style={titleStyle}>OPS!</h1>
        <p style={descStyle}>Pagina não encontrada!!</p>
        <p style={descStyle}>Clique abaixo para retornar ao menu principal</p>
        <button
          style={buttonStyle}
          onClick={() => navigate("/")}
          aria-label="Ir para o menu principal"
        >
          Menu Principal
        </button>
      </div>
    </div>
  );
};

const containerStyle = {
  minHeight: "65vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#f5f7fb",
  padding: "1rem",
};

const cardStyle = {
  textAlign: "center",
  background: "#fff",
  padding: "4rem 2.5rem",
  borderRadius: 8,
  boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
  maxWidth: 620,
  width: "100%",
};

const titleStyle = {
  margin: 0,
  fontSize: "3.5rem",
  color: "#111827",
};

const descStyle = {
  margin: "0.5rem 0 1.5rem",
  color: "#374151",
};

const buttonStyle = {
  background: "#FF4000",
  color: "#fff",
  border: "none",
  padding: "0.80rem 6rem",
  borderRadius: 6,
  cursor: "pointer",
  fontSize: "1rem",
};

export default NotFound;
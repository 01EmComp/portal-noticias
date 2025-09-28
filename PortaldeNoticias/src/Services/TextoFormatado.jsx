import React from "react";

function TextoFormatado({ conteudo }) {
  const paragrafos = conteudo.split(/\n\s*\n/);

  return (
    <div>
      {paragrafos.map((p, index) => (
        <p key={index} style={{ marginBottom: "1.5em", lineHeight: "1.6", textAlign: "justify" }}>
          {p.trim()}
        </p>
      ))}
    </div>
  );
}

export default TextoFormatado;

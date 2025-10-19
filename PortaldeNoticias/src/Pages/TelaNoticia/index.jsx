import { useLocation } from "react-router-dom";
import Header from "../../Components/Header";
import TextoFormatado from "../../Services/TextoFormatado";
import "./style.css";

function TelaNoticia() {
  const { state } = useLocation();
  const { titulo, autor, data, hora, imagem, texto } = state || {};

  return (
    <>
      <Header />
      <div className="noticia-background">
        <div className="noticia-container">
          <h1>{titulo}</h1>
          <p className="noticia-meta">{autor}, {data} às {hora}</p>
          {imagem && <img src={imagem} alt="Imagem da notícia" className="noticia-imagem" />}
          <TextoFormatado conteudo={texto} />
        </div>
      </div>
    </>
  );
}

export default TelaNoticia;

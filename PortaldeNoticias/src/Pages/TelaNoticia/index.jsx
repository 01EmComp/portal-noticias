import { useLocation } from "react-router-dom";
import Header from "../../componentes/Header";
import TextoFormatado from "/home/serafim/SiteNoticiasEmcomp/portal-noticias/PortaldeNoticias/src/uses/TextoFormatado.jsx";
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

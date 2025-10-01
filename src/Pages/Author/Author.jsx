import { useState } from "react";

// Components
import NewItem from "../../Components/HomeComponents/NewItem";

// Font Awesome Icon's
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";

// Images
import authorImg from "/src/Assets/Images/author.png";

// Css
import "./Author.css";

const Author = () => {
  const [newItemNum, setNewItemNum] = useState(3);

  return (
    <div className="author-container">
      <section className="about-author">
        <h2>José Nogueira Dias</h2>
        <div className="img-and-desc">
          <img src={authorImg} alt="Foto de perfil do autor" />
          <div className="description">
            <h3>Sobre o autor:</h3>
            <p>
              Repórter com mais de 10 anos de experiência. No GLOBO, cobriu
              Copas do Mundo, foi setorista do Flamengo e especializou-se nos
              bastidores e mercado da bola.
            </p>
          </div>
        </div>
      </section>
      <section className="their-news">
        <p>Noticias Realizadas</p>
        <div className="published-news">
          {Array.from({ length: newItemNum }, (_, i) => (
            <NewItem key={i} />
          ))}
        </div>
        <div className="more" onClick={() => setNewItemNum(newItemNum + 2)}>
          <p>Mais</p>
          <FontAwesomeIcon
            icon={faAngleDown}
            style={{
              color: "black",
              marginTop: "2px",
              fontSize: "14px",
            }}
          />
        </div>
      </section>
    </div>
  );
};

export default Author;

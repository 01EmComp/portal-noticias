import { useState } from "react";
import NewItem from "../../Components/HomeComponents/NewItem";
import Button from "../../Components/Button/index";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import authorImg from "/src/Assets/Images/author.png";
import "./Reporter.css";

const Reporter = () => {
  const [newItemNum, setNewItemNum] = useState(3);

  return (
    <div className="reporter-container">
      <section className="about-reporter">
        <h2>José Nogueira Dias</h2>
        <div className="img-and-desc">
          <img src={authorImg} alt="Foto de perfil do repórter" />

        </div>
        <Button
          text="Meus dados"
          style={{ marginTop: "10px", padding: "16px 70px" }}
        />
      </section>
      <section className="their-news">
        <p>Notícias Realizadas</p>
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

export default Reporter;

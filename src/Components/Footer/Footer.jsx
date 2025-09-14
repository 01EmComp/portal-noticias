import { Link } from "react-router-dom";

// Font Awesome Icon's
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { faFacebook } from "@fortawesome/free-brands-svg-icons";
import { faTelegram } from "@fortawesome/free-brands-svg-icons";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";
import { faYoutube } from "@fortawesome/free-brands-svg-icons";

// Css
import "./Footer.css";

const Footer = () => {
  return (
    <footer>
      <div className="top">
        <div className="social">
          <p>Nossas redes</p>
          <div>
            <Link to="/">
              <FontAwesomeIcon className="icon" icon={faWhatsapp} />
            </Link>
            <Link to="/">
              <FontAwesomeIcon className="icon" icon={faTelegram} />
            </Link>
            <Link to="/">
              <FontAwesomeIcon className="icon" icon={faFacebook} />
            </Link>
            <Link to="/">
              <FontAwesomeIcon className="icon" icon={faTwitter} />
            </Link>
            <Link to="/">
              <FontAwesomeIcon className="icon" icon={faInstagram} />
            </Link>
            <Link to="/">
              <FontAwesomeIcon className="icon" icon={faYoutube} />
            </Link>
          </div>
        </div>
        <div className="hr first"></div>
        <div className="links">
          <div className="links-1">
            <Link to="/">
              <p>Eventos</p>
            </Link>
            <Link to="/">
              <p>Geral</p>
            </Link>
            <Link to="/">
              <p>Saúde</p>
            </Link>
          </div>
          <div className="links-2">
            <Link to="/">
              <p>Cidade</p>
            </Link>
            <Link to="/">
              <p>Cultura</p>
            </Link>
            <Link to="/">
              <p>Entretenimento</p>
            </Link>
          </div>
          <div className="links-3">
            <Link to="/">
              <p>Polícia</p>
            </Link>
            <Link to="/">
              <p>Economia</p>
            </Link>
            <Link to="/">
              <p>Esporte</p>
            </Link>
          </div>
        </div>
      </div>
      <div className="hr"></div>
      <div className="bottom">
        <Link to="/">
          <p>Sobre o Notícias RP</p>
        </Link>
        <Link to="/">
          <p>Aviso legal e Política de Privacidade</p>
        </Link>
        <Link to="/">
          <p>Fale com o Notícias RP</p>
        </Link>
      </div>
    </footer>
  );
};

export default Footer;

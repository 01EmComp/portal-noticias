import { useState } from "react";

// Font Awesome Icon's
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExpand } from "@fortawesome/free-solid-svg-icons";

// Css
import "./ImageFullScreen.css";

const ImageFullScreen = ({ src, alt }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Imagem normal */}
      <div className="image">
        <img src={src} alt={alt} className="preview-image" />
        <div className="vignette" onClick={() => setIsOpen(true)}>
          <FontAwesomeIcon
            icon={faExpand}
            style={{ fontSize: "32px", color: "#fff" }}
          />
        </div>
      </div>

      {/* Tela cheia */}
      {isOpen && (
        <div className="fullscreen-overlay" onClick={() => setIsOpen(false)}>
          <img src={src} alt={alt} className="fullscreen-image" />
        </div>
      )}
    </>
  );
};

export default ImageFullScreen;

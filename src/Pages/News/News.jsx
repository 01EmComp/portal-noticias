import { useState } from "react";

// Font Awesome Icon's
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook } from "@fortawesome/free-brands-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { faLink } from "@fortawesome/free-solid-svg-icons";

// Image
import img from "/src/Assets/Images/Welcome-mensage.png";

// Css
import "./News.css";

function Contact() {
  const [news, setNews] = useState(
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras sit amet  sagittis odio. Sed ut metus sapien. Vestibulum eget tempus lectus.  Integer venenatis lacus et cursus faucibus. Maecenas eu posuere dui.  Pellentesque vestibulum nibh a lacinia ullamcorper. Aliquam aliquam  tempus ex, non pellentesque tortor consequat vitae. Duis semper mattis  ante, a molestie est tristique non. Quisque lacinia odio lectus, eu  euismod urna dapibus eget. Sed lacinia urna sem, eget pretium metus  auctor at. Nam mollis tellus ac magna dictum, a fringilla mauris iaculis. Aenean  nec pulvinar lectus. Suspendisse potenti. Sed commodo aliquam lacus,  vitae pharetra ligula placerat in. Aliquam accumsan sapien neque, sit  amet pellentesque mi porta non. Cras vitae dolor sed sem aliquet  pellentesque. Nunc ac metus nec risus porta laoreet at et tellus. Nam  venenatis odio non quam congue cursus. Curabitur porttitor lacus cursus  elit dignissim sollicitudin. Integer vestibulum ex lorem, sed auctor  nisl aliquet vitae. Curabitur porta est vel ex venenatis euismod.  Vivamus at libero vel arcu varius interdum et eu metus. Praesent  imperdiet ullamcorper dolor non interdum. Pellentesque ultricies, metus nec pellentesque scelerisque, mauris risus pulvinar mi, vel auctor ex risus a sem. Maecenas nec tristique augue,  vitae porttitor orci. Vestibulum condimentum elementum rutrum. In hac  habitasse platea dictumst. Nunc non condimentum metus. Proin quis varius erat, vel iaculis odio. Fusce sit amet lectus laoreet, aliquet lectus  in, tempor purus. Vivamus semper mi et egestas volutpat. Proin mattis  dui malesuada turpis facilisis, nec tincidunt eros blandit. Vivamus id  magna ultrices, rutrum mi at, dictum augue. Quisque dictum sit amet  libero fermentum euismod. Duis placerat nunc dolor, at placerat ipsum  volutpat eget. Curabitur vestibulum magna vitae leo tempus, vel iaculis  justo consequat. Fusce ac nunc in nulla lacinia lacinia. Fusce eu urna eu leo varius feugiat vel vitae purus. Proin iaculis nisl  ut sapien efficitur, non auctor ex accumsan. Pellentesque ut ornare  ligula. Maecenas volutpat arcu a nulla pulvinar consequat. Mauris  consectetur urna vitae lacus malesuada, vel posuere risus dignissim.  Duis placerat neque tellus, quis egestas enim vulputate vel.  Pellentesque sodales justo metus, at pulvinar tellus facilisis sit amet. Phasellus in lorem sit amet elit maximus malesuada. Praesent volutpat  dictum mollis. Duis et justo euismod, egestas enim non, venenatis lorem. Etiam eget dignissim tellus. Praesent pellentesque enim tellus, ut  elementum libero tristique a. Sed tristique leo eu facilisis  scelerisque. Etiam tortor nunc, imperdiet ut maximus eget, lacinia non  mauris. Suspendisse metus libero, ornare a auctor in, ultrices et purus. Proin ac consequat sapien, ut hendrerit lorem. Aenean finibus nibh eu  nisl facilisis, nec tincidunt sem interdum. Suspendisse venenatis ligula semper lectus bibendum blandit."
  );

  return (
    <div className="news-container">
      <section className="header">
        <div className="about">
          <div className="title-and-author">
            <h2>Lorem Ipsum</h2>
            <div className="author-and-time">
              <div className="author">
                <p>
                  Autor: <span>Joel Santos</span>
                </p>
              </div>
              <div className="date">
                <p>00/00/00</p>
                <p>às</p>
                <p>00:00:00</p>
              </div>
            </div>
          </div>
          <div className="social-links">
            <div className="facebook">
              <FontAwesomeIcon
                icon={faFacebook}
                style={{ color: "#0091ff", fontSize: "24px" }}
              />
            </div>
            <div className="whatsapp">
              <FontAwesomeIcon
                icon={faWhatsapp}
                style={{ color: "#22cc00", fontSize: "24px" }}
              />
            </div>
            <div className="link">
              <FontAwesomeIcon icon={faLink} style={{ fontSize: "20px" }} />
            </div>
          </div>
        </div>
        <div className="image">
          <img src={img} alt="Imagem da notícia" />
        </div>
      </section>
      <section className="news-text">
        <p>{news}</p>
      </section>
    </div>
  );
}

export default Contact;

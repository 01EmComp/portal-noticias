import "./Home.css";

// Images
import img1 from "/src/Assets/Images/art-1.jpg";
import img2 from "/src/Assets/Images/art-2.jpg";
import img3 from "/src/Assets/Images/art-3.jpg";
import img4 from "/src/Assets/Images/art-4.jpg";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Navigation,
  Pagination,
  EffectCoverflow,
  Autoplay,
} from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "swiper/css/effect-coverflow";

// Components
import NewItem from "/src/Components/HomeComponents/NewItem";

// Font Awesome Icon's
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { faCloud } from "@fortawesome/free-regular-svg-icons";
import { faCalendar } from "@fortawesome/free-regular-svg-icons";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";

const Home = () => {
  const images = [img1, img2, img3, img4];

  return (
    <div className="h-container">
      <section className="h-social">
        <div className="top">
          <h2 className="sub-title">Siga-nos</h2>
          <p>
            Mais{" "}
            <FontAwesomeIcon
              icon={faArrowRight}
              style={{ fontSize: "12px", color: "rgba(0, 0, 0, 0.5)" }}
            />
          </p>
        </div>
        <div className="bottom">
          <div className="social-story"></div>
          <div className="social-story"></div>
          <div className="social-story"></div>
          <div className="social-story"></div>
          <div className="social-story"></div>
        </div>
      </section>
      <section className="h-main-new">
        <div className="top">
          <h2 className="sub-title">Mais acessado</h2>
          <div className="weather">
            <span className="degrees">22°</span>
            <div className="icon">
              <FontAwesomeIcon
                icon={faCloud}
                style={{ color: "var(--primary-color)", fontSize: "14px" }}
              />
            </div>
          </div>
        </div>
        <div className="bottom">
          <img src={img1} alt="Notícia" />
          <div className="informations">
            <p>Produtores rurais em Rio Pomba Minas Gerais</p>
            <div className="icons">
              <FontAwesomeIcon
                icon={faCalendar}
                style={{ color: "#fff", fontSize: "13px" }}
              />
              <div className="hr"></div>
              <div className="perfil-box"></div>
            </div>
          </div>
          <div className="deg"></div>
        </div>
      </section>
      <section className="h-news">
        <div className="top">
          <h2 className="sub-title">Notícias</h2>
          <FontAwesomeIcon
            icon={faArrowRight}
            style={{
              fontSize: "16px",
              color: "var(--secundary-color)",
              marginTop: "4px",
            }}
          />
        </div>
        <div className="bottom">
          <NewItem />
          <NewItem />
          <NewItem />
        </div>
        <div className="more">
          <p>Mais</p>
          <FontAwesomeIcon
            icon={faAngleDown}
            style={{
              color: "black",
              marginTop: "4px",
              fontSize: "14px",
              marginLeft: "3px",
            }}
          />
        </div>
      </section>
      <section className="h-slider">
        <div className="top">
          <h2 className="sub-title">Descubra</h2>
          <FontAwesomeIcon
            icon={faArrowRight}
            style={{
              fontSize: "16px",
              color: "var(--secundary-color)",
              marginTop: "4px",
            }}
          />
        </div>
        <div className="bottom">
          <Swiper
            className="slide"
            modules={[EffectCoverflow, Navigation, Pagination, Autoplay]}
            slidesPerView="auto"
            centeredSlides
            loop
            loopedSlides={images.length}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            effect="coverflow"
            grabCursor
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 200,
              modifier: 2.5,
              slideShadows: false,
            }}
          >
            {images.map((src, index) => (
              <SwiperSlide
                key={index}
                style={{ width: 820 }}
                className="swiper-slide"
              >
                <img className="slide-item" src={src} alt={`slide-${index}`} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>
      <section className="h-colaborator">
        <div className="lines">
          <div className="left-side">
            <p>Quer ser um</p>
            <span>colaborador</span>?
          </div>
          <div className="right-side">
            <div className="button-link">Clique aqui</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

import { Link } from "react-router-dom";
import { useState } from "react";

// Instagram lib
import Stories from "react-insta-stories";

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
import StoriesItem from "/src/Components/HomeComponents/Stories";

// Font Awesome Icon's
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { faCloud, faCalendar } from "@fortawesome/free-regular-svg-icons";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";

// Css
import "./Home.css";

const Home = () => {
  const images = [img1, img2, img3, img4];
  const [storyOpen, setStoryOpen] = useState(false);

  // Stories List
  const storyList = [
    {
      content: ({ action, story }) => (
        <img
          src={img1}
          alt="Story 1"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ),
      duration: 5000,
    },
  ];

  return (
    <div className="h-container">
      <section className="h-social">
        <div className="top">
          <h2 className="sub-title">Siga-nos</h2>
        </div>
        <div className="bottom--scroolX">
          <div onClick={() => setStoryOpen(true)}>
            <StoriesItem />
          </div>
          <div onClick={() => setStoryOpen(true)}>
            <StoriesItem />
          </div>
          <div onClick={() => setStoryOpen(true)}>
            <StoriesItem />
          </div>
          <div onClick={() => setStoryOpen(true)}>
            <StoriesItem />
          </div>
          <div onClick={() => setStoryOpen(true)}>
            <StoriesItem />
          </div>
          <div onClick={() => setStoryOpen(true)}>
            <StoriesItem />
          </div>
          <div onClick={() => setStoryOpen(true)}>
            <StoriesItem />
          </div>
          <div onClick={() => setStoryOpen(true)}>
            <StoriesItem />
          </div>
          <div onClick={() => setStoryOpen(true)}>
            <StoriesItem />
          </div>
          <div onClick={() => setStoryOpen(true)}>
            <StoriesItem />
          </div>
          <div onClick={() => setStoryOpen(true)}>
            <StoriesItem />
          </div>
          <div onClick={() => setStoryOpen(true)}>
            <StoriesItem />
          </div>
          <div onClick={() => setStoryOpen(true)}>
            <StoriesItem />
          </div>
          <div onClick={() => setStoryOpen(true)}>
            <StoriesItem />
          </div>
          <div onClick={() => setStoryOpen(true)}>
            <StoriesItem />
          </div>
          <div onClick={() => setStoryOpen(true)}>
            <StoriesItem />
          </div>
          <div onClick={() => setStoryOpen(true)}>
            <StoriesItem />
          </div>
          <div onClick={() => setStoryOpen(true)}>
            <StoriesItem />
          </div>
        </div>
        {storyOpen && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0,0,0,0.9)",
              zIndex: 5,
            }}
          >
            <button
              onClick={() => setStoryOpen(false)}
              style={{
                position: "absolute",
                top: "2rem",
                right: "1.5rem",
                fontSize: "1.5rem",
                color: "#fff",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                zIndex: 100000,
              }}
            >
              X
            </button>
            <Stories
              stories={storyList}
              defaultInterval={4000}
              width="100%"
              height="100%"
            />
          </div>
        )}
      </section>
      <section className="h-main-new">
        <div className="top">
          <h2 className="sub-title">Mais acessado</h2>
          <div className="weather">
            <span className="degrees">22°</span>
            <div className="icon">
              <FontAwesomeIcon
                icon={faCloud}
                style={{ color: "var(--primary-color)", fontSize: "18px" }}
              />
            </div>
          </div>
        </div>
        <div className="bottoms">
          <div className="bottom">
            <img src={img1} alt="Notícia" />
            <div className="informations">
              <p>Produtores rurais em Rio Pomba Minas Gerais</p>
              <div className="icons">
                <FontAwesomeIcon
                  icon={faCalendar}
                  style={{ color: "#fff", fontSize: "18px" }}
                />
                <div className="hr"></div>
                <div className="perfil-box"></div>
              </div>
            </div>
            <div className="deg"></div>
          </div>
          <div className="bottom secondDiv">
            <img src={img1} alt="Notícia" />
            <div className="informations">
              <p>Produtores rurais em Rio Pomba Minas Gerais</p>
              <div className="icons">
                <FontAwesomeIcon
                  icon={faCalendar}
                  style={{ color: "#fff", fontSize: "18px" }}
                />
                <div className="hr"></div>
                <div className="perfil-box"></div>
              </div>
            </div>
            <div className="deg"></div>
          </div>
        </div>
      </section>
      <section className="h-news">
        <div className="top">
          <Link to="/">
            <h2 className="sub-title">Notícias</h2>
          </Link>
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
          <Link to="/">
            <h2 className="sub-title">Descubra</h2>
          </Link>
          <FontAwesomeIcon
            icon={faArrowRight}
            style={{
              fontSize: "24px",
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
            <span>colaborador</span>
          </div>
          <div className="right-side">
            <Link to="/contact">
              <div className="button-link">Clique aqui</div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

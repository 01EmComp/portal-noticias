import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

// Instagram lib
import Stories from "react-insta-stories";

// Firebase
import { db } from "/src/Services/firebaseConfig";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";

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

// Font Awesome Icon's
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { faCloud, faCalendar } from "@fortawesome/free-regular-svg-icons";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";

// Css
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();
  const [storyOpen, setStoryOpen] = useState(false);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showAllNews, setShowAllNews] = useState(false);

  // Estados das notícias
  const [storyNews, setStoryNews] = useState([]);
  const [featuredNews, setFeaturedNews] = useState([]);
  const [allNews, setAllNews] = useState([]);
  const [discoverNews, setDiscoverNews] = useState([]);

  // Buscar notícias
  useEffect(() => {
    fetchAllNews();
  }, []);

  const fetchAllNews = async () => {
    try {
      setLoading(true);
      const newsRef = collection(db, "news");
      const newsQuery = query(
        newsRef,
        where("status", "==", "published"),
        orderBy("publishedAt", "desc")
      );

      const querySnapshot = await getDocs(newsQuery);
      const newsList = querySnapshot.docs.map((doc) => ({
        docId: doc.id,
        ...doc.data(),
      }));

      // Stories
      setStoryNews(newsList.slice(0, 18));

      // Mais acessados
      const sortedByViews = [...newsList].sort(
        (a, b) => (b.views || 0) - (a.views || 0)
      );
      setFeaturedNews(sortedByViews.slice(0, 2));

      // Notícias
      setAllNews(newsList);

      // Descubra
      const shuffled = [...newsList].sort(() => 0.5 - Math.random());
      setDiscoverNews(shuffled.slice(0, 10));
    } catch (error) {
      console.error("Erro ao buscar notícias:", error);
    } finally {
      setLoading(false);
    }
  };

  const storyList = storyNews.map((news) => ({
    content: ({ action, story }) => (
      <div
        className="story-content"
        onClick={() => {
          setStoryOpen(false);
          navigate(`/news/${news.id}`);
        }}
      >
        <img src={news.imageURL} alt={news.title} className="story-image" />
        <div className="story-text-overlay">
          <h3>{news.title}</h3>
          <p>{news.category}</p>
        </div>
      </div>
    ),
    duration: 5000,
  }));

  const openStory = (index) => {
    setCurrentStoryIndex(index);
    setStoryOpen(true);
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "Recente";

    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffHours < 1) return "Agora";
    if (diffHours < 24) return `${diffHours}h atrás`;
    if (diffDays === 1) return "Ontem";
    if (diffDays < 7) return `${diffDays}d atrás`;

    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
    });
  };

  const truncateTitle = (title, maxLength = 12) => {
    return title && title.length > maxLength
      ? title.substring(0, maxLength) + "..."
      : title || "Notícia";
  };

  const displayedNews = showAllNews ? allNews : allNews.slice(0, 6);

  if (loading) {
    return (
      <div className="h-container">
        <div className="loading-home">
          <div className="loading-spinner"></div>
          <p>Carregando notícias...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-container">
      {/* Stories Section */}
      <section className="h-social">
        <div className="top">
          <h2 className="sub-title">Últimas Notícias</h2>
        </div>
        {storyNews.length > 0 ? (
          <div className="bottom--scroolX">
            {storyNews.map((news, index) => (
              <div key={news.id} onClick={() => openStory(index)}>
                <div className="story">
                  <div className="arc-story">
                    <div
                      className="social-story"
                      style={{
                        backgroundImage: `url(${news.imageURL})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    ></div>
                  </div>
                  <p>{truncateTitle(news.title)}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">📰</div>
            <h3>Nenhuma notícia disponível</h3>
            <p>Ainda não há notícias publicadas. Volte mais tarde!</p>
          </div>
        )}
        {storyOpen && storyList.length > 0 && (
          <div className="story-overlay">
            <button
              onClick={() => setStoryOpen(false)}
              className="story-close-btn"
            >
              ✕
            </button>
            <Stories
              stories={storyList}
              currentIndex={currentStoryIndex}
              defaultInterval={5000}
              width="100%"
              height="100%"
              onAllStoriesEnd={() => setStoryOpen(false)}
            />
          </div>
        )}
      </section>

      {/* Mais Acessado Section */}
      <section className="h-main-new">
        <div className="top">
          <h2 className="sub-title">Mais acessado</h2>
          <div className="weather">
            <div className="weather-and-city">
              <span className="degrees">22°</span>
              <span className="local">Rio Pomba - Minas Gerais</span>
            </div>
            <div className="icon">
              <FontAwesomeIcon
                icon={faCloud}
                style={{ color: "var(--primary-color)", fontSize: "18px" }}
              />
            </div>
          </div>
        </div>
        {featuredNews.length > 0 ? (
          <div className="bottoms">
            {featuredNews.map((news, index) => (
              <div
                key={news.id}
                className={`bottom ${index === 1 ? "secondDiv" : ""}`}
                onClick={() => navigate(`/news/${news.id}`)}
              >
                <img src={news.imageURL} alt={news.title} />
                <div className="informations">
                  <p>{news.title}</p>
                  <div className="icons">
                    <FontAwesomeIcon
                      icon={faCalendar}
                      style={{ color: "#fff", fontSize: "18px" }}
                    />
                    <div className="hr"></div>
                    <div
                      className="perfil-box"
                      style={{
                        backgroundImage: news.author?.photoURL
                          ? `url(${news.author.photoURL})`
                          : "none",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    ></div>
                    <span className="views-count">{news.views || 0} views</span>
                  </div>
                </div>
                <div className="deg"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">🔥</div>
            <h3>Nenhuma notícia em destaque</h3>
            <p>As notícias mais acessadas aparecerão aqui em breve!</p>
          </div>
        )}
      </section>

      {/* Notícias Section */}
      <section className="h-news">
        <div className="top">
          <Link to="/search">
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
        {allNews.length > 0 ? (
          <>
            <div className="bottom">
              {displayedNews.map((news) => (
                <Link key={news.id} to={`/news/${news.id}`}>
                  <div className="newItem">
                    <div className="left-side">
                      <img src={news.imageURL} alt={news.title} />
                    </div>
                    <div className="right-side">
                      <div className="news-title">
                        <p>{news.title}</p>
                        <span style={{ color: "#ff0000ff" }}>
                          {news.category}
                        </span>
                      </div>
                      <div className="credits">
                        <div
                          className="perfil-box"
                          style={{
                            backgroundImage: news.author?.photoURL
                              ? `url(${news.author.photoURL})`
                              : "none",
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                          }}
                        ></div>
                        <p>{news.author?.name || "Autor"}</p>-
                        <span>
                          {formatDate(news.publishedAt || news.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            {allNews.length > 6 && (
              <div
                className="more"
                onClick={() => setShowAllNews(!showAllNews)}
              >
                <p>{showAllNews ? "Menos" : "Mais"}</p>
                <FontAwesomeIcon
                  icon={faAngleDown}
                  style={{
                    color: "black",
                    marginTop: "4px",
                    fontSize: "14px",
                    marginLeft: "3px",
                    transform: showAllNews ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.3s ease",
                  }}
                />
              </div>
            )}
          </>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>Nenhuma notícia encontrada</h3>
            <p>Novas notícias serão publicadas em breve. Fique atento!</p>
          </div>
        )}
      </section>

      {/* Slider Descubra Section */}
      <section className="h-slider">
        <div className="top">
          <Link to="/search">
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
        {discoverNews.length > 0 ? (
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
              {discoverNews.map((news) => (
                <SwiperSlide
                  key={news.id}
                  style={{ width: 820 }}
                  className="swiper-slide"
                  onClick={() => navigate(`/news/${news.id}`)}
                >
                  <img
                    className="slide-item"
                    src={news.imageURL}
                    alt={news.title}
                  />
                  <div className="slide-info">
                    <h3>{news.title}</h3>
                    <span>{news.category}</span>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h3>Nada para descobrir ainda</h3>
            <p>Explore novas notícias assim que forem publicadas!</p>
          </div>
        )}
      </section>

      {/* Colaborador Section */}
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

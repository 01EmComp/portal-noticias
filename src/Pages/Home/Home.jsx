import "./Home.css";

const Home = () => {
  return (
    <div className="h-container">
      <section className="h-social">
        <div className="top">
          <h2>Siga-nos</h2>
          <p>Mais ></p>
        </div>
        <div className="bottom">
          <div className="social-story"></div>
          <div className="social-story"></div>
          <div className="social-story"></div>
          <div className="social-story"></div>
          <div className="social-story"></div>
        </div>
      </section>
      <section className="h-main-new"></section>
      <section className="h-news"></section>
      <section className="h-slider"></section>
      <section className="h-colaborator"></section>
    </div>
  );
};

export default Home;

import { Link } from "react-router-dom";

// Images
import img from "/src/Assets/Images/blog-image.png";

// Components
import CommentsItem from "./CommentsItem";

// Css
import "./Blog.css";

function Blog() {
  return (
    <div className="blog-container">
      <header className="blog-header">
        <h2>Blog de Cristina</h2>
        <div className="buttons">
          <Link to="/">
            <div className="link-button">Posts</div>
          </Link>
          <button className="follow-button">Seguir</button>
        </div>
      </header>
      <section className="blog-body">
        <div className="title">
          <h3>Cristina em Paris</h3>
          <div className="date">
            <p>Junho</p>
            <span>29,</span>
            <p>2025</p>
          </div>
        </div>
        <div className="image">
          <img src={img} alt="Thumb do Blog" />
        </div>
        <div className="blog-text">
          <p>
            Viagem incrivel com muitos lugares bonitos e comidas deliciosas, me
            senti encantada com o ambiente, quero me mudar pra lá rsrsrs
          </p>
        </div>
      </section>
      <section className="blog-comments">
        <h3>Comentários</h3>
        <div className="comments-list">
          <CommentsItem />
        </div>
      </section>
    </div>
  );
}

export default Blog;

// Images
import img from "/src/Assets/Images/profile-default.png";

function Blog() {
  return (
    <div className="comments-item">
      <div className="left-side">
        <img src={img} alt="Foto de perfil" />
      </div>
      <div className="right-side">
        <div className="user-name">Alice Barros</div>
        <div className="text">
          Lindas as fotos que tirou, a experiência parece ser incrivel!
        </div>
      </div>
    </div>
  );
}

export default Blog;

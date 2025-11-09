// React Router DOM
import { Routes, Route } from "react-router-dom";

// Pages
import Home from "./Pages/Home/Home";
import Login from "./Pages/Login/Login";
import Register from "./Pages/Register/Register";
import Profile from "./Pages/Profile/Profile";
import Contact from "./Pages/Contact/Contact";
import Author from "./Pages/Author/Author";
import About from "./Pages/About/About";
import News from "./Pages/News/News";
import AdmPainel from "./Pages/Admin/AdmPainel";
import NotFound from "./Pages/NotFound/NotFound";
import Reporter from "./Pages/Reporter/Reporter";
const AppRoutes = () => {
  return (
    <Routes>
      {/* Principal Route */}
      <Route path="/" element={<Home />} />

      {/* Login / Register / Profile */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile" element={<Profile />} />

      {/* Contact-us */}
      <Route path="/contact" element={<Contact />} />

      {/* Author */}
      <Route path="/author-page" element={<Author />} />

      {/* Reporter */}
      <Route path="/reporter-page" element={<Reporter />} />

      {/* About Us */}
      <Route path="/about" element={<About />} />

      {/* News */}
      <Route path="/news" element={<News />} />

      {/* Admin Page */}
      <Route path="/admin-painel" element={<AdmPainel />} />

      {/* Rota fallback para páginas inexistentes */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;

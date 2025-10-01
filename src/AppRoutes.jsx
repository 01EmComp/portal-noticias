// React Router DOM
import { Routes, Route } from "react-router-dom";

// Pages
import Home from "./Pages/Home/Home";
import Login from "./Pages/Login/Login";
import Register from "./Pages/Register/Register";
import Profile from "./Pages/Profile/Profile";
import Contact from "./Pages/Contact/Contact";
import Author from "./Pages/Author/Author";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Rota principal */}
      <Route path="/" element={<Home />} />

      {/* Login / Register / Profile */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile" element={<Profile />} />

      {/* Contate-nos */}
      <Route path="/contact" element={<Contact />} />

      {/* Autor */}
      <Route path="/author-page" element={<Author />} />

      {/* Rota fallback para páginas inexistentes */}
      <Route path="*" element={<h1>404 - Página não encontrada</h1>} />
    </Routes>
  );
};

export default AppRoutes;

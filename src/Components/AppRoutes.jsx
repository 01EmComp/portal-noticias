// React Router DOM
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import Home from "../Pages/Home/Home";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota principal */}
        <Route path="/" element={<Home />} />

        {/* Rota fallback para páginas inexistentes */}
        <Route path="*" element={<h1>404 - Página não encontrada</h1>} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;

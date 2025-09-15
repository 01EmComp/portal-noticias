import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TelaLogin from "./screens/TelaLogin";
import TelaCadastro from "./screens/TelaCadastro";
import TelaNoticia from "./screens/TelaNoticia";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TelaLogin />} />
        <Route path="/cadastro" element={<TelaCadastro />} />
        <Route path="/noticia" element={<TelaNoticia />} />
      </Routes>
    </Router>
  );
}

export default App;
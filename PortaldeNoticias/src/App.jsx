import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TelaLogin from "./screens/TelaLogin";
import TelaCadastro from "./screens/TelaCadastro";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TelaLogin />} />
        <Route path="/cadastro" element={<TelaCadastro />} />
      </Routes>
    </Router>
  );
}

export default App;
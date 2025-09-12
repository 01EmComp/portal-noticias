import { useState } from "react";
import { Link } from "react-router-dom";

import InputText from "/src/Components/InputText/index.jsx";
import Button from "/src/Components/Button/index.jsx";
import Checkbox from "/src/Components/Checkbox/index.jsx";

import "./Login.css";

function LoginScreen() {
  const [formData, setFormData] = useState({
    email: "",
    senha: "",
    lembrar: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <div className="login-screen">
        <div className="login-container">
          <h2>Entrar</h2>
          <InputText
            label="E-mail"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Digite seu e-mail"
          />
          <InputText
            label="Senha"
            name="senha"
            type="password"
            value={formData.senha}
            onChange={handleChange}
            placeholder="Digite sua senha"
          />

          <Checkbox
            label="Lembre-me"
            checked={formData.lembrar}
            onChange={() =>
              setFormData((prev) => ({ ...prev, lembrar: !prev.lembrar }))
            }
          />

          <Button
            text="Entrar"
            onClick={() => {}}
            style={{ marginTop: "5px", width: "100%", height: "58px" }}
          />

          <p>
            <Link to="/register">Cadastrar</Link> | Esqueceu a senha?
          </p>
        </div>
      </div>
    </>
  );
}

export default LoginScreen;

import React, { useState } from "react";
import { Link } from "react-router-dom";

import InputText from "/home/serafim/SiteNoticiasEmcomp/portal-noticias/PortaldeNoticias/src/componentes/InputText/index.jsx";
import Button from "/home/serafim/SiteNoticiasEmcomp/portal-noticias/PortaldeNoticias/src/componentes/Button/index.jsx";
import Checkbox from "/home/serafim/SiteNoticiasEmcomp/portal-noticias/PortaldeNoticias/src/componentes/Checkbox/index.jsx";
import Header from "/home/serafim/SiteNoticiasEmcomp/portal-noticias/PortaldeNoticias/src/componentes/Header/index.jsx";

import "./style.css";

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
      <Header />
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
            <Link to="/cadastro">Cadastrar</Link> | Esqueceu a senha?
          </p>
        </div>
      </div>
    </>
  );
}

export default LoginScreen;

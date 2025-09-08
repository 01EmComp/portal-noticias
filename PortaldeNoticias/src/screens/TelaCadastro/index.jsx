import React, { useState } from "react";
import { Link } from "react-router-dom";

import InputText from "/home/serafim/SiteNoticiasEmcomp/portal-noticias/PortaldeNoticias/src/componentes/InputText/index.jsx";
import Button from "/home/serafim/SiteNoticiasEmcomp/portal-noticias/PortaldeNoticias/src/componentes/Button/index.jsx";
import Checkbox from "/home/serafim/SiteNoticiasEmcomp/portal-noticias/PortaldeNoticias/src/componentes/Checkbox/index.jsx";
import Header from "/home/serafim/SiteNoticiasEmcomp/portal-noticias/PortaldeNoticias/src/componentes/Header/index.jsx";

import "./style.css";

function LoginScreen() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    confsenha: "",
    telefone: "",
    aceitar: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <Header />
      <div className="cadastro-screen">

        <div className="cadastro-container">
          <h2>Crie sua conta</h2>
          <InputText
            label="Nome"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            placeholder="Digite seu nome"
          />
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
          <InputText
            label="Confirmar senha"
            name="confsenha"
            type="password"
            value={formData.confsenha}
            onChange={handleChange}
            placeholder="Repita a senha"
          />
          <InputText
            label="Telefone(Opcional)"
            name="telefone"
            type="text"
            value={formData.telefone}
            onChange={handleChange}
            placeholder="(99) 99999-9999"
          />
          <Checkbox
            label="Aceito os termos de uso"
            checked={formData.lembrar}
            onChange={() =>
              setFormData((prev) => ({ ...prev, lembrar: !prev.lembrar }))
            }
          />

          <Button
            text="Criar conta"
            onClick={() => {}}
            style={{ marginTop: "5px", width: "100%", height: "58px" }}
          />

          <p>
            Já tem conta? | <Link to="/"> Entre</Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default LoginScreen;

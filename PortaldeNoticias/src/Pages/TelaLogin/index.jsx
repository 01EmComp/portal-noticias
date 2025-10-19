import React, { useState } from "react";
import {Link, useNavigate } from "react-router-dom";

import InputText from "../../Components/InputText";
import Button from "../../Components/Button";
import Checkbox from "../../Components/Checkbox";
import Header from "../../Components/Header";

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

  const navigate = useNavigate();

  const abrirNoticia = async () => {
    try {
      const response = await fetch("/textos/noticia.txt");
      const texto = await response.text();

      navigate("/noticia", {
        state: {
          titulo: "Lançamento do novo produto",
          autor: "Equipe de Marketing",
          data: "14/09/2025",
          hora: "22:30",
          imagem: "",
          texto: texto
        }
      });
    } catch (error) {
      console.error("Erro ao carregar o texto:", error);
    }
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
            onClick={abrirNoticia}
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

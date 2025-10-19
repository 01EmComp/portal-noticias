import React, { useState } from "react";

import InputText from "../../Components/InputText";
import Button from "../../Components/Button";
import Checkbox from "../../Components/Checkbox";
import Header from "../../Components/Header";

import "./style.css";

function TelaEditar() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");

  return (
    <>
      <Header />
      <div className="cadastro-screen">

        <div className="cadastro-container">
          <h2>Editar dados</h2>
          <InputText
            label="Nome"
            name="nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Digite seu nome"
          />
          <InputText
            label="E-mail"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Digite seu e-mail"
          />
          <InputText
            label="Telefone(Opcional)"
            name="telefone"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            placeholder="(99) 99999-9999"
          />
          <Button
            text="Salvar alterações"
            onClick={() => {}}
            style={{  }}
          />
        </div>
      </div>
    </>
  );
}

export default TelaEditar;

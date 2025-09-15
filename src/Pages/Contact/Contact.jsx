import { useState } from "react";

import InputText from "/src/Components/InputText/index.jsx";
import Button from "/src/Components/Button/index.jsx";
import { useCaptcha } from "/src/Context/Captcha/CaptchaContext.jsx";

import "./Contact.css";

function Contact() {
  const [formData, setFormData] = useState({
    nome: "",
    sobrenome: "",
    email: "",
    telefone: "",
    assunto: "",
  });

  const [feedback, setFeedback] = useState(null);
 const { token, resetCaptcha, CaptchaWidget } = useCaptcha();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.nome || !formData.email || !formData.assunto) {
      setFeedback({ type: "error", message: "Preencha os campos obrigatórios!" });
      return;
    }

    if (!token) {
      setFeedback({ type: "error", message: "Por favor, complete o CAPTCHA!" });
      return;
    }

    setFeedback({ type: "success", message: "Mensagem enviada com sucesso!" });

    setFormData({
      nome: "",
      sobrenome: "",
      email: "",
      telefone: "",
      assunto: "",
    });

    resetCaptcha();
  };

  return (
    <div className="contact-screen">
      <div className="contact-container">
        <h2>Contate-nos</h2>

        <form onSubmit={handleSubmit} className="contact-form">
          <InputText
            label="Nome"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            placeholder="Por favor, insira seu nome..."
          />

          <InputText
            label="Sobrenome"
            name="sobrenome"
            value={formData.sobrenome}
            onChange={handleChange}
            placeholder="Por favor, insira seu sobrenome..."
          />

          <InputText
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Por favor, insira seu email..."
          />

          <InputText
            label="Número de Telefone"
            name="telefone"
            type="tel"
            value={formData.telefone}
            onChange={handleChange}
            placeholder="Por favor, insira seu número..."
          />

          <div className="textarea-group">
            <label htmlFor="assunto">Assunto</label>
            <textarea
              id="assunto"
              name="assunto"
              value={formData.assunto}
              onChange={handleChange}
              placeholder="Por favor, insira o assunto a ser tratado..."
            />
          </div>

          <div className="captcha-container">
            <CaptchaWidget />
          </div>

          <Button
            text="Enviar"
            type="submit"
            style={{ marginTop: "15px", width: "100%", height: "58px" }}
          />
        </form>

        {feedback && (
          <p className={`feedback ${feedback.type}`}>
            {feedback.message}
          </p>
        )}
      </div>
    </div>
  );
}

export default Contact;
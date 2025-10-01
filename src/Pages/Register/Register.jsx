import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// Social Login Button's
import { FacebookLoginButton } from "react-social-login-buttons";
import { GoogleLoginButton } from "react-social-login-buttons";

// Auth
import { register, sendVerificationEmail } from "/src/Services/auth";
import { loginWithGoogle, loginWithFacebook } from "/src/Services/auth";

// Components
import InputText from "/src/Components/InputText/index.jsx";
import Button from "/src/Components/Button/index.jsx";
import Checkbox from "/src/Components/Checkbox/index.jsx";

// Contexts
import { useCaptcha } from "/src/Context/Captcha/CaptchaContext.jsx";

// Css
import "./Register.css";

function RegisterScreen() {
  const [errorMsg, setErrorMsg] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confpassword: "",
    phone: "",
    accept: false,
  });

  const navigate = useNavigate();
  const { token, resetCaptcha, CaptchaWidget } = useCaptcha();

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    // Valida campos obrigatórios
    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confpassword
    ) {
      setErrorMsg("Preencha todos os campos obrigatórios!");
      return;
    }

    if (!formData.accept) {
      setErrorMsg("Você deve aceitar os termos de uso.");
      return;
    }

    // Verifica se senhas coincidem
    if (formData.password !== formData.confpassword) {
      setErrorMsg("As senhas não coincidem.");
      return;
    }

    if (!token) {
      setErrorMsg("Por favor, complete o CAPTCHA!");
      return;
    }

    try {
      const user = await register(
        formData.name,
        formData.email,
        formData.phone,
        formData.password
      );
      sendVerificationEmail(user);
      resetCaptcha();
      navigate("/");
    } catch (err) {
      let msg = "";
      switch (err.code) {
        case "auth/email-already-in-use":
          msg = "Email já cadastrado.";
          break;
        case "auth/invalid-email":
          msg = "Email inválido. Verifique e tente novamente.";
          break;
        case "auth/weak-password":
          msg = "Senha muito fraca. Use ao menos 6 caracteres.";
          break;
        default:
          msg = "Ocorreu um erro. Tente novamente mais tarde.";
      }
      setErrorMsg(msg);
      resetCaptcha();
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      // Redireciona após login
      navigate("/profile");
    } catch (err) {
      setErrorMsg(err);
    }
  };

  const handleFacebookLogin = async () => {
    try {
      await loginWithFacebook();
      // Redireciona após login
      navigate("/profile");
    } catch (err) {
      setErrorMsg(err);
    }
  };

  return (
    <div className="cadastro-screen">
      <div className="cadastro-container">
        <h2>Crie sua conta</h2>
        <form onSubmit={handleRegister} className="register-form">
          <InputText
            label="Nome"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Digite seu nome"
          />
          <InputText
            label="E-mail"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Digite seu e-mail"
          />
          <InputText
            label="Senha"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Digite sua senha"
          />
          <InputText
            label="Confirmar senha"
            name="confpassword"
            type="password"
            value={formData.confpassword}
            onChange={handleChange}
            placeholder="Repita a senha"
          />
          <InputText
            label="Telefone (Opcional)"
            name="phone"
            type="text"
            value={formData.phone}
            onChange={handleChange}
            placeholder="(99) 99999-9999"
          />
          <Checkbox
            label="Aceitar os termos de uso"
            name="acept"
            checked={formData.acept}
            onChange={handleChange}
          />

          <div className="captcha-container">
            <CaptchaWidget />
          </div>

          <div className="login-with-socials">
            <GoogleLoginButton onClick={handleGoogleLogin}>
              <span>Registrar com o Google</span>
            </GoogleLoginButton>
            <FacebookLoginButton onClick={handleFacebookLogin}>
              <span>Registrar com o Facebook</span>
            </FacebookLoginButton>
          </div>

          <Button
            text="Criar conta"
            type="submit"
            style={{ marginTop: "5px", width: "100%", height: "58px" }}
          />
        </form>

        <p>
          Já tem conta? | <Link to="/login">Entre</Link>
        </p>

        {errorMsg && (
          <p style={{ color: "red", marginTop: "10px" }}>{errorMsg}</p>
        )}
      </div>
    </div>
  );
}

export default RegisterScreen;

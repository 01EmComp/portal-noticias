import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FacebookLoginButton } from "react-social-login-buttons";
import { GoogleLoginButton } from "react-social-login-buttons";
import { register, sendVerificationEmail } from "/src/Services/auth";
import { loginWithGoogle, loginWithFacebook } from "/src/Services/auth";
import InputText from "/src/Components/InputText/index.jsx";
import Button from "/src/Components/Button/index.jsx";
import Checkbox from "/src/Components/Checkbox/index.jsx";
import { useCaptcha } from "/src/Context/Captcha/CaptchaContext.jsx";
import "./Register.css";

function RegisterScreen() {
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isStrongPassword = (password) => {
    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return strongRegex.test(password);
  };

  const sanitizeInput = (input) => {
    return input.trim().replace(/[<>]/g, "");
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (isLoading) return;

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

    if (!isValidEmail(formData.email)) {
      setErrorMsg("Por favor, insira um email válido.");
      return;
    }

    if (!isStrongPassword(formData.password)) {
      setErrorMsg(
        "A senha deve ter no mínimo 8 caracteres, incluindo letras maiúsculas, minúsculas e números."
      );
      return;
    }

    if (formData.password !== formData.confpassword) {
      setErrorMsg("As senhas não coincidem.");
      return;
    }

    if (formData.name.trim().length < 2) {
      setErrorMsg("O nome deve ter pelo menos 2 caracteres.");
      return;
    }

    if (!token) {
      setErrorMsg("Por favor, complete o CAPTCHA!");
      return;
    }

    setIsLoading(true);

    try {
      const sanitizedData = {
        name: sanitizeInput(formData.name),
        email: sanitizeInput(formData.email.toLowerCase()),
        phone: sanitizeInput(formData.phone),
        password: formData.password,
        role: "leitor",
        provider: "email",
      };

      await register(
        sanitizedData.name,
        sanitizedData.email,
        sanitizedData.phone,
        sanitizedData.password,
        sanitizedData.role,
        sanitizedData.provider
      );

      resetCaptcha();
      setSuccessMsg("Se você for um novo usuário, receberá um email de confirmação em breve.");
      
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      setSuccessMsg("Se você for um novo usuário, receberá um email de confirmação em breve.");
      resetCaptcha();
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    
    if (errorMsg) setErrorMsg("");
    if (successMsg) setSuccessMsg("");
  };

  const handleGoogleLogin = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      await loginWithGoogle();
      navigate("/profile");
    } catch (err) {
      const msg = err.message || "Erro ao fazer login com Google. Tente novamente.";
      setErrorMsg(msg);
      console.error("Erro no login do Google:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFacebookLogin = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      await loginWithFacebook();
      navigate("/profile");
    } catch (err) {
      const msg = err.message || "Erro ao fazer login com Facebook. Tente novamente.";
      setErrorMsg(msg);
      console.error("Erro no login do Facebook:", err);
    } finally {
      setIsLoading(false);
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
            placeholder="Digite seu nome completo"
            disabled={isLoading}
            maxLength={100}
          />
          <InputText
            label="E-mail"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Digite seu e-mail"
            disabled={isLoading}
            maxLength={100}
            autoComplete="email"
          />
          <InputText
            label="Senha"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Mínimo 8 caracteres"
            disabled={isLoading}
            autoComplete="new-password"
          />
          <InputText
            label="Confirmar senha"
            name="confpassword"
            type="password"
            value={formData.confpassword}
            onChange={handleChange}
            placeholder="Repita a senha"
            disabled={isLoading}
            autoComplete="new-password"
          />
          <InputText
            label="Telefone (Opcional)"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="(99) 99999-9999"
            disabled={isLoading}
            maxLength={15}
          />
          <Checkbox
            label="Aceitar os termos de uso"
            name="accept"
            checked={formData.accept}
            onChange={handleChange}
            disabled={isLoading}
          />

          <div className="captcha-container">
            <CaptchaWidget />
          </div>

          <Button
            text={isLoading ? "Criando conta..." : "Criar conta"}
            type="submit"
            disabled={isLoading}
            style={{ marginTop: "5px", width: "100%", height: "58px" }}
          />

          <div className="divider" style={{ margin: "20px 0", textAlign: "center" }}>
            <span style={{ color: "#666" }}>ou registre-se com</span>
          </div>

          <div className="login-with-socials">
            <GoogleLoginButton 
              onClick={handleGoogleLogin}
              disabled={isLoading}
            >
              <span>Registrar com o Google</span>
            </GoogleLoginButton>
            <FacebookLoginButton 
              onClick={handleFacebookLogin}
              disabled={isLoading}
            >
              <span>Registrar com o Facebook</span>
            </FacebookLoginButton>
          </div>
        </form>

        {errorMsg && (
          <p style={{ color: "red", marginTop: "10px", textAlign: "center" }}>
            {errorMsg}
          </p>
        )}

        {successMsg && (
          <p style={{ color: "green", marginTop: "10px", textAlign: "center" }}>
            {successMsg}
          </p>
        )}

        <p style={{ marginTop: "20px", textAlign: "center" }}>
          Já tem conta? <Link to="/login">Entre aqui</Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterScreen;
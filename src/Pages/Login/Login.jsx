import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// Auth
import { login } from "/src/Services/auth";
// import { loginWithGoogle, loginWithFacebook } from "/src/Services/auth";

// Components
import InputText from "/src/Components/InputText/index.jsx";
import Button from "/src/Components/Button/index.jsx";
import Checkbox from "/src/Components/Checkbox/index.jsx";

// Contexts
import { useCaptcha } from "/src/Context/Captcha/CaptchaContext.jsx";

// Css
import "./Login.css";

function LoginScreen() {
  const [errorMsg, setErrorMsg] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const navigate = useNavigate();
  const { token, resetCaptcha, CaptchaWidget } = useCaptcha();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg(""); // limpa erros anteriores

    if (!formData.email || !formData.password) {
      setErrorMsg("Preencha todos os campos!");
      return;
    }

    if (!token) {
      setErrorMsg("Por favor, complete o CAPTCHA!");
      return;
    }

    try {
      await login(formData.email, formData.password);
      resetCaptcha();
      navigate("/profile");
    } catch (err) {
      let msg = "";
      switch (err.code) {
        case "auth/invalid-credential":
          msg = "Email ou senha incorreto(s)";
          break;
        case "auth/wrong-password":
          msg = "Senha incorreta. Tente novamente.";
          break;
        case "auth/invalid-email":
          msg = "Email inválido. Verifique e tente novamente.";
          break;
        case "auth/user-disabled":
          msg = "Esta conta foi desativada.";
          break;
        default:
          msg = "Ocorreu um erro. Tente novamente mais tarde.";
      }
      setErrorMsg(msg);
      resetCaptcha();
    }
  };

  return (
    <div className="login-screen">
      <div className="login-container">
        <h2>Entrar</h2>

        <form onSubmit={handleLogin} className="login-form">
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

          <Checkbox
            label="Lembre-me"
            name="remember"
            checked={formData.remember}
            onChange={handleChange}
          />

          <div className="captcha-container">
            <CaptchaWidget />
          </div>

          <Button
            text="Entrar"
            type="submit"
            style={{ marginTop: "5px", width: "100%", height: "58px" }}
          />
        </form>

        <p>
          <Link to="/register">Cadastrar</Link> | Esqueceu a senha?
        </p>

        {errorMsg && (
          <p style={{ color: "red", marginTop: "10px" }}>{errorMsg}</p>
        )}
      </div>
    </div>
  );
}

export default LoginScreen;
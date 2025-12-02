import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// Social Login Button's
import { FacebookLoginButton } from "react-social-login-buttons";
import { GoogleLoginButton } from "react-social-login-buttons";

// Auth
import { login } from "/src/Services/auth";
import { loginWithGoogle, loginWithFacebook } from "/src/Services/auth";

// Components
import InputText from "/src/Components/InputText/index.jsx";
import Button from "/src/Components/Button/index.jsx";
import Checkbox from "/src/Components/Checkbox/index.jsx";

// Contexts
import { useCaptcha } from "/src/Pages/Context/Captcha/CaptchaContext.jsx";

// Css
import "./Login.css";

function LoginScreen() {
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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

    if (errorMsg) setErrorMsg("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (isLoading) return;

    if (!formData.email || !formData.password) {
      setErrorMsg("Preencha todos os campos!");
      return;
    }

    if (!token) {
      setErrorMsg("Por favor, complete o CAPTCHA!");
      return;
    }

    setIsLoading(true);

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
          msg = err.message || "Ocorreu um erro. Tente novamente mais tarde.";
      }
      setErrorMsg(msg);
      resetCaptcha();
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (isLoading) return;

    setIsLoading(true);
    setErrorMsg("");

    try {
      await loginWithGoogle();

      navigate("/profile");
    } catch (err) {
      const msg =
        err.message || "Erro ao fazer login com Google. Tente novamente.";
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

    try {
      await loginWithFacebook();

      navigate("/profile");
    } catch (err) {
      const msg =
        err.message || "Erro ao fazer login com Facebook. Tente novamente.";
      setErrorMsg(msg);
      console.error("Erro no login do Facebook:", err);
    } finally {
      setIsLoading(false);
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
            disabled={isLoading}
            autoComplete="email"
          />
          <InputText
            label="Senha"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Digite sua senha"
            disabled={isLoading}
            autoComplete="current-password"
          />

          <Checkbox
            label="Lembre-me"
            name="remember"
            checked={formData.remember}
            onChange={handleChange}
            disabled={isLoading}
          />

          <div className="captcha-container">
            <CaptchaWidget />
          </div>

          <Button
            text={isLoading ? "Entrando..." : "Entrar"}
            type="submit"
            disabled={isLoading}
            style={{ marginTop: "5px", width: "100%", height: "58px" }}
          />

          <div
            className="divider"
            style={{ margin: "20px 0", textAlign: "center" }}
          >
            <span style={{ color: "#666" }}>ou entre com</span>
          </div>

          <div className="login-with-socials">
            <GoogleLoginButton onClick={handleGoogleLogin} disabled={isLoading}>
              <span>Fazer login com o Google</span>
            </GoogleLoginButton>
            <FacebookLoginButton
              onClick={handleFacebookLogin}
              disabled={isLoading}
            >
              <span>Fazer login com o Facebook</span>
            </FacebookLoginButton>
          </div>
        </form>

        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <Link to="/register">Cadastrar</Link> |{" "}
          <Link to="/reset-password">Esqueceu a senha?</Link>
        </div>

        {errorMsg && (
          <p style={{ color: "red", marginTop: "10px", textAlign: "center" }}>
            {errorMsg}
          </p>
        )}
      </div>
    </div>
  );
}

export default LoginScreen;

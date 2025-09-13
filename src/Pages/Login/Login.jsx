import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// Auth
import { login } from "/src/Services/auth";
// import { loginWithGoogle, loginWithFacebook } from "/src/Services/auth";

// Components
import InputText from "/src/Components/InputText/index.jsx";
import Button from "/src/Components/Button/index.jsx";
import Checkbox from "/src/Components/Checkbox/index.jsx";

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

  // Login methods

  // const handleGoogleLogin = async () => {
  //   try {
  //     await loginWithGoogle();
  //     // Redireciona após login
  //   } catch (err) {
  //     setErrorMsg(err);
  //   }
  // };

  // const handleFacebookLogin = async () => {
  //   try {
  //     await loginWithFacebook();
  //     // Redireciona após login
  //   } catch (err) {
  //     setErrorMsg(err);
  //   }
  // };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg(""); // limpa erros anteriores

    try {
      await login(formData.email, formData.password);
      // Redireciona após login
      navigate("/");
    } catch (err) {
      // console.log(err);       --> Mostra erro no console
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
      setErrorMsg(msg); // exibe na tela
    }
  };

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
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Digite sua senha"
          />

          <Checkbox
            label="Lembre-me"
            checked={formData.remember}
            onChange={() =>
              setFormData((prev) => ({ ...prev, remember: !prev.remember }))
            }
          />

          <Button
            text="Entrar"
            onClick={handleLogin}
            style={{ marginTop: "5px", width: "100%", height: "58px" }}
          />

          <p>
            <Link to="/register">Cadastrar</Link> | Esqueceu a senha?
          </p>

          {errorMsg && (
            <p style={{ color: "red", marginTop: "10px" }}>{errorMsg}</p>
          )}
        </div>
      </div>
    </>
  );
}

export default LoginScreen;

import { useState, useEffect } from "react";

// Router dom
import { Link, useNavigate } from "react-router-dom";

// Font Awesome Icon's
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";

// Firebase
import { auth } from "/src/Services/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "/src/Services/firebaseConfig";

// Components
import Switch from "./Button/Switch";

// Css
import "./WriterConfigs.css";

const WriterConfigs = ({ onBack }) => {
  const [settings, setSettings] = useState({
    autoSave: false,
    automaticSubscription: false,
  });
  const [user, setUser] = useState(null);
  const [socialBar, setSocialBar] = useState(false);
  const userId = auth.currentUser.uid;
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) return;

    const fetchSettings = async () => {
      const userRef = doc(db, "users", userId);
      const snap = await getDoc(userRef);

      if (snap.exists()) {
        const data = snap.data();

        // Se existir o campo writer-settings, sincroniza:
        if (data["writer-settings"]) {
          setSettings((prev) => ({
            ...prev,
            ...data["writer-settings"],
          }));
        }
      }
    };

    fetchSettings();
  }, [userId]);

  // Verificar autenticação
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        navigate("/profile");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleToggle = async (settingName) => {
    try {
      const newValue = !settings[settingName];
      const userRef = doc(db, "users", userId);

      await setDoc(
        userRef,
        {
          "writer-settings": {
            [settingName]: newValue,
          },
        },
        { merge: true }
      );

      setSettings((prev) => ({
        ...prev,
        [settingName]: newValue,
      }));
    } catch (error) {
      console.error("Erro ao salvar configuração:", error);
    }
  };

  const toogleSocialBar = () => {
    setSocialBar(!socialBar);
  };

  return (
    <div className="writer-configs">
      <div className="header">
        <button className="back-button" onClick={onBack}>
          <FontAwesomeIcon icon={faChevronLeft} />
          Voltar
        </button>

        <h1>Configurações</h1>
      </div>
      <div className="main-box">
        <section className="accessibility">
          <p>Acessibilidade</p>
          <div>
            <Link to="/profile">Abrir configurações</Link> →
          </div>
        </section>
        <section className="profile">
          <p>Perfil</p>
          <div>
            <Link to="/profile">Editar perfil</Link> →
          </div>
        </section>
        <section className="preferences">
          <p>Preferências de Criador</p>
          <div className="preferences-items">
            <ul>
              <li>
                <div className="left">
                  <p>Auto save</p>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    version="1.1"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    width="512"
                    height="512"
                    x="0"
                    y="0"
                    viewBox="0 0 24 24"
                    style={{ enableBackground: "new 0 0 512 512" }}
                    xmlSpace="preserve"
                    className="info-button"
                  >
                    <g>
                      <path
                        d="M12 22.75A10.75 10.75 0 1 1 22.75 12 10.762 10.762 0 0 1 12 22.75zm0-20A9.25 9.25 0 1 0 21.25 12 9.26 9.26 0 0 0 12 2.75zm.75 13.75v-4.571a.75.75 0 0 0-1.5 0V16.5a.75.75 0 0 0 1.5 0zm.27-8a1 1 0 0 0-1-1h-.01a1 1 0 1 0 1.01 1z"
                        fill="#000000"
                        opacity="0.6392156862745098"
                        data-original="#000000"
                      ></path>
                    </g>
                  </svg>
                </div>
                <div className="right">
                  <Switch
                    id="toggler-1"
                    checked={settings.autoSave}
                    onChange={() => handleToggle("autoSave")}
                  />
                </div>
              </li>
              <li>
                <div className="left">
                  <p>Assinatura automática</p>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    version="1.1"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    width="512"
                    height="512"
                    x="0"
                    y="0"
                    viewBox="0 0 24 24"
                    style={{ enableBackground: "new 0 0 512 512" }}
                    xmlSpace="preserve"
                    className="info-button"
                  >
                    <g>
                      <path
                        d="M12 22.75A10.75 10.75 0 1 1 22.75 12 10.762 10.762 0 0 1 12 22.75zm0-20A9.25 9.25 0 1 0 21.25 12 9.26 9.26 0 0 0 12 2.75zm.75 13.75v-4.571a.75.75 0 0 0-1.5 0V16.5a.75.75 0 0 0 1.5 0zm.27-8a1 1 0 0 0-1-1h-.01a1 1 0 1 0 1.01 1z"
                        fill="#000000"
                        opacity="0.6392156862745098"
                        data-original="#000000"
                      ></path>
                    </g>
                  </svg>
                </div>
                <div className="right">
                  <Switch
                    id="toggler-2"
                    checked={settings.automaticSubscription}
                    onChange={() => handleToggle("automaticSubscription")}
                  />
                </div>
              </li>
            </ul>
          </div>
        </section>
        <section className="appearance">
          <p>Aparência do Perfil</p>
          <div className="option">
            <div className="left">
              <p>Adicionar Redes Sociais</p>
            </div>
            <div className="right">
              <button onClick={() => toogleSocialBar()}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  version="1.1"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  width="512"
                  height="512"
                  x="0"
                  y="0"
                  viewBox="0 0 24 24"
                  style={{
                    enableBackground: "new 0 0 512 512",
                  }}
                  xmlSpace="preserve"
                  className="add-button"
                >
                  <g>
                    <path
                      d="M18 2c2.206 0 4 1.794 4 4v12c0 2.206-1.794 4-4 4H6c-2.206 0-4-1.794-4-4V6c0-2.206 1.794-4 4-4zm0-2H6a6 6 0 0 0-6 6v12a6 6 0 0 0 6 6h12a6 6 0 0 0 6-6V6a6 6 0 0 0-6-6z"
                      fill="#000000"
                      opacity="1"
                      data-original="#000000"
                    ></path>
                    <path
                      d="M12 18a1 1 0 0 1-1-1V7a1 1 0 0 1 2 0v10a1 1 0 0 1-1 1z"
                      fill="#000000"
                      opacity="1"
                      data-original="#000000"
                    ></path>
                    <path
                      d="M6 12a1 1 0 0 1 1-1h10a1 1 0 0 1 0 2H7a1 1 0 0 1-1-1z"
                      fill="#000000"
                      opacity="1"
                      data-original="#000000"
                    ></path>
                  </g>
                </svg>
              </button>
            </div>
          </div>
        </section>
      </div>
      {/* Não ficou bom, mas a ideia é um pop-up assim */}
      {socialBar && (
        <div className="social-bar-links">
          <ul>
            <li
              style={{
                backgroundColor: "rgba(0, 255, 149, 0.2)",
                border: "1px solid rgba(0, 255, 149, 0.9)",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                version="1.1"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                width="512"
                height="512"
                x="0"
                y="0"
                viewBox="0 0 512 512"
                style={{
                  enableBackground: "new 0 0 512 512",
                  marginBottom: "2px",
                }}
                xmlSpace="preserve"
                fill-rule="evenodd"
                className="icon"
              >
                <g>
                  <path
                    fill="#39ae41"
                    d="M317.12 285.93c-9.69 3.96-15.88 19.13-22.16 26.88-3.22 3.97-7.06 4.59-12.01 2.6-36.37-14.49-64.25-38.76-84.32-72.23-3.4-5.19-2.79-9.29 1.31-14.11 6.06-7.14 13.68-15.25 15.32-24.87 3.64-21.28-24.18-87.29-60.92-57.38C48.62 232.97 330.7 461.46 381.61 337.88c14.4-35.03-48.43-58.53-64.49-51.95zM256 467.28c-37.39 0-74.18-9.94-106.39-28.76-5.17-3.03-11.42-3.83-17.2-2.26l-69.99 19.21 24.38-53.71a22.34 22.34 0 0 0-2.22-22.32C58.5 343.29 44.71 300.61 44.71 256c0-116.51 94.78-211.29 211.29-211.29S467.28 139.49 467.28 256c0 116.5-94.78 211.28-211.28 211.28zM256 0C114.84 0 0 114.84 0 256c0 49.66 14.1 97.35 40.89 138.74L2 480.39a22.37 22.37 0 0 0 3.34 23.76A22.403 22.403 0 0 0 22.36 512c14.42 0 93.05-24.71 113.06-30.2C172.41 501.59 213.9 512 256 512c141.15 0 256-114.85 256-256C512 114.84 397.15 0 256 0z"
                    opacity="1"
                    data-original="#39ae41"
                    className=""
                  ></path>
                </g>
              </svg>
            </li>
            <li
              style={{
                backgroundColor: "rgba(0, 195, 255, 0.2)",
                border: "1px solid rgba(0, 195, 255, 0.9)",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                version="1.1"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                width="512"
                height="512"
                x="0"
                y="0"
                viewBox="0 0 112.196 112.196"
                style={{ enableBackground: "new 0 0 512 512" }}
                xmlSpace="preserve"
                className="icon"
              >
                <g>
                  <circle
                    cx="56.098"
                    cy="56.097"
                    r="56.098"
                    fill="#007ab9"
                    data-original="#007ab9"
                  ></circle>
                  <path
                    d="M89.616 60.611v23.128H76.207V62.161c0-5.418-1.936-9.118-6.791-9.118-3.705 0-5.906 2.491-6.878 4.903-.353.862-.444 2.059-.444 3.268v22.524h-13.41s.18-36.546 0-40.329h13.411v5.715c-.027.045-.065.089-.089.132h.089v-.132c1.782-2.742 4.96-6.662 12.085-6.662 8.822 0 15.436 5.764 15.436 18.149zm-54.96-36.642c-4.587 0-7.588 3.011-7.588 6.967 0 3.872 2.914 6.97 7.412 6.97h.087c4.677 0 7.585-3.098 7.585-6.97-.089-3.956-2.908-6.967-7.496-6.967zm-6.791 59.77H41.27v-40.33H27.865v40.33z"
                    fill="#f1f2f2"
                    data-original="#f1f2f2"
                  ></path>
                </g>
              </svg>
            </li>
            <li
              style={{
                backgroundColor: "rgba(0, 110, 255, 0.2)",
                border: "1px solid rgba(0, 110, 255, 0.9)",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                version="1.1"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                width="512"
                height="512"
                x="0"
                y="0"
                viewBox="0 0 512 512"
                style={{ enableBackground: "new 0 0 512 512" }}
                xmlSpace="preserve"
                className="icon"
              >
                <g>
                  <path
                    fill="#1877f2"
                    d="M512 256c0 127.78-93.62 233.69-216 252.89V330h59.65L367 256h-71v-48.02c0-20.25 9.92-39.98 41.72-39.98H370v-63s-29.3-5-57.31-5c-58.47 0-96.69 35.44-96.69 99.6V256h-65v74h65v178.89C93.62 489.69 0 383.78 0 256 0 114.62 114.62 0 256 0s256 114.62 256 256z"
                    opacity="1"
                    data-original="#1877f2"
                  ></path>
                  <path
                    fill="#ffffff"
                    d="M355.65 330 367 256h-71v-48.021c0-20.245 9.918-39.979 41.719-39.979H370v-63s-29.296-5-57.305-5C254.219 100 216 135.44 216 199.6V256h-65v74h65v178.889c13.034 2.045 26.392 3.111 40 3.111s26.966-1.066 40-3.111V330z"
                    opacity="1"
                    data-original="#ffffff"
                  ></path>
                </g>
              </svg>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default WriterConfigs;

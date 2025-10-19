import Header from "../../Components/Header";
import Button from "../../Components/Button";
import freeIcon from "../../assets/Icons/jornalgratuito.png";
import proIcon from "../../assets/Icons/jornalpro.png";
import premiumIcon from "../../assets/Icons/jornalpremium.png";
import checkedIcon from "../../assets/Icons/checked.png";
import unCheckedIcon from "../../assets/Icons/uncheck.png";
import "./style.css";
function TelaAssinatura() {
  return (
    <>
      <Header />
      <div>
        <div className="conteiner-assinatura">
          <div className="conteiner-card-assinatura">
            <h2>Essencial</h2>
            <img className="title-assinatura-icon" src={freeIcon} />
            <p>Gratuito</p>
            <ul>
              <li>
                <img className="listCheckIcon" src={checkedIcon} alt="" />
                Comentários e comunidade
              </li>
              <li>
                <img className="listCheckIcon" src={checkedIcon} alt="" />
                Transparência e apoio ao jornalismo
              </li>
              <li>
                <img className="listCheckIcon" src={checkedIcon} alt="" />
                Aplicativo e leitura offline
              </li>
              <li>
                <img className="listCheckIcon" src={checkedIcon} alt="" />
                Experiência sem anúncios
              </li>
              <li>
                <img className="listCheckIcon" src={checkedIcon} alt="" />
                Acesso ilimitado a conteúdo
              </li>
              <li>
                <img className="listCheckIcon" src={unCheckedIcon} alt="" />
                Alerta e notificação personalizada
              </li>
              <li>
                <img className="listCheckIcon" src={unCheckedIcon} alt="" />
                Conteúdo multimídia premium
              </li>
              <li>
                <img className="listCheckIcon" src={unCheckedIcon} alt="" />
                Notícias exclusivas e antecipadas
              </li>
              <li>
                <img className="listCheckIcon" src={unCheckedIcon} alt="" />
                Newsletter personalizada
              </li>
            </ul>
            <Button
              className="button-planoatual"
              text="Plano Atual"
              style={{
                width: "100%",
                height: "45px",
                background: "#ffffffff",
                color: "#000000",
                border: "1px solid #000000",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            ></Button>
          </div>
          <div className="conteiner-card-assinatura">
            <h2>Pro</h2>
            <img className="title-assinatura-icon" src={proIcon} />
            <p>R$ 50,00</p>
            <ul>
              <li>
                <img className="listCheckIcon" src={checkedIcon} alt="" />
                Comentários e comunidade
              </li>
              <li>
                <img className="listCheckIcon" src={checkedIcon} alt="" />
                Transparência e apoio ao jornalismo
              </li>
              <li>
                <img className="listCheckIcon" src={checkedIcon} alt="" />
                Aplicativo e leitura offline
              </li>
              <li>
                <img className="listCheckIcon" src={checkedIcon} alt="" />
                Experiência sem anúncios
              </li>
              <li>
                <img className="listCheckIcon" src={checkedIcon} alt="" />
                Acesso ilimitado a conteúdo
              </li>
              <li>
                <img className="listCheckIcon" src={unCheckedIcon} alt="" />
                Alerta e notificação personalizada
              </li>
              <li>
                <img className="listCheckIcon" src={unCheckedIcon} alt="" />
                Conteúdo multimídia premium
              </li>
              <li>
                <img className="listCheckIcon" src={unCheckedIcon} alt="" />
                Notícias exclusivas e antecipadas
              </li>
              <li>
                <img className="listCheckIcon" src={unCheckedIcon} alt="" />
                Newsletter personalizada
              </li>
            </ul>
            <Button
              className="button-planoatual"
              text="Assine agora"
              style={{
                width: "100%",
                height: "45px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            ></Button>
          </div>
          <div className="conteiner-card-assinatura">
            <h2>Premium</h2>
            <img className="title-assinatura-icon" src={premiumIcon} />
            <p>R$ 100,00</p>
            <ul>
              <li>
                <img className="listCheckIcon" src={checkedIcon} alt="" />
                Comentários e comunidade
              </li>
              <li>
                <img className="listCheckIcon" src={checkedIcon} alt="" />
                Transparência e apoio ao jornalismo
              </li>
              <li>
                <img className="listCheckIcon" src={checkedIcon} alt="" />
                Aplicativo e leitura offline
              </li>
              <li>
                <img className="listCheckIcon" src={checkedIcon} alt="" />
                Experiência sem anúncios
              </li>
              <li>
                <img className="listCheckIcon" src={checkedIcon} alt="" />
                Acesso ilimitado a conteúdo
              </li>
              <li>
                <img className="listCheckIcon" src={unCheckedIcon} alt="" />
                Alerta e notificação personalizada
              </li>
              <li>
                <img className="listCheckIcon" src={unCheckedIcon} alt="" />
                Conteúdo multimídia premium
              </li>
              <li>
                <img className="listCheckIcon" src={unCheckedIcon} alt="" />
                Notícias exclusivas e antecipadas
              </li>
              <li>
                <img className="listCheckIcon" src={unCheckedIcon} alt="" />
                Newsletter personalizada
              </li>
            </ul>
            <Button
              className="button-planoatual"
              text="Assine agora"
              style={{
                width: "100%",
                height: "45px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            ></Button>
          </div>
        </div>
      </div>
    </>
  );
}
export default TelaAssinatura;

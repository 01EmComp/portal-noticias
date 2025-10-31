// Components
import Switch from "./Button/Switch";

// Css
import "./Settings.css";

const Settings = () => {
  return (
    <div className="adm-settings-container">
      <div>
        <h3>Desativar site</h3>
        <Switch id={"toggler-1"} />
      </div>
      <div>
        <h3>Ativar modo manutenção</h3>
        <Switch id={"toggler-2"} />
      </div>
    </div>
  );
};

export default Settings;

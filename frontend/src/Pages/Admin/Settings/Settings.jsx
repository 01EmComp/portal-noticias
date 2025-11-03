import { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "/src/Services/firebaseConfig";

// Components
import Switch from "./Button/Switch";

// Css
import "./Settings.css";

const Settings = () => {
  const [settings, setSettings] = useState({
    siteDisabled: false,
    maintenanceMode: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settingsRef = doc(db, "settings", "siteConfig");
        const settingsSnap = await getDoc(settingsRef);

        if (settingsSnap.exists()) {
          
          const data = settingsSnap.data();
          setSettings({
            siteDisabled: data.siteDisabled || false,
            maintenanceMode: data.maintenanceMode || false,
          });

        } else { 

          await setDoc(settingsRef, {
            siteDisabled: false,
            maintenanceMode: false,
          });

        }
      } catch (error) {
        console.error("Erro ao carregar configurações:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleToggle = async (settingName) => {
    try {
      const newValue = !settings[settingName];
      const settingsRef = doc(db, "settings", "siteConfig");

      await setDoc(
        settingsRef,
        {
          [settingName]: newValue,
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

  if (loading) return <div>Carregando...</div>;

  return (
    <div className="adm-settings-container">
      <div>
        <h3>Desativar site</h3>
        <Switch
          id="toggler-1"
          checked={settings.siteDisabled}
          onChange={() => handleToggle("siteDisabled")}
        />
      </div>
      <div>
        <h3>Ativar modo manutenção</h3>
        <Switch
          id="toggler-2"
          checked={settings.maintenanceMode}
          onChange={() => handleToggle("maintenanceMode")}
        />
      </div>
    </div>
  );
};

export default Settings;
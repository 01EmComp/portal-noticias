import { createContext, useContext, useState, useRef } from "react";
import HCaptcha from "@hcaptcha/react-hcaptcha";

const CaptchaContext = createContext();

export const useCaptcha = () => useContext(CaptchaContext);

export const CaptchaProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const captchaRef = useRef(null);

  const resetCaptcha = () => {
    setToken(null);
    captchaRef.current?.resetCaptcha();
  };

  const CaptchaWidget = () => (
    <HCaptcha
      sitekey="a9569d92-92e4-4418-ac36-380831d6476c"
      onVerify={(t) => setToken(t)}
      onExpire={() => setToken(null)}
      ref={captchaRef}
    />
  );

  return (
    <CaptchaContext.Provider value={{ token, resetCaptcha, CaptchaWidget }}>
      {children}
    </CaptchaContext.Provider>
  );
};

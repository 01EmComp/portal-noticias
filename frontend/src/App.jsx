// React
import { useEffect } from "react";
import { registerVisit } from "./Services/analytics";

// React Router DOM
import { BrowserRouter } from "react-router-dom";

// Components
import AppRoutes from "./AppRoutes";
import Header from "./Components/Header/Header";
import Footer from "./Components/Footer/Footer";
import { CaptchaProvider } from "./Context/Captcha/CaptchaContext.jsx";

// Css
import "./App.css";

function App() {
  useEffect(() => {
    if (!localStorage.getItem("visit_counted")) {
      registerVisit();
      localStorage.setItem("visit_counted", "true");
    }
  }, []);

  return (
    <CaptchaProvider>
      <div className="App">
        <BrowserRouter>
          <Header />
          <main>
            <AppRoutes />
          </main>
          <Footer />
        </BrowserRouter>
      </div>
    </CaptchaProvider>
  );
}

export default App;

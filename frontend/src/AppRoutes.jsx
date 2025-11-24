// React Router DOM
import { Routes, Route, useLocation } from "react-router-dom";

import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "/src/Services/firebaseConfig";

// Pages
import Home from "./Pages/Home/Home";
import Login from "./Pages/Login/Login";
import Register from "./Pages/Register/Register";
import Profile from "./Pages/Profile/Profile";
import Contact from "./Pages/Contact/Contact";
import Author from "./Pages/Author/Author";
import About from "./Pages/About/About";
import News from "./Pages/News/News";
import NotFound from "./Pages/NotFound/NotFound";
import AdmPainel from "./Pages/Admin/AdmPainel";
import Writer from "./Pages/Writer/WriterPainel";
import MaintenancePage from "./Pages/MaintenancePage/MaintenancePage";
import Blog from "./Pages/Blog/Blog";
import TermsAndServices from "./Pages/TermsAndServices/TermsAndServices";

const AppRoutes = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname === "/admin-painel";
  const isWriterRoute = location.pathname === "/writer-painel";

  const [siteStatus, setSiteStatus] = useState({
    siteDisabled: false,
    maintenanceMode: false,
    loading: !isAdminRoute, // Não carrega se for rota admin
  });

  useEffect(() => {
    // Se for rota admin, pula a verificação
    if (isAdminRoute) {
      setSiteStatus({
        siteDisabled: false,
        maintenanceMode: false,
        loading: false,
      });
      return;
    }

    // Igualmente para a rota writer
    if (isWriterRoute) {
      setSiteStatus({
        siteDisabled: false,
        maintenanceMode: false,
        loading: false,
      });
      return;
    }

    const checkSiteStatus = async () => {
      try {
        const settingsRef = doc(db, "settings", "siteConfig");
        const settingsSnap = await getDoc(settingsRef);

        if (settingsSnap.exists()) {
          const data = settingsSnap.data();
          setSiteStatus({
            siteDisabled: data.siteDisabled || false,
            maintenanceMode: data.maintenanceMode || false,
            loading: false,
          });
        } else {
          setSiteStatus({
            siteDisabled: false,
            maintenanceMode: false,
            loading: false,
          });
        }
      } catch (error) {
        console.error("Erro ao verificar status do site:", error);
        setSiteStatus({
          siteDisabled: false,
          maintenanceMode: false,
          loading: false,
        });
      }
    };

    checkSiteStatus();
  }, [isAdminRoute, isWriterRoute]);

  if (isAdminRoute) {
    return (
      <Routes>
        <Route path="/admin-painel" element={<AdmPainel />} />
      </Routes>
    );
  }

  if (isWriterRoute) {
    return (
      <Routes>
        <Route path="/writer-painel" element={<Writer />} />
      </Routes>
    );
  }

  if (siteStatus.loading) return null;

  // Se o site estiver desativado
  if (siteStatus.siteDisabled) {
    return <MaintenancePage type="disabled" />;
  }

  if (siteStatus.maintenanceMode) {
    return <MaintenancePage type="maintenance" />;
  }

  return (
    <Routes>
      {/* Principal Route */}
      <Route path="/" element={<Home />} />

      {/* Login / Register / Profile */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile" element={<Profile />} />

      {/* Contact-us */}
      <Route path="/contact" element={<Contact />} />

      {/* Author */}
      <Route path="/author-page" element={<Author />} />

      {/* Blog */}
      <Route path="/blog" element={<Blog />} />

      {/* About Us */}
      <Route path="/about-us" element={<About />} />

      {/* News */}
      <Route path="/news" element={<News />} />

      {/* Terms and Services */}
      <Route path="/terms-and-services" element={<TermsAndServices />} />

      {/* Rota fallback para páginas inexistentes */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;

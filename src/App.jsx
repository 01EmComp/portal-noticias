// React
// import { useState, useEffect } from "react";

// React Router DOM
import { BrowserRouter } from "react-router-dom";

// Components
import AppRoutes from "./AppRoutes";
import Header from "./Components/Header/Header";
import Footer from "./Components/Footer/Footer";

// Css
import "./App.css";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <main>
          <AppRoutes />
        </main>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;

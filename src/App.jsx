// React
// import { useState, useEffect } from "react";

// Components
import AppRoutes from "./Components/AppRoutes";
import Header from "./Components/Header/Header";
import Footer from "./Components/Footer/Footer";

// Css
import "./App.css";

function App() {
  return (
    <div className="App">
      <Header />
      <main>
        <AppRoutes />
      </main>
      <Footer />
    </div>
  );
}

export default App;

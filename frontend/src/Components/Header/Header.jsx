import React from "react";
import { Link } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import { useState, useEffect, useRef } from "react";

// Font Awesome Icon's
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

// Css
import "./Header.css";

const Header = () => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Fecha o menu ao clicar fora dele
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header>
      {isMobile ? (
        <>
          <div className="hamburger-container--mobile" ref={menuRef}>
            <button
              onClick={toggleMenu}
              className="hamburger-btn--mobile"
              style={{ fontWeight: "550" }}
            >
              ☰
            </button>
            <div className={`hamburger-menu ${menuOpen ? "show--mobile" : ""}`}>
              <ul>
                <Link to="/login">
                  <li>Login</li>
                </Link>
                <Link to="/contact">
                  <li>Contate-nos</li>
                </Link>
                <Link to="/profile">
                  <li>Perfil</li>
                </Link>

                <Link to="/author-page">
                  <li>Autor</li>
                </Link>

                <Link to="/about">
                  <li>Sobre nós</li>
                </Link>
              </ul>
            </div>
          </div>
          <Link to="/">
            <h1 className="logo--mobile">Notícias RP</h1>
          </Link>
          <div className="search-icon--mobile">
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              style={{ fontSize: "16px", color: "#fff" }}
            />
          </div>
        </>
      ) : (
        <>
          <div className="hamburger-container" ref={menuRef}>
            <button
              onClick={toggleMenu}
              className="hamburger-btn"
              style={{ fontWeight: "550" }}
            >
              ☰
            </button>
            <div className={`hamburger-menu ${menuOpen ? "show" : ""}`}>
              <ul>
                <Link to="/login">
                  <li>Login</li>
                </Link>
                <Link to="/contact">
                  <li>Contate-nos</li>
                </Link>
                <Link to="/profile">
                  <li>Perfil</li>
                </Link>

                <Link to="/author-page">
                  <li>Autor</li>
                </Link>

                <Link to="/about">

                  <li>Sobre nós</li>
                </Link>
              </ul>
            </div>
          </div>
          <Link to="/">
            <h1 className="logo">Notícias RP</h1>
          </Link>
          <div className="search-icon">
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              style={{ fontSize: "22px", color: "#fff", cursor: "pointer" }}
            />
          </div>
        </>
      )}
    </header>
  );
};

export default Header;

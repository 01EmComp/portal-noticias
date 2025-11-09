import React from "react";
import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

// Font Awesome Icon's
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

// Css
import "./Header.css";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const menuRef = useRef();
  const searchRef = useRef();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
    if (!searchOpen) {
      setTimeout(() => searchRef.current?.focus(), 100);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // navigate(`/search?q=${searchQuery}`); abrir notícia qnd estiver pronto
    }
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
      {/* Botão fora do menu */}
      <div className="hamburger-container" ref={menuRef}>
        <button
          onClick={toggleMenu}
          className="hamburger-btn"
          style={{ fontWeight: "550" }}
        >
          ☰
        </button>
      </div>

      {/* Menu */}
      <div className={`hamburger-menu ${menuOpen ? "show" : ""}`}>
        <ul>
          <li className="close">
            <FontAwesomeIcon
              icon={faXmark}
              style={{ fontSize: "22px" }}
              onClick={toggleMenu}
            />
          </li>
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
          <Link to="/blog">
            <li>Blog</li>
          </Link>
          <Link to="/about">
            <li>Sobre nós</li>
          </Link>
        </ul>
      </div>

      <Link to="/">
        <h1 className="logo">Notícias RP</h1>
      </Link>

      <div className="search-container">
        <form 
          className={`search-form ${searchOpen ? "open" : ""}`}
          onSubmit={handleSearch}
        >
          <input
            ref={searchRef}
            type="text"
            placeholder="Pesquisar notícias..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </form>
        
        <div className="search-icon" onClick={toggleSearch}>
          <FontAwesomeIcon
            icon={searchOpen ? faXmark : faMagnifyingGlass}
            style={{ fontSize: "22px", color: "#fff", cursor: "pointer" }}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
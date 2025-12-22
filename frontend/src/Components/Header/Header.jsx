import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

// Auth
import { auth, db } from "/src/Services/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

// Font Awesome Icon's
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { faHouse } from "@fortawesome/free-regular-svg-icons";

// Css
import "./Header.css";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const menuRef = useRef();
  const searchRef = useRef();
  const dropdownRef = useRef();

  const navigate = useNavigate();
  const location = useLocation();

  // Verificação de autenticação
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setUserData(docSnap.data());
          }
        } catch (err) {
          console.error("Erro ao buscar usuário:", err);
        }
      } else {
        setUserData(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleDropdownLinkClick = () => {
    setDropdownOpen(false);
  };

  const dropDownFunction = () => {
    if (!userData) {
      return (
        <ul className="dropdown-itens">
          <Link to="/profile" onClick={handleDropdownLinkClick}>
            <li>Meu perfil</li>
          </Link>
        </ul>
      );
    }

    if (userData?.role === "admin") {
      return (
        <ul className="dropdown-itens">
          <Link to="/profile" onClick={handleDropdownLinkClick}>
            <li>Meu perfil</li>
          </Link>
          <Link to="/writer-painel" onClick={handleDropdownLinkClick}>
            <li>Painel do escritor</li>
          </Link>
          <Link to="/admin-painel" onClick={handleDropdownLinkClick}>
            <li>Painel do administrador</li>
          </Link>
        </ul>
      );
    } else if (userData?.role === "editor") {
      return (
        <ul className="dropdown-itens">
          <Link to="/profile" onClick={handleDropdownLinkClick}>
            <li>Meu perfil</li>
          </Link>
          <Link to="/writer-painel" onClick={handleDropdownLinkClick}>
            <li>Painel do escritor</li>
          </Link>
        </ul>
      );
    } else {
      return (
        <ul className="dropdown-itens">
          <Link to="/profile" onClick={handleDropdownLinkClick}>
            <li>Meu perfil</li>
          </Link>
        </ul>
      );
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleSearch = (e) => {
    e.preventDefault();

    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const toggleSearch = () => {
    if (searchOpen && searchQuery.trim()) {
      const fakeEvent = { preventDefault: () => {} };
      handleSearch(fakeEvent);
    } else {
      setSearchOpen(!searchOpen);
      if (!searchOpen) {
        setTimeout(() => searchRef.current?.focus(), 100);
      } else {
        setSearchQuery("");
      }
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleCategoryClick = (category) => {
    navigate(`/search?category=${encodeURIComponent(category)}`);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header>
      <div className="header-container">
        {/* Botão fora do menu */}
        <div className="hamburger-container" ref={menuRef}>
          <button onClick={toggleMenu} className="hamburger-btn">
            ☰
          </button>
        </div>

        {/* Menu */}
        <div className={`hamburger-menu ${menuOpen ? "show" : ""}`}>
          <ul>
            <li className="close">
              <FontAwesomeIcon icon={faXmark} onClick={toggleMenu} />
            </li>
            <Link to="/profile">
              <div className="profile">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  version="1.1"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  width="512"
                  height="512"
                  x="0"
                  y="0"
                  viewBox="0 0 24 24"
                  style={{
                    enableBackground: "new 0 0 512 512",
                    width: "auto",
                  }}
                  xmlSpace="preserve"
                  className="user-icon"
                >
                  <g>
                    <path
                      d="M12 0C5.383 0 0 5.383 0 12s5.383 12 12 12 12-5.383 12-12S18.617 0 12 0ZM8 21.164V19c0-.552.449-1 1-1h6c.551 0 1 .448 1 1v2.164c-1.226.537-2.578.836-4 .836s-2.774-.299-4-.836Zm10-1.169V19c0-1.654-1.346-3-3-3H9c-1.654 0-3 1.346-3 3v.995A9.991 9.991 0 0 1 2 12C2 6.486 6.486 2 12 2s10 4.486 10 10a9.992 9.992 0 0 1-4 7.995ZM12 6c-2.206 0-4 1.794-4 4s1.794 4 4 4 4-1.794 4-4-1.794-4-4-4Zm0 6c-1.103 0-2-.897-2-2s.897-2 2-2 2 .897 2 2-.897 2-2 2Z"
                      fill="#ffffff"
                      opacity="1"
                      data-original="#000000"
                      className=""
                    ></path>
                  </g>
                </svg>
                <li>Meu perfil</li>
              </div>
            </Link>
            <Link to="/">
              <div>
                <svg
                  data-prefix="far"
                  data-icon="house"
                  className="svg-inline--fa fa-house"
                  role="img"
                  viewBox="0 0 512 512"
                  aria-hidden="true"
                  style={{
                    color: " rgb(255, 255, 255)",
                    fontSize: "26px",
                    width: "auto",
                  }}
                >
                  <path
                    fill="currentColor"
                    d="M240 6.1c9.1-8.2 22.9-8.2 32 0l232 208c9.9 8.8 10.7 24 1.8 33.9s-24 10.7-33.9 1.8l-8-7.2 0 205.3c0 35.3-28.7 64-64 64l-288 0c-35.3 0-64-28.7-64-64l0-205.3-8 7.2c-9.9 8.8-25 8-33.9-1.8s-8-25 1.8-33.9L240 6.1zm16 50.1L96 199.7 96 448c0 8.8 7.2 16 16 16l48 0 0-104c0-39.8 32.2-72 72-72l48 0c39.8 0 72 32.2 72 72l0 104 48 0c8.8 0 16-7.2 16-16l0-248.3-160-143.4zM208 464l96 0 0-104c0-13.3-10.7-24-24-24l-48 0c-13.3 0-24 10.7-24 24l0 104z"
                  ></path>
                </svg>
                <li>Home</li>
              </div>
            </Link>
            <Link to="/contact">
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  version="1.1"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  width="512"
                  height="512"
                  x="0"
                  y="0"
                  viewBox="0 0 24 24"
                  style={{ enableBackground: "new 0 0 512 512" }}
                  xmlSpace="preserve"
                  className="contact-icon"
                >
                  <g>
                    <path
                      d="M13 1a1 1 0 0 1 1-1 10.011 10.011 0 0 1 10 10 1 1 0 0 1-2 0 8.009 8.009 0 0 0-8-8 1 1 0 0 1-1-1Zm1 5a4 4 0 0 1 4 4 1 1 0 0 0 2 0 6.006 6.006 0 0 0-6-6 1 1 0 0 0 0 2Zm9.093 10.739a3.1 3.1 0 0 1 0 4.378l-.91 1.049c-8.19 7.841-28.12-12.084-20.4-20.3l1.15-1a3.081 3.081 0 0 1 4.327.04c.031.031 1.884 2.438 1.884 2.438a3.1 3.1 0 0 1-.007 4.282L7.979 9.082a12.781 12.781 0 0 0 6.931 6.945l1.465-1.165a3.1 3.1 0 0 1 4.281-.006s2.406 1.852 2.437 1.883Zm-1.376 1.454s-2.393-1.841-2.424-1.872a1.1 1.1 0 0 0-1.549 0c-.027.028-2.044 1.635-2.044 1.635a1 1 0 0 1-.979.152A15.009 15.009 0 0 1 5.9 9.3a1 1 0 0 1 .145-1s1.607-2.018 1.634-2.044a1.1 1.1 0 0 0 0-1.549c-.031-.03-1.872-2.425-1.872-2.425a1.1 1.1 0 0 0-1.51.039l-1.15 1C-2.495 10.105 14.776 26.418 20.721 20.8l.911-1.05a1.121 1.121 0 0 0 .085-1.557Z"
                      fill="#ffffff"
                      opacity="1"
                      data-original="#000000"
                      className=""
                    ></path>
                  </g>
                </svg>
                <li>Contate-nos</li>
              </div>
            </Link>
            <Link to="/blog">
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  version="1.1"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  width="512"
                  height="512"
                  x="0"
                  y="0"
                  viewBox="0 0 24 24"
                  style={{ enableBackground: "new 0 0 512 512" }}
                  xmlSpace="preserve"
                  className="blog-icon"
                >
                  <g>
                    <path
                      d="M19 2H5C2.24 2 0 4.24 0 7v10c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5V7c0-2.76-2.24-5-5-5ZM5 4h14c1.65 0 3 1.35 3 3H2c0-1.65 1.35-3 3-3Zm14 16H5c-1.65 0-3-1.35-3-3V9h20v8c0 1.65-1.35 3-3 3Zm-9-8c0 .55-.45 1-1 1H8v4c0 .55-.45 1-1 1s-1-.45-1-1v-4H5c-.55 0-1-.45-1-1s.45-1 1-1h4c.55 0 1 .45 1 1Zm10 0c0 .55-.45 1-1 1h-6c-.55 0-1-.45-1-1s.45-1 1-1h6c.55 0 1 .45 1 1Zm0 4c0 .55-.45 1-1 1h-6c-.55 0-1-.45-1-1s.45-1 1-1h6c.55 0 1 .45 1 1Z"
                      fill="#ffffff"
                      opacity="1"
                      data-original="#000000"
                    ></path>
                  </g>
                </svg>
                <li>Blogs</li>
              </div>
            </Link>
            <Link to="/about">
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  version="1.1"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  width="512"
                  height="512"
                  x="0"
                  y="0"
                  viewBox="0 0 24 24"
                  style={{ enableBackground: "new 0 0 512 512" }}
                  xmlSpace="preserve"
                  className="about-icon"
                >
                  <g>
                    <path
                      d="M12 0a12 12 0 1 0 12 12A12.013 12.013 0 0 0 12 0Zm0 22a10 10 0 1 1 10-10 10.011 10.011 0 0 1-10 10Z"
                      fill="#ffffff"
                      opacity="1"
                      data-original="#000000"
                      className=""
                    ></path>
                    <path
                      d="M12 10h-1a1 1 0 0 0 0 2h1v6a1 1 0 0 0 2 0v-6a2 2 0 0 0-2-2Z"
                      fill="#ffffff"
                      opacity="1"
                      data-original="#000000"
                      className=""
                    ></path>
                    <circle
                      cx="12"
                      cy="6.5"
                      r="1.5"
                      fill="#ffffff"
                      opacity="1"
                      data-original="#000000"
                      className=""
                    ></circle>
                  </g>
                </svg>
                <li>Sobre nós</li>
              </div>
            </Link>
          </ul>
        </div>

        <Link to="/">
          <h1 className="logo">Notícias RP</h1>
        </Link>

        <div className="buttons-right">
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
                icon={
                  searchOpen && searchQuery.trim()
                    ? faMagnifyingGlass
                    : searchOpen
                    ? faXmark
                    : faMagnifyingGlass
                }
                className="search-bar-icon"
              />
            </div>
          </div>

          <div className="profile-button" ref={dropdownRef}>
            <Link to="/profile">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                version="1.1"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                width="512"
                height="512"
                x="0"
                y="0"
                viewBox="0 0 24 24"
                style={{
                  enableBackground: "new 0 0 512 512",
                  width: "auto",
                }}
                xmlSpace="preserve"
                className="user-icon"
              >
                <g>
                  <path
                    d="M12 0C5.383 0 0 5.383 0 12s5.383 12 12 12 12-5.383 12-12S18.617 0 12 0ZM8 21.164V19c0-.552.449-1 1-1h6c.551 0 1 .448 1 1v2.164c-1.226.537-2.578.836-4 .836s-2.774-.299-4-.836Zm10-1.169V19c0-1.654-1.346-3-3-3H9c-1.654 0-3 1.346-3 3v.995A9.991 9.991 0 0 1 2 12C2 6.486 6.486 2 12 2s10 4.486 10 10a9.992 9.992 0 0 1-4 7.995ZM12 6c-2.206 0-4 1.794-4 4s1.794 4 4 4 4-1.794 4-4-1.794-4-4-4Zm0 6c-1.103 0-2-.897-2-2s.897-2 2-2 2 .897 2 2-.897 2-2 2Z"
                    fill="#ffffff"
                    opacity="1"
                    data-original="#000000"
                    className=""
                  ></path>
                </g>
              </svg>
            </Link>

            <div className="drop">
              <FontAwesomeIcon
                icon={faAngleDown}
                style={{
                  color: "#fff",
                  fontSize: "18px",
                  cursor: "pointer",
                  transition: ".2s ease",
                  transform: dropdownOpen ? "rotateZ(180deg)" : "rotateZ(0deg)",
                }}
                onClick={() => toggleDropdown()}
              />
            </div>

            {dropdownOpen && dropDownFunction()}
          </div>
        </div>
      </div>

      {location.pathname === "/" && (
        <nav className="categories-bar">
          <ul>
            <li className="first" onClick={() => navigate("/")}>
              Última hora
            </li>
            <li onClick={() => handleCategoryClick("Política")}>Política</li>
            <li onClick={() => handleCategoryClick("Economia")}>Economia</li>
            <li onClick={() => handleCategoryClick("Educação")}>Educação</li>
            <li onClick={() => handleCategoryClick("Tecnologia")}>
              Tecnologia
            </li>
            <li onClick={() => handleCategoryClick("Saúde")}>Saúde</li>
            <li onClick={() => handleCategoryClick("Esportes")}>Esportes</li>
            <li onClick={() => handleCategoryClick("Entretenimento")}>
              Entretenimento
            </li>
            <li onClick={() => handleCategoryClick("Cultura")}>Cultura</li>
            <li onClick={() => handleCategoryClick("Ciência")}>Ciência</li>
            <li onClick={() => handleCategoryClick("Eventos")}>Eventos</li>
            <li className="last" onClick={() => handleCategoryClick("Região")}>
              Região
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Header;

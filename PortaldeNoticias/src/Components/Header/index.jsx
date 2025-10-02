  import React from "react";
  import "./style.css";
  import searchIcon from "../../assets/Icons/search-icon.png";
  import userIcon from "../../assets/Icons/user-icon.png";
  import menuIcon from "../../assets/Icons/hamburger-menu.png"

  const categories = [
    "Última Hora",
    "Saúde",
    "Cultura",
    "Esportes",
    "Eventos",
    "Política",
    "Região",
  ];

  function Header() {
    return (
      <>
        <header className="header">
          <div className="container-header">
            <div className="left-buttons">{<img src={menuIcon} alt="Menu" />}</div>
            <div className="title-wrapper">
              <h1 className="title-header">Notícias RP</h1>
            </div>
            <div className="right-buttons">
              <img src={searchIcon} alt="Buscar" />
              <img src={userIcon} alt="Usuário" />
            </div>
          </div>
        </header>

        <nav className="category-nav">
          <ul className="category-list">
            {categories.map((category) => (
              <li key={category} className="category-item">
                <a href="">{category}</a>
              </li>
            ))}
          </ul>
        </nav>
      </>
    );
  }

  export default Header;

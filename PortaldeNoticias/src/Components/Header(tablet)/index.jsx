import React from "react";
import "./style.css";
import searchIcon from "../../assets/Icons/search-icon.png";
import userIcon from "../../assets/Icons/user-icon.png";
import menuIcon from "../../assets/Icons/hamburger-menu.png";

const categories = [
  "Saúde",
  "Cultura",
  "Esportes",
  "Eventos",
  "Política",
];

function Header() {
  return (
    <>
      <header className="header-tablet">
        <div className="container-header-tablet">
          <div className="left-buttons">
            <img src={menuIcon} alt="Menu" />
          </div>
          <div className="title-wrapper">
            <h1 className="title-header-tablet">Notícias RP</h1>
          </div>
          <div className="right-buttons">
            <img src={searchIcon} alt="Buscar" />
            <img src={userIcon} alt="Usuário" />
          </div>
        </div>
      </header>

      <nav className="category-nav-tablet">
        <ul className="category-list-tablet">
          {categories.map((category) => (
            <li key={category} className="category-item-tablet">
              <a href="">{category}</a>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}

export default Header;

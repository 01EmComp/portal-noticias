import { useState } from "react";

// Components
import NewsItem from "./NewsItem/NewsItem";

// Css
import "./News.css";

const News = () => {
  return (
    <div className="news-list-container">
      <NewsItem
        title={"Título"}
        author={"Autor"}
        date={"Data"}
        status={"Status"}
      />
      <NewsItem
        title={"Evento de Tecnologia Reune Milhares"}
        author={"João Silva"}
        date={"20/01 2025"}
        status={"Aprovado"}
      />
      <NewsItem
        title={"Evento de Tecnologia Reune Milhares"}
        author={"João Silva"}
        date={"20/01 2025"}
        status={"Aprovado"}
      />
      <NewsItem
        title={"Evento de Tecnologia Reune Milhares"}
        author={"João Silva"}
        date={"20/01 2025"}
        status={"Em Análise"}
      />
      <NewsItem
        title={"Evento de Tecnologia Reune Milhares"}
        author={"João Silva"}
        date={"20/01 2025"}
        status={"Reprovado"}
      />
    </div>
  );
};

export default News;

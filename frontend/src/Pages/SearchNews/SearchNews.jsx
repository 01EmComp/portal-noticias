import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

// Font Awesome Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faMagnifyingGlass, 
  faXmark,
  faClock,
  faFilter
} from "@fortawesome/free-solid-svg-icons";

// Firebase
import { db } from "/src/Services/firebaseConfig";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";

// CSS
import "./SearchNews.css";

const SearchNews = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("recent");

  const categories = [
    "Todas",
    "Política",
    "Economia",
    "Educação",
    "Tecnologia",
    "Saúde",
    "Esportes",
    "Entretenimento",
    "Cultura",
    "Ciência",
  ];

  useEffect(() => {
    const query = searchParams.get("q");
    if (query) {
      setSearchQuery(query);
      performSearch(query);
    }
  }, [searchParams]);

  const performSearch = async (query) => {
    if (!query.trim()) return;

    setLoading(true);
    setHasSearched(true);

    try {
      const newsRef = collection(db, "news");
      let newsQuery = query(
        newsRef,
        where("status", "==", "published")
      );

      const querySnapshot = await getDocs(newsQuery);
      const allNews = querySnapshot.docs.map(doc => ({
        docId: doc.id,
        ...doc.data()
      }));

      const searchTerm = query.toLowerCase();
      let filtered = allNews.filter(news => 
        news.title?.toLowerCase().includes(searchTerm) ||
        news.subtitle?.toLowerCase().includes(searchTerm) ||
        news.category?.toLowerCase().includes(searchTerm) ||
        news.body?.some(item => item.text?.toLowerCase().includes(searchTerm))
      );

      if (selectedCategory !== "all") {
        filtered = filtered.filter(news => 
          news.category === selectedCategory
        );
      }

      // Ordenar
      if (sortBy === "recent") {
        filtered.sort((a, b) => {
          const dateA = a.publishedAt?.toDate() || a.createdAt?.toDate() || new Date(0);
          const dateB = b.publishedAt?.toDate() || b.createdAt?.toDate() || new Date(0);
          return dateB - dateA;
        });
      } else if (sortBy === "popular") {
        filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
      } else if (sortBy === "relevance") {
        // Ordenar por relevância (quantas vezes o termo aparece)
        filtered.sort((a, b) => {
          const countA = countOccurrences(a, searchTerm);
          const countB = countOccurrences(b, searchTerm);
          return countB - countA;
        });
      }

      setSearchResults(filtered);
    } catch (error) {
      console.error("Erro ao buscar notícias:", error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const countOccurrences = (news, term) => {
    let count = 0;
    const lowerTerm = term.toLowerCase();
    
    if (news.title?.toLowerCase().includes(lowerTerm)) count += 3;
    if (news.subtitle?.toLowerCase().includes(lowerTerm)) count += 2;
    if (news.category?.toLowerCase().includes(lowerTerm)) count += 1;
    
    news.body?.forEach(item => {
      if (item.text?.toLowerCase().includes(lowerTerm)) count += 1;
    });
    
    return count;
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery.trim() });
      performSearch(searchQuery.trim());
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setHasSearched(false);
    setSearchParams({});
  };

  const handleCategoryChange = (category) => {
    const categoryValue = category === "Todas" ? "all" : category;
    setSelectedCategory(categoryValue);
    
    if (hasSearched) {
      performSearch(searchQuery);
    }
  };

  const handleSortChange = (sort) => {
    setSortBy(sort);
    
    if (hasSearched) {
      performSearch(searchQuery);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffHours < 1) return "Agora";
    if (diffHours < 24) return `${diffHours}h atrás`;
    if (diffDays === 1) return "Ontem";
    if (diffDays < 7) return `${diffDays}d atrás`;
    
    return date.toLocaleDateString("pt-BR", { 
      day: "2-digit", 
      month: "short" 
    });
  };

  const highlightText = (text, query) => {
    if (!query.trim()) return text;
    
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, index) => 
      part.toLowerCase() === query.toLowerCase() 
        ? <mark key={index}>{part}</mark> 
        : part
    );
  };

  const handleArticleClick = (articleId) => {
    navigate(`/news/${articleId}`);
  };

  return (
    <div className="search-news-container">
      {/* Header de Busca */}
      <div className="search-header">
        <h1>Buscar Notícias</h1>
        <form className="search-form-page" onSubmit={handleSearch}>
          <div className="search-input-wrapper">
            <FontAwesomeIcon 
              icon={faMagnifyingGlass} 
              className="search-icon-input"
            />
            <input
              type="text"
              placeholder="Digite para buscar notícias..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input-page"
              autoFocus
            />
            {searchQuery && (
              <FontAwesomeIcon 
                icon={faXmark} 
                className="clear-icon"
                onClick={clearSearch}
              />
            )}
          </div>
          <button type="submit" className="search-button">
            Buscar
          </button>
        </form>
      </div>

      {/* Filtros */}
      {hasSearched && (
        <div className="filters-section">
          <div className="filter-group">
            <div className="filter-header">
              <FontAwesomeIcon icon={faFilter} />
              <span>Filtros</span>
            </div>
            
            {/* Categorias */}
            <div className="filter-categories">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`category-chip ${
                    (category === "Todas" && selectedCategory === "all") ||
                    category === selectedCategory
                      ? "active"
                      : ""
                  }`}
                  onClick={() => handleCategoryChange(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Ordenação */}
          <div className="sort-group">
            <label>Ordenar por:</label>
            <select 
              value={sortBy} 
              onChange={(e) => handleSortChange(e.target.value)}
              className="sort-select"
            >
              <option value="relevance">Relevância</option>
              <option value="recent">Mais recentes</option>
              <option value="popular">Mais populares</option>
            </select>
          </div>
        </div>
      )}

      {/* Resultados */}
      <div className="search-results">
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Buscando notícias...</p>
          </div>
        ) : hasSearched ? (
          <>
            <div className="results-header">
              <h2>
                {searchResults.length > 0
                  ? `${searchResults.length} resultado${searchResults.length !== 1 ? 's' : ''} encontrado${searchResults.length !== 1 ? 's' : ''}`
                  : "Nenhum resultado encontrado"}
              </h2>
              {searchResults.length > 0 && (
                <p className="search-term">
                  Resultados para: <strong>"{searchQuery}"</strong>
                </p>
              )}
            </div>

            {searchResults.length > 0 ? (
              <div className="results-grid">
                {searchResults.map((article) => (
                  <div
                    key={article.id}
                    className="result-card"
                    onClick={() => handleArticleClick(article.id)}
                  >
                    <div className="result-image">
                      <img src={article.imageURL} alt={article.title} />
                      <span className="result-category">{article.category}</span>
                    </div>
                    <div className="result-content">
                      <h3>{highlightText(article.title, searchQuery)}</h3>
                      {article.subtitle && (
                        <p className="result-subtitle">
                          {highlightText(article.subtitle, searchQuery)}
                        </p>
                      )}
                      <div className="result-meta">
                        <span className="result-author">
                          {article.author?.name || "Autor desconhecido"}
                        </span>
                        <div className="meta-separator">•</div>
                        <div className="result-time">
                          <FontAwesomeIcon icon={faClock} />
                          <span>{formatDate(article.publishedAt || article.createdAt)}</span>
                        </div>
                        {article.views > 0 && (
                          <>
                            <div className="meta-separator">•</div>
                            <span className="result-views">{article.views} visualizações</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-results">
                <div className="no-results-icon">🔍</div>
                <h3>Nenhuma notícia encontrada</h3>
                <p>Tente usar palavras-chave diferentes ou remova alguns filtros</p>
                <button onClick={clearSearch} className="clear-button">
                  Limpar busca
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="search-placeholder">
            <div className="placeholder-icon">
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </div>
            <h3>Busque por notícias</h3>
            <p>Digite uma palavra-chave para encontrar notícias relevantes</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchNews;
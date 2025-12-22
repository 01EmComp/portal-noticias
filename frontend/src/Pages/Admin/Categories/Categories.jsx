import { useState, useEffect } from "react";
import { db } from "/src/Services/firebaseConfig";
import { 
  collection, 
  onSnapshot,
  query,
  where,
  getDocs
} from "firebase/firestore";

// Components
import CategoriesItem from "./CategoriesItem/CategoriesItem";
import NewsModal from "./NewsModal/NewsModal";

// Css
import "./Categories.css";

const Categories = () => {
  const [categoriesList, setCategoriesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryNews, setCategoryNews] = useState([]);
  const [loadingNews, setLoadingNews] = useState(false);

  useEffect(() => {
    const fetchCategories = () => {
      try {
        setLoading(true);

        const unsubscribe = onSnapshot(
          collection(db, "news"),
          (querySnapshot) => {
            const categoriesMap = {};

            querySnapshot.forEach((doc) => {
              const news = doc.data();
              const category = news.category || "Sem categoria";

              if (categoriesMap[category]) {
                categoriesMap[category].count++;
              } else {
                categoriesMap[category] = {
                  name: category,
                  count: 1
                };
              }
            });

            const categoriesArray = Object.values(categoriesMap).sort((a, b) =>
              a.name.localeCompare(b.name)
            );

            setCategoriesList(categoriesArray);
            setLoading(false);
          }
        );

        return () => unsubscribe();
      } catch (error) {
        console.error("Erro ao buscar categorias:", error);
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleViewNews = async (category) => {
    try {
      setLoadingNews(true);
      
      const q = query(
        collection(db, "news"),
        where("category", "==", category)
      );
      
      const querySnapshot = await getDocs(q);
      const news = [];
      
      querySnapshot.forEach((doc) => {
        news.push({ id: doc.id, ...doc.data() });
      });
      
      setCategoryNews(news);
      setSelectedCategory(category);
      setLoadingNews(false);
    } catch (error) {
      console.error("Erro ao buscar notícias:", error);
      setLoadingNews(false);
    }
  };

  const handleCloseModal = () => {
    setSelectedCategory(null);
    setCategoryNews([]);
  };

  return (
    <>
      <div className="categories-list-container">
        {loading ? (
          <div className="loading">Carregando categorias...</div>
        ) : categoriesList.length === 0 ? (
          <div className="no-categories">
            <p>Nenhuma categoria encontrada.</p>
          </div>
        ) : (
          <>
            <CategoriesItem
              category="Categoria"
              quant="Quantidade"
              action="Ação"
              isHeader={true}
            />
            {categoriesList.map((cat, index) => (
              <CategoriesItem
                key={index}
                category={cat.name}
                quant={cat.count}
                hasNews={cat.count > 0}
                onViewNews={handleViewNews}
                isHeader={false}
              />
            ))}
          </>
        )}
      </div>

      {selectedCategory && (
        <NewsModal
          category={selectedCategory}
          news={categoryNews}
          loading={loadingNews}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};

export default Categories;
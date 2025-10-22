import { useState, useEffect } from "react";
import { db } from "/src/Services/firebaseConfig";
import { 
  collection, 
  onSnapshot 
} from "firebase/firestore";

// Components
import CategoriesItem from "./CategoriesItem/CategoriesItem";

// Css
import "./Categories.css";

const Categories = () => {
  const [categoriesList, setCategoriesList] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
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
            category={"Categoria"}
            quant={"Quantidade"}
            isHeader={true}
          />
          {categoriesList.map((cat, index) => (
            <CategoriesItem
              key={index}
              category={cat.name}
              quant={cat.count}
            />
          ))}
        </>
      )}
    </div>
  );
};

export default Categories;
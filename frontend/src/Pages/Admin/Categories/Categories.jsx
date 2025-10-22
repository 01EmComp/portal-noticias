// Components
import CategoriesItem from "./CategoriesItem/CategoriesItem";

// Css
import "./Categories.css";

const Categories = () => {
  return (
    <div className="categories-list-container">
      <CategoriesItem
        category={"Categoria"}
        quant={"Quantidade"}
        acess={"Acesso"}
      />
      <CategoriesItem category={"Politica"} quant={20} />
      <CategoriesItem category={"Esportes"} quant={5} />
    </div>
  );
};

export default Categories;

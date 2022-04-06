import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectAllCategories,
  activeCategoryUpdated,
  activeSubcategoryUpdated,
  selectActiveCategory,
  selectActiveSubcategory,
} from "../../../redux/spending/categoriesSlice";
import CategoriesSelector from "./CategoriesSelector";
import CategoriesForm from "./CategoriesForm";

export default function Categories() {
  const dispatch = useDispatch();
  const categories = useSelector(selectAllCategories);
  const activeCategory = useSelector((state) => selectActiveCategory(state));
  const activeSubcategory = useSelector((state) =>
    selectActiveSubcategory(state)
  );
  const [subcategories, setSubcategories] = useState([]);

  function handleCategoryToggle(category) {
    dispatch(activeCategoryUpdated(category));
    setSubcategories(category.subcategories);
  }

  function handleSubcategoryToggle(subcategory) {
    dispatch(activeSubcategoryUpdated(subcategory));
  }

  return (
    <div className="page-container">
      <div className="page-wrapper">
        <div className="form-wrapper">
          <section>
            <CategoriesSelector
              categories={categories}
              subcategories={subcategories}
              activeCategory={activeCategory}
              activeSubcategory={activeSubcategory}
              toggleCategory={handleCategoryToggle}
              toggleSubcategory={handleSubcategoryToggle}
            />
          </section>
          <section>
            <form>
              <CategoriesForm />
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}

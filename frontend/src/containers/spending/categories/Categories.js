import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectAllCategories,
  activeCategoryUpdated,
  activeSubcategoryUpdated,
  selectActiveCategory,
  selectActiveSubcategory,
  deleteCategory,
} from "../../../redux/spending/categoriesSlice";
import { selectAllSpendingTransactions } from "../../../redux/spending/spendingTransactionsSlice";
import CategoriesSelector from "./CategoriesSelector";
import CategoriesForm from "./CategoriesForm";
import { onError } from "../../../lib/errorLib";

export default function Categories() {
  const dispatch = useDispatch();
  const categories = useSelector(selectAllCategories);
  const activeCategory = useSelector((state) => selectActiveCategory(state));
  const activeSubcategory = useSelector((state) =>
    selectActiveSubcategory(state)
  );
  const [subcategories, setSubcategories] = useState([]);
  const allTransactions = useSelector(selectAllSpendingTransactions);

  function handleCategoryToggle(category) {
    dispatch(activeCategoryUpdated(category));
    setSubcategories(category.subcategories);
  }

  function handleSubcategoryToggle(subcategory) {
    dispatch(activeSubcategoryUpdated(subcategory));
  }

  async function handleCategoryDelete(category) {
    try {
      const transactions = allTransactions.filter(
        (trans) => trans.categoryId === category.id
      );
      await dispatch(deleteCategory({ category, transactions })).unwrap();
    } catch (e) {
      onError(e);
    }
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
              deleteCategory={handleCategoryDelete}
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

import React, { useState, useEffect } from "react";
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
  const [subcategories, setSubcategories] = useState(
    activeCategory.subcategories
  );
  const allTransactions = useSelector(selectAllSpendingTransactions);
  const transactionStatus = useSelector(
    (state) => state.spendingTransactions.status
  );
  const categoryStatus = useSelector((state) => state.categories.status);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    function validateStatus() {
      return transactionStatus === "pending" || categoryStatus === "pending";
    }

    if (validateStatus() && !isLoading) {
      setIsLoading(true);
    } else if (!validateStatus() && isLoading) {
      setIsLoading(false);
    }
  }, [transactionStatus, categoryStatus, isLoading]);


  function handleCategoryToggle(category) {
    dispatch(activeCategoryUpdated(category));
    setSubcategories(category.subcategories);
  }

  function handleSubcategoryToggle(subcategory) {
    dispatch(activeSubcategoryUpdated(subcategory));
  }

  async function handleCategoryDelete(category) {
    try {
      const transactions = getTransactionsByCategory(category);
      await dispatch(deleteCategory({ category, transactions })).unwrap();
    } catch (e) {
      onError(e);
    }
  }

  function getTransactionsByCategory(category) {
    return allTransactions.filter((trans) => trans.categoryId === category.id);
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
              isLoading={isLoading}
            />
          </section>
          <section>
            <form>
              <CategoriesForm isLoading={isLoading} />
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}

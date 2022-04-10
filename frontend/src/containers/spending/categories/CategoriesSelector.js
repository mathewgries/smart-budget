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
import LoadingSpinner from "../../../components/LoadingSpinner";
import ConfirmationPopup from "../../popups/ConfirmationPopup";
import { onError } from "../../../lib/errorLib";

const ConfirmMessage = () => {
  return (
    <div>
      <p>You are about to delete a category and its subcategories!</p>
      <p>They will be removed from any transactions as well!</p>
      <p>Please confirm!</p>
    </div>
  );
};

export default function CategoriesSelector(props) {
  const dispatch = useDispatch();
  const categories = useSelector(selectAllCategories);
  const activeCategory = useSelector((state) => selectActiveCategory(state));
  const activeSubcategory = useSelector((state) =>
    selectActiveSubcategory(state)
  );
  const allTransactions = useSelector(selectAllSpendingTransactions);
  const transactionStatus = useSelector(
    (state) => state.spendingTransactions.status
  );
  const categoryStatus = useSelector((state) => state.categories.status);
  const [subcategories, setSubcategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfrim, setShowConfirm] = useState(false);
  const [stagedForDelete, setStagedForDelete] = useState();

  useEffect(() => {
    setSubcategories(activeCategory.subcategories);
  }, [activeCategory]);

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
    dispatch(activeCategoryUpdated(category.id));
    setSubcategories(category.subcategories);
  }

  function handleSubcategoryToggle(subcategory) {
    dispatch(activeSubcategoryUpdated(subcategory));
  }

  function handleShowConfirm(category) {
    setShowConfirm(true);
    setStagedForDelete(category);
  }

  function handleCancel() {
    setShowConfirm(false);
  }

  async function handleConfirm() {
    setShowConfirm(!showConfrim);
    await onDelete(stagedForDelete);
  }

  async function onDelete(category) {
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
    <div className="categories-wrapper">
      <section>
        {showConfrim && (
          <section className="confirmation-popup-section">
            <ConfirmationPopup
              onCancel={handleCancel}
              onConfirm={handleConfirm}
            >
              <ConfirmMessage />
            </ConfirmationPopup>
          </section>
        )}
      </section>
      <section>
        <div>
          <header>
            <h5>Categories</h5>
          </header>
        </div>
        <div className="categories-dropdown-section">
          <div className="dropdown form-group">
            <button
              className="btn dropdown-toggle"
              type="input"
              id="dropdownMenuButton"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
              disabled={isLoading}
            >
              {isLoading ? (
                <LoadingSpinner />
              ) : (
                `${activeCategory.categoryName}`
              )}
            </button>
            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
              {categories.map((category) => (
                <div key={category.id} className="category-list-item">
                  <div
                    className="dropdown-item"
                    onClick={() => handleCategoryToggle(category)}
                  >
                    <div>{category.categoryName}</div>
                  </div>
                  <div>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleShowConfirm(category)}
                      disabled={isLoading}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section>
        <div>
          <header>
            <h5>Subcategories</h5>
          </header>
        </div>
        <div className="categories-dropdown-section">
          <div className="dropdown form-group">
            <button
              className="btn dropdown-toggle"
              type="button"
              id="dropdownMenuButton"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
              disabled={isLoading}
            >
              {isLoading ? <LoadingSpinner /> : `${activeSubcategory}`}
            </button>
            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
              {!isLoading && (
                <div>
                  {subcategories.length > 0 &&
                    subcategories.map((subcategory) => (
                      <div
                        key={subcategory}
                        className="dropdown-item"
                        onClick={() => handleSubcategoryToggle(subcategory)}
                      >
                        {subcategory}
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

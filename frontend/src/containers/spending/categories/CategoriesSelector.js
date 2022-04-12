import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectAllCategories,
  activeCategoryUpdated,
  activeSubcategoryUpdated,
  selectActiveCategory,
  selectActiveSubcategory,
  deleteCategory,
  deleteSubcategory,
} from "../../../redux/spending/categoriesSlice";
import { selectAllSpendingTransactions } from "../../../redux/spending/spendingTransactionsSlice";
import LoadingSpinner from "../../../components/LoadingSpinner";
import ConfirmationPopup from "../../popups/ConfirmationPopup";
import { onError } from "../../../lib/errorLib";

const CategoryConfirmMessage = () => {
  return (
    <div>
      <p>You are about to delete a category and its subcategories!</p>
      <p>They will be removed from any transactions as well!</p>
      <p>Please confirm!</p>
    </div>
  );
};

const SubcategoryConfirmMessage = () => {
  return (
    <div>
      <p>You are about to delete a subcategory!</p>
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
  const [showCategoryConfrim, setShowCategoryConfirm] = useState(false);
  const [stagedCategoryForDelete, setStagedCategoryForDelete] = useState();
  const [showSubcategoryConfrim, setShowSubcategoryConfirm] = useState(false);
  const [stagedSubcategoryForDelete, setStagedSubcategoryForDelete] =
    useState();

	useEffect(() => {
		if(categories.length === 0){
			dispatch(activeCategoryUpdated(undefined))
		}
	}, [categories, dispatch])

  useEffect(() => {
    if (activeCategory) {
      setSubcategories(activeCategory.subcategories);
    }else{
			setSubcategories([]);
		}
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

  function handleShowCategoryConfirm(category) {
    setShowCategoryConfirm(true);
    setStagedCategoryForDelete(category);
  }

  function handleCategoryCancel() {
    setShowCategoryConfirm(false);
  }

  async function handleCategoryConfirm() {
    setShowCategoryConfirm(false);
    await onCategoryDelete(stagedCategoryForDelete);
  }

  async function onCategoryDelete(category) {
    try {
      const transactions = setTransactionsOnCategoryDelete(
        getTransactionsByCategoryId(category.id)
      );
      await dispatch(deleteCategory({ category, transactions })).unwrap();
    } catch (e) {
      onError(e);
    }
  }

  function handleSubcategoryToggle(subcategory) {
    dispatch(activeSubcategoryUpdated(subcategory));
  }

  function handleShowSubcategoryConfirm(subcategory) {
    setShowSubcategoryConfirm(true);
    setStagedSubcategoryForDelete(subcategory);
  }

  function handleSubcategoryCancel() {
    setShowSubcategoryConfirm(false);
  }

  async function handleSubcategoryConfirm() {
    setShowSubcategoryConfirm(false);
    await onSubcategoryDelete(stagedSubcategoryForDelete);
  }

  async function onSubcategoryDelete(subcategory) {
    try {
      const transactions = setTransactionsOnSubcategoryDelete(
        getTransactionsByCategoryId(activeCategory.id),
        subcategory
      );
      const updatedSubList = activeCategory.subcategories.filter(
        (subs) => subs !== subcategory
      );
      await dispatch(
        deleteSubcategory({
          category: {
            ...activeCategory,
            subcategories: updatedSubList,
          },
          transactions,
        })
      ).unwrap();
    } catch (e) {
      onError(e);
    }
  }

  function getTransactionsByCategoryId(categoryId) {
    return allTransactions.filter((trans) => trans.categoryId === categoryId);
  }

  function setTransactionsOnCategoryDelete(transactions) {
    return transactions.map((transaction) => ({
      ...transaction,
      categoryName: "",
      categoryId: "",
      subcategory: "",
    }));
  }

  function setTransactionsOnSubcategoryDelete(transactions, subcategory) {
    return transactions
      .filter((transaction) => transaction.subcategory === subcategory)
      .map((transaction) => ({
        ...transaction,
        subcategory: "",
      }));
  }

  return (
    <div className="categories-wrapper">
      <section>
        <div>
          {showCategoryConfrim && (
            <section className="confirmation-popup-section">
              <ConfirmationPopup
                onCancel={handleCategoryCancel}
                onConfirm={handleCategoryConfirm}
              >
                <CategoryConfirmMessage />
              </ConfirmationPopup>
            </section>
          )}
        </div>
        <div>
          {showSubcategoryConfrim && (
            <section className="confirmation-popup-section">
              <ConfirmationPopup
                onCancel={handleSubcategoryCancel}
                onConfirm={handleSubcategoryConfirm}
              >
                <SubcategoryConfirmMessage />
              </ConfirmationPopup>
            </section>
          )}
        </div>
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
              ) : categories.length > 0 ? (
                activeCategory.categoryName
              ) : (
                "Add a category..."
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
                  <div className="category-btn-container">
                    <div>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleShowCategoryConfirm(category)}
                        disabled={isLoading}
                      >
                        Remove
                      </button>
                    </div>
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
              {isLoading ? (
                <LoadingSpinner />
              ) : !subcategories || subcategories.length === 0 ? (
                "No subcategories"
              ) : (
                activeSubcategory
              )}
            </button>
            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
              {!isLoading && (
                <div>
                  {subcategories &&
                    subcategories.length > 0 &&
                    subcategories.map((subcategory) => (
                      <div key={subcategory} className="category-list-item">
                        <div
                          className="dropdown-item"
                          onClick={() => handleSubcategoryToggle(subcategory)}
                        >
                          <div>{subcategory}</div>
                        </div>
                        <div className="category-btn-container">
                          <div>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() =>
                                handleShowSubcategoryConfirm(subcategory)
                              }
                              disabled={isLoading}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
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

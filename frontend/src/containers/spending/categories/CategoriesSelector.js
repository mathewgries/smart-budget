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
import CategoryEdit from "./CategoryEdit";
import SubcategoryEdit from "./SubcategoryEdit";
import ConfirmationPopup from "../../popups/ConfirmationPopup";
import DropDownLoader from "../../loadingContainers/DropDownLoader";
import { onError } from "../../../lib/errorLib";
import "./categories.css";

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
  const [editCategory, setEditCategory] = useState(false);

  const [showSubcategoryConfrim, setShowSubcategoryConfirm] = useState(false);
  const [stagedSubcategoryForDelete, setStagedSubcategoryForDelete] =
    useState();
  const [editSubcategory, setEditSubcategory] = useState(false);

  useEffect(() => {
    if (activeCategory) {
      setSubcategories(activeCategory.subcategories);
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

  function toggleCategoryEdit() {
    setEditCategory(!editCategory);
  }

  function toggleSubcategoryEdit() {
    setEditSubcategory(!editSubcategory);
  }

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
    dispatch(activeSubcategoryUpdated(subcategory.id));
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
        subcategory.id
      );
      const updatedSubList = activeCategory.subcategories.filter(
        (subs) => subs.id !== subcategory.id
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
      categoryId: "",
      subcategoryId: "",
    }));
  }

  function setTransactionsOnSubcategoryDelete(transactions, subcategoryId) {
    return transactions
      .filter((transaction) => transaction.subcategoryId === subcategoryId)
      .map((transaction) => ({
        ...transaction,
        subcategoryId: "",
      }));
  }

  return (
    <div>
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
          <header className="page-header">
            <h4>Categories</h4>
          </header>
        </div>
      </section>

      {(isLoading || !categories || !categories[0]) && (
        <section>
          <DropDownLoader text={"Add a category..."} isLoading={isLoading} />
        </section>
      )}

      {!isLoading && categories && categories[0] && (
        <section>
          {editCategory && (
            <div className="category-edit-wrapper">
              <div>
                <CategoryEdit toggleCategoryEdit={toggleCategoryEdit} />
              </div>
              <div>
                <button className="btn btn-delete" onClick={toggleCategoryEdit}>
                  Cancel
                </button>
              </div>
            </div>
          )}

          {!editCategory && (
            <div className="categories-dropdown-section">
              <div className="dropdown form-group category-dropdown">
                <button
                  className="btn dropdown-toggle"
                  type="input"
                  id="dropdownMenuButton"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                  disabled={isLoading}
                >
                  {activeCategory.categoryName}
                </button>
                <div>
                  <button
                    style={{
                      borderTop: "none",
                      borderRight: "none",
                      borderBottom: "none",
                    }}
                    className="btn btn-edit category-edit-btn"
                    onClick={toggleCategoryEdit}
                  >
                    Edit
                  </button>
                </div>
                <div
                  className="dropdown-menu"
                  aria-labelledby="dropdownMenuButton"
                >
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
                            className="btn btn-delete btn-sm"
                            onClick={() => handleShowCategoryConfirm(category)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>
      )}

      <section>
        <div>
          <header className="page-header">
            <h4>Subcategories</h4>
          </header>
        </div>
      </section>

      {(isLoading ||
        !categories ||
        !categories[0] ||
        !subcategories ||
        !subcategories[0]) && (
        <section>
          <DropDownLoader
            text={!categories[0] ? "Add a category..." : "Add a subcategory..."}
            isLoading={isLoading}
          />
        </section>
      )}

      {!isLoading && categories && subcategories && subcategories.length > 0 && (
        <section>
          {editSubcategory && (
            <div className="category-edit-wrapper">
              <div>
                <SubcategoryEdit
                  toggleSubcategoryEdit={toggleSubcategoryEdit}
                />
              </div>
              <div>
                <button
                  className="btn btn-delete"
                  onClick={toggleSubcategoryEdit}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {!editSubcategory && (
            <div className="categories-dropdown-section">
              <div className="dropdown form-group category-dropdown">
                <button
                  className="btn dropdown-toggle"
                  type="button"
                  id="dropdownMenuButton"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                  disabled={isLoading}
                >
                  {activeSubcategory.name}
                </button>
                <div>
                  <button
                    style={{
                      borderTop: "none",
                      borderRight: "none",
                      borderBottom: "none",
                    }}
                    className="btn btn-edit category-edit-btn"
                    onClick={toggleSubcategoryEdit}
                  >
                    Edit
                  </button>
                </div>
                <div
                  className="dropdown-menu"
                  aria-labelledby="dropdownMenuButton"
                >
                  <div>
                    {subcategories.map((subcategory) => (
                      <div key={subcategory.id} className="category-list-item">
                        <div
                          className="dropdown-item"
                          onClick={() => handleSubcategoryToggle(subcategory)}
                        >
                          <div>{subcategory.name}</div>
                        </div>
                        <div className="category-btn-container">
                          <div>
                            <button
                              className="btn btn-delete btn-sm"
                              onClick={() =>
                                handleShowSubcategoryConfirm(subcategory)
                              }
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

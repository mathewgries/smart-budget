import React, { useState } from "react";
import LoadingSpinner from "../../../components/LoadingSpinner";
import ConfirmationPopup from "../../popups/ConfirmationPopup";

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
  const [showConfrim, setShowConfirm] = useState(false);
	const [stagedForDelete, setStagedForDelete] = useState()
  const {
    isLoading,
    categories,
    subcategories,
    activeCategory,
    activeSubcategory,
    toggleCategory,
    toggleSubcategory,
    deleteCategory,
  } = props;

	function handleShowConfirm(category){
		setShowConfirm(!showConfrim);
		setStagedForDelete(category)
	}

  function handleCancel() {
    setShowConfirm(!showConfrim);
  }

  async function handleConfirm() {
    setShowConfirm(!showConfrim);
    await onDelete();
  }

  function handleCategoryToggle(category) {
    toggleCategory(category);
  }

  function handleSubcategoryToggle(subcategory) {
    toggleSubcategory(subcategory);
  }

  async function onDelete() {
    deleteCategory(stagedForDelete);
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
          </div>
        </div>
      </section>
    </div>
  );
}

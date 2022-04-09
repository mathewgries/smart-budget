import React from "react";
import LoadingSpinner from "../../../components/LoadingSpinner";

export default function CategoriesSelector(props) {
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
  // const status = useSelector((state) => state.categories.status);

  function handleCategoryToggle(category) {
    toggleCategory(category);
  }

  function handleSubcategoryToggle(subcategory) {
    toggleSubcategory(subcategory);
  }

  function handleCategoryDelete(category) {
    deleteCategory(category);
  }

  return (
    <div className="categories-wrapper">
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
                      onClick={() => handleCategoryDelete(category)}
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

import React from "react";

export default function CategoriesSelector(props) {
  const {
    categories,
    subcategories,
    activeCategory,
    activeSubcategory,
    toggleCategory,
    toggleSubcategory,
  } = props;

  function handleCategoryToggle(category) {
    toggleCategory(category);
  }

  function handleSubcategoryToggle(subcategory) {
    toggleSubcategory(subcategory);
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
            >
              {activeCategory.categoryName}
            </button>
            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="dropdown-item"
                  onClick={() => handleCategoryToggle(category)}
                >
                  {category.categoryName}
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
            >
              {activeSubcategory}
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

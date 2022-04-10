import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  saveNewCategory,
  updateCategory,
  selectActiveCategory,
} from "../../../redux/spending/categoriesSlice";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { onError } from "../../../lib/errorLib";

export default function CategoriesForm(props) {
  const dispatch = useDispatch();
  const activeCategory = useSelector((state) => selectActiveCategory(state));
  const status = useSelector((state) => state.categories.status);
  const [isLoading, setIsLoading] = useState(false);
  const [fields, setFields] = useState({
    categoryName: "",
    subcategory: "",
  });

  useEffect(() => {
    if (status === "pending" && !isLoading) {
      setIsLoading(true);
    } else if (status !== "pending" && isLoading) {
      setIsLoading(false);
    }
  }, [status, isLoading]);

  function handleOnChange(e) {
    const { name, value } = e.target;
    setFields({ ...fields, [name]: value });
  }

  function validateCategoryForm() {
    return fields.categoryName.length > 0;
  }

  function validateSubcategoryForm() {
    return fields.subcategory.length > 0 && !validateCategoryForm();
  }

  async function handleCategorySubmit(e) {
    e.preventDefault();
    try {
      await dispatch(
        saveNewCategory({
          category: {
            categoryName: fields.categoryName,
            subcategories:
              fields.subcategory === "" ? [] : [fields.subcategory],
          },
        })
      ).unwrap();
      setFields({ categoryName: "", subcategory: "" });
    } catch (e) {
      onError(e);
    }
  }

  async function handleSubategorySubmit(e) {
    e.preventDefault();
    try {
      await dispatch(
        updateCategory({
          category: {
            ...activeCategory,
            subcategories: [
              ...activeCategory.subcategories,
              fields.subcategory,
            ],
          },
        })
      ).unwrap();
      setFields({ categoryName: "", subcategory: "" });
    } catch (e) {
      onError(e);
    }
  }

  return (
    <div>
      <section>
        <div>
          <div onSubmit={handleCategorySubmit} className="categories-form">
            <div className="form-group categories-form">
              <input
                className="form-control"
                name="categoryName"
                value={fields.categoryName}
                onChange={handleOnChange}
                placeholder="Add new category..."
                disabled={isLoading}
              />
            </div>
            <div className="form-group">
              <button
                className={`btn ${
                  !validateCategoryForm() || isLoading
                    ? "btn-secondary"
                    : "btn-primary"
                }`}
                disabled={!validateCategoryForm() || isLoading}
                onClick={handleCategorySubmit}
              >
                {isLoading ? <LoadingSpinner /> : "Add"}
              </button>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div>
          <div onSubmit={handleSubategorySubmit} className="categories-form">
            <div className="form-group categories-form">
              <input
                className="form-control"
                name="subcategory"
                value={fields.subcategory}
                onChange={handleOnChange}
                placeholder="Add new subcategory..."
                disabled={isLoading}
              />
            </div>
            <div className="form-group">
              <button
                className={`btn ${
                  !validateSubcategoryForm() || isLoading
                    ? "btn-secondary"
                    : "btn-primary"
                }`}
                disabled={!validateSubcategoryForm() || isLoading}
                onClick={handleSubategorySubmit}
              >
                {isLoading ? <LoadingSpinner /> : "Add"}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import * as uuid from "uuid";
import { useSelector, useDispatch } from "react-redux";
import {
  saveNewCategory,
  saveNewSubcategory,
  selectActiveCategory,
} from "../../../redux/spending/categoriesSlice";
import AlertPopup from "../../popups/AlertPopup";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { onError } from "../../../lib/errorLib";
import "./categories.css";

const AlertMessage = () => {
  return (
    <div>
      <p>Subcategory already exists!</p>
    </div>
  );
};

export default function CategoriesForm(props) {
  const dispatch = useDispatch();
  const activeCategory = useSelector((state) => selectActiveCategory(state));
  const status = useSelector((state) => state.categories.status);
  const [showConfrim, setShowConfirm] = useState(false);
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

  function validateCategoryForm() {
    return fields.categoryName.length > 0;
  }

  function validateSubcategoryForm() {
    if (!activeCategory && !validateCategoryForm()) {
      return false;
    } else if (fields.subcategory.length > 0 && !validateCategoryForm()) {
      return true;
    }
  }

  function handleCancel() {
    setShowConfirm(!showConfrim);
  }

  function handleOnChange(e) {
    const { name, value } = e.target;
    setFields({ ...fields, [name]: value });
  }

  async function handleAddNewCategory(e) {
    e.preventDefault();
    try {
      await dispatch(
        saveNewCategory({
          category: {
            categoryName: fields.categoryName,
            subcategories:
              fields.subcategory === ""
                ? []
                : [{ id: uuid.v1(), name: fields.subcategory }],
          },
        })
      ).unwrap();
      setFields({ categoryName: "", subcategory: "" });
    } catch (e) {
      onError(e);
    }
  }

  async function handleAddNewSubcategory(e) {
    e.preventDefault();
    if (
      activeCategory.subcategories
        .map((subcategories) => subcategories.name)
        .includes(fields.subcategory)
    ) {
      setShowConfirm(true);
      return;
    }

    try {
      const newSubcategory = { id: uuid.v1(), name: fields.subcategory };
      const subcategories = [...activeCategory.subcategories, newSubcategory];
      await dispatch(
        saveNewSubcategory({
          category: {
            ...activeCategory,
            subcategories,
          },
          newSubcategory,
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
        {showConfrim && (
          <section className="confirmation-popup-section">
            <AlertPopup onCancel={handleCancel}>
              <AlertMessage />
            </AlertPopup>
          </section>
        )}
      </section>
      <div className="categories-form-wrapper">
        <section>
          <div>
            <div className="categories-form">
              <div className="form-group categories-form">
                <input
                  className="form-control"
                  name="categoryName"
                  value={fields.categoryName}
                  onChange={handleOnChange}
                  placeholder="Add new category..."
                  disabled={isLoading}
                  data-lpignore="true"
                />
              </div>
              <div className="form-group">
                <button
                  className="btn btn-add-new"
                  disabled={!validateCategoryForm() || isLoading}
                  onClick={handleAddNewCategory}
                >
                  {isLoading ? <LoadingSpinner /> : "Add"}
                </button>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div>
            <div className="categories-form">
              <div className="form-group categories-form">
                <input
                  className="form-control"
                  name="subcategory"
                  value={fields.subcategory}
                  onChange={handleOnChange}
                  placeholder="Add new subcategory..."
                  disabled={isLoading}
                  data-lpignore="true"
                />
              </div>
              <div className="form-group">
                <button
                  className="btn btn-add-new"
                  disabled={!validateSubcategoryForm() || isLoading}
                  onClick={handleAddNewSubcategory}
                >
                  {isLoading ? <LoadingSpinner /> : "Add"}
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

import React, {useEffect, useState } from "react";
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
	const transactionStatus = useSelector((state) => state.spendingTransactions.status);
	const categoryStatus = useSelector((state) => state.categories.status);
	const [status, setStatus] = useState("")
  const activeCategory = useSelector((state) => selectActiveCategory(state));
  const [fields, setFields] = useState({
    categoryName: "",
    subcategory: "",
  });

	useEffect(() => {
		let status
		if(transactionStatus === "pending" || categoryStatus === "pending"){
			status = "pending"
		}else {
			status = ""
		}
		setStatus(status)
	}, [transactionStatus, categoryStatus])

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
      const data = {
        categoryName: fields.categoryName,
        subcategories: fields.subcategory === "" ? [] : [fields.subcategory],
      };
      await dispatch(saveNewCategory(data)).unwrap();
      setFields({ categoryName: "", subcategory: "" });
    } catch (e) {
      onError(e);
    }
  }

  async function handleSubategorySubmit(e) {
    e.preventDefault();
    try {
      const data = {
        ...activeCategory,
        subcategories: [...activeCategory.subcategories, fields.subcategory],
      };
      await dispatch(updateCategory(data)).unwrap();
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
              />
            </div>
            <div className="form-group">
              <button
                className={`btn ${
                  !validateCategoryForm() || status === "pending"
                    ? "btn-secondary"
                    : "btn-primary"
                }`}
                disabled={!validateCategoryForm() || status === "pending"}
								onClick={handleCategorySubmit}
              >
                {status === "pending" ? <LoadingSpinner /> : "Add"}
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
              />
            </div>
            <div className="form-group">
              <button
                className={`btn ${
                  !validateSubcategoryForm() || status === "pending"
                    ? "btn-secondary"
                    : "btn-primary"
                }`}
                disabled={!validateSubcategoryForm() || status === "pending"}
								onClick={handleSubategorySubmit}
              >
                {status === "pending" ? <LoadingSpinner /> : "Add"}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

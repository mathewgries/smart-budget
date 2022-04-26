import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { onError } from "../../../lib/errorLib";
import {
  updateCategory,
  selectActiveCategory,
} from "../../../redux/spending/categoriesSlice";
import "./categories.css"

export default function CategoryEdit(props) {
  const dispatch = useDispatch();
  const activeCategory = useSelector((state) => selectActiveCategory(state));
  const categoryStatus = useSelector((state) => state.categories.status);
  const [isLoading, setIsLoading] = useState(false);
  const [category, setCategory] = useState(activeCategory.categoryName);

  useEffect(() => {
    function validateStatus() {
      if (categoryStatus === "pending") {
        return true;
      } else {
        return false;
      }
    }

    if (validateStatus() && !isLoading) {
      setIsLoading(true);
    } else if (!validateStatus() && isLoading) {
      setIsLoading(false);
    }
  }, [categoryStatus, isLoading]);

  async function handleUpdateCategory(e) {
    e.preventDefault();
    try {
      await dispatch(
        updateCategory({
          category: {
            ...activeCategory,
            categoryName: category,
          },
        })
      ).unwrap();
      props.toggleCategoryEdit();
    } catch (e) {
      onError(e);
    }
  }

  return (
    <div>
      <div className="category-edit-form">
        <div className="form-group">
          <input
            className="form-control"
            name="category"
            value={category}
            type="text"
            onChange={(e) => setCategory(e.target.value)}
						data-lpignore="true"
            disabled={isLoading}
          />
        </div>
        <div className="form-group">
          <button
            className="btn btn-primary"
            onClick={handleUpdateCategory}
            disabled={isLoading}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { onError } from "../../../lib/errorLib";
import {
  updateCategory,
  selectActiveCategory,
  selectActiveSubcategory,
} from "../../../redux/spending/categoriesSlice";
import "./categories.css"

export default function SubcategoryEdit(props) {
  const dispatch = useDispatch();
  const activeCategory = useSelector((state) => selectActiveCategory(state));
  const activeSubcategory = useSelector((state) =>
    selectActiveSubcategory(state)
  );
  const categoryStatus = useSelector((state) => state.categories.status);
  const [isLoading, setIsLoading] = useState(false);
  const [subcategory, setSubcategory] = useState(activeSubcategory.name);

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

  async function handleUpdateSubcategory(e) {
    e.preventDefault();
    const updatedSubList = activeCategory.subcategories.map((sub) =>
      sub.id === activeSubcategory.id ? { ...sub, name: subcategory } : sub
    );

    try {
      await dispatch(
        updateCategory({
          category: {
            ...activeCategory,
            subcategories: updatedSubList,
          },
        })
      ).unwrap();
      props.toggleSubcategoryEdit();
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
            name="subcategory"
            value={subcategory}
            type="text"
            onChange={(e) => setSubcategory(e.target.value)}
						data-lpignore="true"
            disabled={isLoading}
          />
        </div>
        <div className="form-group">
          <button
            className="btn btn-add-new"
            onClick={handleUpdateSubcategory}
            disabled={isLoading}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

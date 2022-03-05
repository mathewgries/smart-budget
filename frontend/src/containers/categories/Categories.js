import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectAllCategories,
  selectSubcategories,
  selectCategoryMap,
  updateActiveCategory,
  updateActiveSubcategory,
  addNewCategory,
  addNewSubcategory,
  saveCategories,
} from "../../redux/categoriesSlice";
import LoadingSpinner from "../../components/LoadingSpinner";
import ListContainer from "./ListContainer";
import { onError } from "../../lib/errorLib";

export default function Categories() {
  const dispatch = useDispatch();
  const categoryMap = useSelector(selectCategoryMap);
  const categories = useSelector(selectAllCategories);
  const subcategories = useSelector(selectSubcategories);
	const [disableSave, setDisableSave] = useState(true)
  const [savingCategoryMap, setSavingCategoryMap] = useState(false);
  const [fields, setFields] = useState({
    categoryInput: "",
    subcategoryInput: "",
  });

  function handleActiveCategory(e) {
    const category = e.target.innerText;
    dispatch(updateActiveCategory(category));
  }

  function handleActiveSubcategory(e) {
    const category = e.target.innerText;
    dispatch(updateActiveSubcategory(category));
  }

  function handleFieldChange(e) {
    const { name, value } = e.target;
    setFields({ ...fields, [name]: value });
  }

  const handleAddCetagory = async (e) => {
    e.preventDefault();
    const { categoryInput } = fields;

    if (categoryInput !== "" && !categories.includes(categoryInput)) {
      try {
        dispatch(addNewCategory(categoryInput));
				setDisableSave(false)
        setFields({ ...fields, categoryInput: "" });
      } catch (e) {
        onError(e);
      }
    }
  };

  function handleSubcategoryAdd(e) {
    e.preventDefault();
    if (fields.subcategoryInput !== "") {
      const { subcategoryInput } = fields;

      if (
        subcategoryInput !== "" ||
        !subcategories.includes(subcategoryInput)
      ) {
        try {
          dispatch(addNewSubcategory(subcategoryInput));
					setDisableSave(false)
          setFields({ ...fields, subcategoryInput: "" });
        } catch (e) {
          onError(e);
        }
      }
    }
  }

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      setSavingCategoryMap(true);
      await dispatch(saveCategories(categoryMap)).unwrap();
    } catch (e) {
      onError(e);
    } finally {
      setSavingCategoryMap(false);
    }
  };

  return (
    <div>
      <div>
        <form onSubmit={handleSave}>
          <div>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={disableSave}
            >
              {savingCategoryMap ? (
                <LoadingSpinner text={"Saving"} />
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>

      <div>
        <header>
          <h3>Categories</h3>
        </header>
        <div>
          <form onSubmit={handleAddCetagory}>
            <div className="form-group">
              <input
                className="form-control"
                type="text"
                name="categoryInput"
                value={fields.categoryInput}
                onChange={handleFieldChange}
                placeholder="New Category..."
              />
            </div>
            <button
              type="submit"
              className="btn btn-secondary"
              disabled={fields.categoryInput === ""}
            >
              Add
            </button>
          </form>
        </div>
        <div>
          <ListContainer
            listItems={categories}
            updateActiveItem={handleActiveCategory}
          />
        </div>
      </div>

      <div>
        <header>
          <h3>Subcategories</h3>
        </header>
        <div>
          <form onSubmit={handleSubcategoryAdd}>
            <div className="form-group">
              <input
                className="form-control"
                type="text"
                name="subcategoryInput"
                value={fields.subcategoryInput}
                onChange={handleFieldChange}
                placeholder="New Subcategory..."
              />
            </div>
            <button
              type="submit"
              className="btn btn-secondary"
              disabled={fields.subcategoryInput === ""}
            >
              Add
            </button>
          </form>
        </div>
        <div>
          <ListContainer
            listItems={subcategories}
            updateActiveItem={handleActiveSubcategory}
          />
        </div>
      </div>
    </div>
  );
}

import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  selectAllCategories,
  selectSubCategories,
  selectCategoryMap,
  updateActiveCategory,
  updateActiveSubCategory,
  addNewCategory,
  addNewSubCategory,
  saveCategories,
  selectActiveCategory,
  selectActiveSubCategory,
} from "../../../redux/spending/categoriesSlice"
import LoadingSpinner from "../../../components/LoadingSpinner";
import ListContainer from "./ListContainer";
import { onError } from "../../../lib/errorLib";
import "../style.css"

export default function Categories() {
  const history = useHistory();
  const dispatch = useDispatch();
  const isEdit = history.location.pathname === "/categories";
  const categoryMap = useSelector(selectCategoryMap);
  const categories = useSelector(selectAllCategories);
  const subCategories = useSelector(selectSubCategories);
  const activeCategory = useSelector(selectActiveCategory);
  const activeSubCategory = useSelector(selectActiveSubCategory);
  const [disableSave, setDisableSave] = useState(true);
  const [savingCategoryMap, setSavingCategoryMap] = useState(false);
  const [fields, setFields] = useState({
    categoryInput: "",
    subCategoryInput: "",
  });

  function handleActiveCategory(category) {
    dispatch(updateActiveCategory(category));
  }

  function handleActiveSubCategory(category) {
    dispatch(updateActiveSubCategory(category));
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
        setDisableSave(false);
        setFields({ ...fields, categoryInput: "" });
      } catch (e) {
        onError(e);
      }
    }
  };

  function handleSubCategoryAdd(e) {
    e.preventDefault();
    if (fields.subCategoryInput !== "") {
      const { subCategoryInput } = fields;

      if (
        subCategoryInput !== "" ||
        !subCategories.includes(subCategoryInput)
      ) {
        try {
          dispatch(addNewSubCategory(subCategoryInput));
          setDisableSave(false);
          setFields({ ...fields, subCategoryInput: "" });
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
      {isEdit && (
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
      )}
      <div>
        <div>
          {isEdit && (
            <form onSubmit={handleAddCetagory}>
              <div className="categories-form-group">
                <div className="form-group">
                  {isEdit && <h3>Categories</h3>}
                  <input
                    className="form-control"
                    type="text"
                    name="categoryInput"
                    value={fields.categoryInput}
                    onChange={handleFieldChange}
                    placeholder="New Category..."
                  />
                </div>
                <div className="form-group">
                  <button
                    type="submit"
                    className="btn btn-secondary form-control"
                    disabled={fields.categoryInput === ""}
                  >
                    Add
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
        <div>
          <ListContainer
            listItems={categories}
            activeItem={activeCategory}
            isEdit={isEdit}
						labelText={"Categories"}
            updateActiveItem={handleActiveCategory}
          />
        </div>
      </div>

      <div>
        <div>
          {isEdit && (
            <form onSubmit={handleSubCategoryAdd}>
              <div className="categories-form-group">
                <div className="form-group">
                  {isEdit && <h3>Subcategories</h3>}
                  <input
                    className="form-control"
                    type="text"
                    name="subCategoryInput"
                    value={fields.subCategoryInput}
                    onChange={handleFieldChange}
                    placeholder="New SubCategory..."
                  />
                </div>
                <div className="form-group">
                  <button
                    type="submit"
                    className="btn btn-secondary form-control"
                    disabled={fields.subCategoryInput === ""}
                  >
                    Add
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
        <div>
          <ListContainer
            listItems={subCategories}
            activeItem={activeSubCategory}
            isEdit={isEdit}
						labelText={"Subcategories"}
            updateActiveItem={handleActiveSubCategory}
          />
        </div>
      </div>
    </div>
  );
}

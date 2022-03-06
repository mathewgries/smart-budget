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
} from "../../redux/categoriesSlice";
import LoadingSpinner from "../../components/LoadingSpinner";
import ListContainer from "./ListContainer";
import { onError } from "../../lib/errorLib";

export default function Categories() {
  const history = useHistory();
  const dispatch = useDispatch();
  const isEdit = history.location.pathname === "/categories";
  const categoryMap = useSelector(selectCategoryMap);
  const categories = useSelector(selectAllCategories);
  const subCategories = useSelector(selectSubCategories);
  const [disableSave, setDisableSave] = useState(true);
  const [savingCategoryMap, setSavingCategoryMap] = useState(false);
  const [fields, setFields] = useState({
    categoryInput: "",
    subCategoryInput: "",
  });

  function handleActiveCategory(e) {
    const category = e.target.innerText;
    dispatch(updateActiveCategory(category));
  }

  function handleActiveSubCategory(e) {
    const category = e.target.innerText;
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
        <header>
          <h3>Categories</h3>
        </header>
        <div>
          {isEdit && (
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
          )}
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
          {isEdit && (
            <form onSubmit={handleSubCategoryAdd}>
              <div className="form-group">
                <input
                  className="form-control"
                  type="text"
                  name="subCategoryInput"
                  value={fields.subCategoryInput}
                  onChange={handleFieldChange}
                  placeholder="New SubCategory..."
                />
              </div>
              <button
                type="submit"
                className="btn btn-secondary"
                disabled={fields.subCategoryInput === ""}
              >
                Add
              </button>
            </form>
          )}
        </div>
        <div>
          <ListContainer
            listItems={subCategories}
            updateActiveItem={handleActiveSubCategory}
          />
        </div>
      </div>
    </div>
  );
}

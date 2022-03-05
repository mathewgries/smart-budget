import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  selectAllCategories,
  selectActiveCategory,
  selectSubcategories,
  selectActiveSubcategory,
  updateActiveCategory,
  updateActiveSubcategory,
} from "../../redux/categoriesSlice";
import ListContainer from "./ListContainer";
import { onError } from "../../lib/errorLib";

export default function Categories() {
  const history = useHistory();
  const dispatch = useDispatch();
  const categories = useSelector(selectAllCategories);
  const activeCategory = useSelector(selectActiveCategory);
  const subcategories = useSelector(selectSubcategories);
  const activeSubcategory = useSelector(selectActiveSubcategory);
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

  function handleCategoryAdd(e) {
    e.preventDefault();

    // if (fields.categoryInput !== "") {
    //   const newCategory = fields.categoryInput;
    //   setCategories({ ...categories, [newCategory]: [] });
    //   setCategoryNames((prev) => [...prev, newCategory]);
    //   setActiveCategory(newCategory);
    //   setActiveList([]);
    //   setFields({ ...fields, categoryInput: "" });
    // }
  }

  function handleSubcategoryAdd(e) {
    e.preventDefault();
    // if (fields.subcategoryInput !== "") {
    //   const newSubcategory = fields.subcategoryInput;

    //   setCategories({
    //     ...categories,
    //     [activeCategory]: [...categories[activeCategory], newSubcategory],
    //   });

    //   setActiveList([...activeList, newSubcategory]);
    //   setFields({ ...fields, subcategoryInput: "" });
    // }
  }

  // function saveCategories(categories) {
  //   return API.put("smartbudget", "/categories", {
  //     body: categories,
  //   });
  // }

  async function handleSave(e) {
    e.preventDefault();
    // setIsLoading(true);
    // try {
    //   await saveCategories(categories);
    //   history.push("/");
    // } catch (e) {
    //   onError(e);
    //   setIsLoading(false);
    // }
  }

  return (
    <div>
      <div>
        <form onSubmit={handleSave}>
          <div>
            <button type="submit" className="btn btn-primary">
              Save Changes
            </button>
          </div>
        </form>
      </div>

      <div>
        <header>
          <h3>Categories</h3>
        </header>
        <div>
          <form onSubmit={handleCategoryAdd}>
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
            <button type="submit" className="btn btn-secondary">
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
                name="subCategoryInput"
                value={fields.subcategoryInput}
                onChange={handleFieldChange}
                placeholder="New Subcategory..."
              />
            </div>
            <button type="submit" className="btn btn-secondary">
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

import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { API } from "aws-amplify";
import ListContainer from "./ListContainer";
import { onError } from "../../lib/errorLib";

export default function Categories() {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState(null);
  const [categoryNames, setCategoryNames] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeList, setActiveList] = useState(null);
  const [fields, setFields] = useState({
    categoryInput: "",
    subCategoryInput: "",
  });

  useEffect(() => {
    function loadCategories() {
      return API.get("smartbudget", `/categories`);
    }

    async function onLoad() {
      try {
        const categories = await loadCategories();
        const keys = Object.keys(categories.categoryMap);
        setCategoryNames(keys);
        setCategories(categories.categoryMap);
        setActiveCategory(keys[0]);
        setActiveList(categories.categoryMap[keys[0]]);
      } catch (e) {
        onError(e);
      }

      setIsLoading(false);
    }

    onLoad();
  }, []);

  function handleActiveCategory(e) {
    const category = e.target.innerText;
    setActiveCategory(category);
    setActiveList(categories[category]);
  }

  function handleFieldChange(e) {
    const { name, value } = e.target;
    setFields({ ...fields, [name]: value });
  }

  function handleCategoryAdd(e) {
    e.preventDefault();

    if (fields.categoryInput !== "") {
      const newCategory = fields.categoryInput;
      setCategories({ ...categories, [newCategory]: [] });
      setCategoryNames((prev) => [...prev, newCategory]);
      setActiveCategory(newCategory);
      setActiveList([]);
      setFields({ ...fields, categoryInput: "" });
    }
  }

  function handleSubCategoryAdd(e) {
    e.preventDefault();
    if (fields.subCategoryInput !== "") {
      const newSubCategory = fields.subCategoryInput;

      setCategories({
        ...categories,
        [activeCategory]: [...categories[activeCategory], newSubCategory],
      });

      setActiveList([...activeList, newSubCategory]);
      setFields({ ...fields, subCategoryInput: "" });
    }
  }

  function saveCategories(categories) {
    return API.put("smartbudget", "/categories", {
      body: categories,
    });
  }

  async function handleSave(e) {
    e.preventDefault();
    setIsLoading(true);
    try {
      await saveCategories(categories);
      history.push("/");
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
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
              />
            </div>
            <button type="submit" className="btn btn-secondary">
              Add
            </button>
          </form>
        </div>
        <div>
          <ListContainer
            isLoading={isLoading}
            listItems={categoryNames}
            updateActiveItem={handleActiveCategory}
          />
        </div>
      </div>

      <div>
        <header>
          <h3>Sub Categories</h3>
        </header>
        <div>
          <form onSubmit={handleSubCategoryAdd}>
            <div className="form-group">
              <input
                className="form-control"
                type="text"
                name="subCategoryInput"
                value={fields.subCategoryInput}
                onChange={handleFieldChange}
              />
            </div>
            <button type="submit" className="btn btn-secondary">
              Add
            </button>
          </form>
        </div>
        <div>
          <ListContainer isLoading={isLoading} listItems={activeList} />
        </div>
      </div>
    </div>
  );
}

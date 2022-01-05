import React, { useState, useEffect } from "react";
import { API } from "aws-amplify";
import Form from "react-bootstrap/Form";
import { useFormFields } from "../../lib/hooksLib";
import { onError } from "../../lib/errorLib";

export default function EditCategories() {
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState();
  const [fields, handleFieldChange] = useFormFields({
    categoryName: "",
    subCategoryName: "",
  });

  useEffect(() => {
    function loadCategories() {
      return API.get("smartbudget", "/categories");
    }

    async function onLoad() {
      try {
        const categories = await loadCategories();
      } catch (e) {
        onError(e);
      }

      setIsLoading(false);
    }

    onLoad();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();

    setIsLoading(true);

    try {
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }

  function renderCategories() {
    return (
      <div>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="categoryName">
            <Form.Label>Category Name</Form.Label>
            <Form.Control
              type="text"
              value={fields.categoryName}
              onChange={handleFieldChange}
            />
          </Form.Group>
          <Form.Group controlId="subCategoryName">
            <Form.Label>Sub Category Name</Form.Label>
            <Form.Control
              type="text"
              value={fields.subCategoryName}
              onChange={handleFieldChange}
            />
          </Form.Group>
        </Form>
      </div>
    );
  }

  function renderLoading() {
    return <div>Is Loading</div>;
  }

  return <div>{!isLoading ? renderCategories() : renderLoading()}</div>;
}

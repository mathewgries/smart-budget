import React from "react";
import CategoriesSelector from "./CategoriesSelector";
import CategoriesForm from "./CategoriesForm";
import "./categories.css"

export default function Categories() {
  return (
    <div className="page-container">
      <div className="page-wrapper">
        <div className="form-wrapper">
          <section className="form-section">
            <CategoriesSelector />
          </section>
          <section>
            <form className="form-section">
              <CategoriesForm />
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}

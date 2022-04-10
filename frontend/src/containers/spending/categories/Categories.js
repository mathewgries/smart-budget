import React from "react";
import CategoriesSelector from "./CategoriesSelector";
import CategoriesForm from "./CategoriesForm";

export default function Categories() {
  

  return (
    <div className="page-container">
      <div className="page-wrapper">

        <div className="form-wrapper">
          <section>
            <CategoriesSelector/>
          </section>
          <section>
            <form>
              <CategoriesForm />
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}

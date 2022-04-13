import React from "react";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function AccountCardLoader(props) {
  const { isLoading, text } = props;

  return (
    <div className="categories-dropdown-section">
      <div className="dropdown form-group">
        <button
          className="btn"
          type="input"
          id="dropdownMenuButton"
          disabled={true}
        >
          {isLoading ? <LoadingSpinner /> : <div>{text}</div>}
        </button>
      </div>
    </div>
  );
}

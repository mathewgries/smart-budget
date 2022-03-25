import React from "react";

export default function ListContainer(props) {
  const { listItems, activeItem, updateActiveItem } = props;

  function handleOnChange(e) {
    const { value } = e.target;
    updateActiveItem(value);
  }

  return (
    <div className="category-list-wrapper">
      <div className="form-group">
        {!activeItem ? (
          <input
            className="form-control"
            readOnly={true}
            placeholder="No subcategories..."
          />
        ) : (
          <select
            className="form-control"
            value={activeItem}
            onChange={handleOnChange}
          >
            {listItems.map((element, index, arr) => (
              <option key={index} value={element}>
                {element}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
}

import React from "react";

export default function ListContainer(props) {
  const { listItems, updateActiveItem } = props;
	console.log(props)

  function handleClick(e) {
    if (updateActiveItem) updateActiveItem(e);
  }

  return (
    <div>
      {listItems.map((element, index, arr) => (
        <div key={index} onClick={handleClick}>
          {element}
        </div>
      ))}
    </div>
  );
}

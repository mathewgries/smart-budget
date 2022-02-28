import React from "react";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function ListContainer(props) {
  const { isLoading, listItems, updateActiveItem } = props;

	function handleClick(e){
		if(updateActiveItem) updateActiveItem(e)
	}

  return (
    <div>
      {isLoading ? (
        <div>
          <LoadingSpinner className={"spinning"} />
        </div>
      ) : (
        <div>
          {listItems.map((element, index, arr) => (
            <div key={index} onClick={handleClick}>
              {element}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

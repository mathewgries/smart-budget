import React from "react";

export default function TotalsBaraphBar(props) {
  const { value, max, displayTop } = props;

  function setHeight(value, max) {
		const result = ((value/max)* 85).toFixed(2);
    return result + "%";
  }

  return (
    <>
      {displayTop ? (
        <div
          className="bargraph-display-bar"
          style={{
            height: setHeight(value, max),
            backgroundColor: "#ee6c4d",
            borderLeft: value !== 0 ? "3px solid #98c1d9" : "none",
            borderTop: value !== 0 ? "3px solid #98c1d9" : "none",
            borderRight: value !== 0 ? "3px solid #3d5a80" : "none",
            borderBottom: "none",
          }}
        >
        </div>
      ) : (
        <div
          className="bargraph-display-bar"
          style={{
            height: setHeight(value * -1, max),
            backgroundColor: "#293241",
            borderLeft: value !== 0 ? "3px solid #98c1d9" : "none",
            borderBottom: value !== 0 ? "3px solid #3d5a80" : "none",
            borderRight: value !== 0 ? "3px solid #3d5a80" : "none",
            borderTop: "none",
          }}
        >
        </div>
      )}
    </>
  );
}

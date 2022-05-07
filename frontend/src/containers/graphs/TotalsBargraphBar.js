import React from "react";

export default function TotalsBaraphBar(props) {
  const { value, ratio, displayTop } = props;

  function setHeight(value, ratio) {
    const result = ((value * ratio));
    return result.toString() + "%";
  }

  return (
    <>
      {displayTop ? (
        <div
          className="bargraph-display-bar"
          style={{
            height: setHeight(value, ratio),
						backgroundColor: "#ee6c4d",
            borderLeft: value !== 0 ? "3px solid #3d5a80" : "none",
            borderTop: value !== 0 ? "3px solid #3d5a80" : "none",
            borderRight: value !== 0 ? "3px solid #98c1d9" : "none",
            borderBottom: "none",
          }}
        ></div>
      ) : (
        <div
          className="bargraph-display-bar"
          style={{
            height: setHeight(value, ratio),
						backgroundColor: "#293241",
            borderLeft: value !== 0 ? "3px solid #98c1d9" : "none",
            borderBottom: value !== 0 ? "3px solid #98c1d9" : "none",
            borderRight: value !== 0 ? "3px solid #3d5a80" : "none",
            borderTop: "none",
          }}
        ></div>
      )}
    </>
  );
}

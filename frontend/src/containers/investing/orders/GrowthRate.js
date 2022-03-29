import React from "react";

export default function GrowthRate(props) {
  const { growthRate } = props;

  return (
    <div className="component-container">
      <div className="component-wrapper">
        <div className="growth-rate-wrapper">
					{`${growthRate}`}
				</div>
      </div>
    </div>
  );
}

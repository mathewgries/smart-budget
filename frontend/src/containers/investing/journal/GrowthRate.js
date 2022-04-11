import React from "react";
import LoadingSpinner from "../../../components/LoadingSpinner";

export default function GrowthRate(props) {
  const { growthRate, isLoading } = props;

  return (
    <div className="component-container">
      <div className="component-wrapper">
        {!isLoading ? (
          <div className="growth-rate-wrapper">{growthRate}</div>
        ) : (
          <div>
            <LoadingSpinner />
          </div>
        )}
      </div>
    </div>
  );
}

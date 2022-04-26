import React from "react";
import LoadingSpinner from "../../../components/LoadingSpinner";
import "./journal.css"

export default function GrowthRate(props) {
  const { growthRate, isLoading } = props;

  return (
    <div className="component-container">
      <div className="component-wrapper">
        {!isLoading ? (
          <div>{growthRate}</div>
        ) : (
          <div>
            <LoadingSpinner />
          </div>
        )}
      </div>
    </div>
  );
}

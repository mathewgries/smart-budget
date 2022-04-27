import React from "react";
import LoadingSpinner from "../../../components/LoadingSpinner";
import "./journal.css";

export default function GrowthRate(props) {
  const { sign, growthRate, isLoading } = props;

  return (
    <div className="component-container">
      {!isLoading ? (
        <div>
          <div>{sign}</div>
          <div>{growthRate}</div>
        </div>
      ) : (
        <div>
          <LoadingSpinner />
        </div>
      )}
    </div>
  );
}

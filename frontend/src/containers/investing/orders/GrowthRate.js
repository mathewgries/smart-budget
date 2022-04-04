import React from "react";
import { useSelector } from "react-redux";
import LoadingSpinner from "../../../components/LoadingSpinner";

export default function GrowthRate(props) {
  const { growthRate } = props;
  const status = useSelector((state) => state.investingAccounts.status);

  return (
    <div className="component-container">
      <div className="component-wrapper">
        {status !== "pending" ? (
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

import React from "react";
import LoadingSpinner from "../../../components/LoadingSpinner";

export default function InvestingBalance(props) {
  const { accountBalance, isLoading } = props;

  return (
    <div className="component-container">
      <div className="component-wrapper">
        {!isLoading ? (
          <div className="investing-balance-wrapper">
            <div>Balance</div>
            <div>{accountBalance}</div>
          </div>
        ) : (
          <div>
            <LoadingSpinner text={"Loading"} />
          </div>
        )}
      </div>
    </div>
  );
}

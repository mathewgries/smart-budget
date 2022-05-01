import React from "react";
import LoadingSpinner from "../../../components/LoadingSpinner";
import "./journal.css";

export default function InvestingBalance(props) {
  const { accountBalance, isLoading } = props;

  return (
    <div className="component-container">
      {!isLoading ? (
        <div>
          <div>Balance</div>
          <div>${accountBalance}</div>
        </div>
      ) : (
        <div>
          <LoadingSpinner text={"Loading"} />
        </div>
      )}
    </div>
  );
}

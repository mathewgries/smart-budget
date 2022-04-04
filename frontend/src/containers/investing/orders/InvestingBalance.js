import React from "react";
import { useSelector } from "react-redux";
import LoadingSpinner from "../../../components/LoadingSpinner";

export default function InvestingBalance(props) {
  const { accountBalance } = props.account;
  const status = useSelector((state) => state.investingAccounts.status);

  return (
    <div className="component-container">
      <div className="component-wrapper">
        {status !== "pending" ? (
          <div className="investing-balance-wrapper">{accountBalance}</div>
        ) : (
          <div>
            <LoadingSpinner text={"Loading"} />
          </div>
        )}
      </div>
    </div>
  );
}

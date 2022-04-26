import React from "react";
import "./spendingAccounts.css";

export default function SpendingAccountCard(props) {
  const { account } = props;

  return (
    <div className="spending-account-card-container">
      <div>{account.accountName}</div>
      <div className="spending-account-card-balance">
        {`$${account.accountBalance}`}
      </div>
    </div>
  );
}

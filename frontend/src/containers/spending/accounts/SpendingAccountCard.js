import React from "react";
import "./spendingAccounts.css"

export default function SpendingAccountCard(props) {
  const { account } = props;

  return (
    <div className="account-card-container">
      <div>{account.accountName}</div>
      <div>{account.accountBalance}</div>
    </div>
  );
}

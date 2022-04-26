import React from "react";
import "./investingAccounts.css"

export default function InvestingAccountCard(props) {
  const { account } = props;

  return (
    <div className="account-card-container">
      <div>{account.accountName}</div>
      <div>{account.accountBalance}</div>
    </div>
  );
}

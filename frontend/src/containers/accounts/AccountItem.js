import React from "react";

export default function AccountItem(props) {
  const { accountName, accountBalance } = props.account;

  return (
    <div className="account-item-container">
      <p>{accountName}</p>
      <p>{`Balance: ${accountBalance}`}</p>
    </div>
  );
}

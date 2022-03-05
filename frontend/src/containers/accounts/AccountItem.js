import React from "react";

export default function AccountItem(props) {
  const { accountName, accountBalance } = props.account;

  return (
    <div>
      <p>{accountName}</p>
      <p>{accountBalance}</p>
    </div>
  );
}

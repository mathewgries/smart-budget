import React from "react";

export default function AccountItem({ props }) {
	const {accountName, accountBalance } = props;
  return (
    <div>
      <p>{accountName}</p>
			<p>{accountBalance}</p>
    </div>
  );
}

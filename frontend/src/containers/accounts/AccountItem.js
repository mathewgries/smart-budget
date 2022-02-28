import React from "react";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function AccountItem(props) {
  const { isLoading, account } = props;
  return (
    <div>
      {isLoading ? (
        <div>
          <LoadingSpinner />
        </div>
      ) : (
        <div>
          <p>{account.accountName}</p>
          <p>{account.accountBalance}</p>
        </div>
      )}
    </div>
  );
}

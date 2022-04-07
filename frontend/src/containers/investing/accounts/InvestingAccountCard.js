import React from "react";
import { useSelector } from "react-redux";
import LoadingSpinner from "../../../components/LoadingSpinner";

export default function InvestingAccountCard(props) {
  const { account } = props;
  const status = useSelector((state) => state.investingAccounts.status);

  return (
    <div className="account-card-container">
      {status === "pending" ? (
        <LoadingSpinner />
      ) : (
        <>
          <div>{account.accountName}</div>
          <div>{account.accountBalance}</div>
        </>
      )}
    </div>
  );
}

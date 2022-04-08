import React from "react";
import { Link } from "react-router-dom";
import SpendingAccountCard from "./SpendingAccountCard";
import AccountCardLoader from "../../loadingContainers/AccountCardLoader";

export default function SpendingAccountsList(props) {
  const { status, accounts } = props;

  return (
    <div className="account-list-container">
      {accounts.length > 0 && status !== "pending" ? (
        accounts.map((account) => (
          <div key={account.id} className="account-list-item-wrapper">
            <Link to={`spending/accounts/${account.id}`}>
              <SpendingAccountCard account={account} />
            </Link>
          </div>
        ))
      ) : (
        <AccountCardLoader status={status} text={"Add new account..."} />
      )}
    </div>
  );
}

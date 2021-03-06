import React from "react";
import { Link } from "react-router-dom";
import InvestingAccountCard from "./InvestingAccountCard";
import AccountCardLoader from "../../loadingContainers/AccountCardLoader";
import "./investingAccounts.css"

export default function InvestingAccountsList(props) {
  const { status, accounts } = props;

  return (
    <div className="investing-account-list-container">
      {accounts.length > 0 && status !== "pending" ? (
        accounts.map((account) => (
          <div key={account.id}>
            <Link to={`/investing/accounts/${account.id}`}>
              <InvestingAccountCard account={account} />
            </Link>
          </div>
        ))
      ) : (
        <AccountCardLoader
          status={status}
          text={"Add new account..."}
          path={"/investing/accounts/new"}
        />
      )}
    </div>
  );
}

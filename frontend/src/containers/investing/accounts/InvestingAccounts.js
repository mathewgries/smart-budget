import React from "react";
import { Link } from "react-router-dom";
import InvestingAccountsList from "./InvestingAccountsList";

export default function InvestingAccounts(props) {
  return (
    <div className="page-container">
      <div className="page-wrapper">
        <div className="page-list-wrapper">
          <div className="account-list-header-wrapper">
            <header className="account-list-header">
              <h5>Investing Accounts</h5>
            </header>
            <div>
              <Link to="/investing/accounts/new" className="btn btn-primary">
                Add
              </Link>
            </div>
          </div>
          <div className="accounts-list-section">
            <InvestingAccountsList />
          </div>
        </div>
      </div>
    </div>
  );
}

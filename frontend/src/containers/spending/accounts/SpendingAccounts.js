import React from "react";
import { Link } from "react-router-dom";
import SpendingAccountsList from "./SpendingAccountsList";

export default function SpendingAccounts(props) {
  return (
    <div className="page-container">
      <div className="page-wrapper">
        <div className="page-list-wrapper">
          <div className="account-list-header-wrapper">
            <header className="spending-accounts-list-header">
              <h5>Spending Accounts</h5>
            </header>
            <div>
              <Link to="/spending/accounts/new" className="btn btn-primary">
                Add
              </Link>
            </div>
          </div>
          <div className="spending-accounts-list-section">
            <SpendingAccountsList />
          </div>
        </div>
      </div>
    </div>
  );
}

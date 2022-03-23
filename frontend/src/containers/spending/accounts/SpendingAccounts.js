import React from "react";
import SpendingAccountsList from "./SpendingAccountsList";
import "../style.css";

export default function SpendingAccounts(props) {
  return (
    <div className="page-container">
      <div className="page-wrapper">
        <div className="page-list-wrapper">
          <header className="spending-accounts-list-header">
            <h5>Spending Accounts</h5>
          </header>
          <div className="spending-accounts-list-section">
            <SpendingAccountsList />
          </div>
        </div>
      </div>
    </div>
  );
}

import React from "react";
import InvestingAccountsList from "./InvestingAccountsList";
import "../style.css";

export default function InvestingAccounts(props) {
  return (
    <div className="page-container">
      <div className="page-wrapper">
        <div className="page-list-wrapper">
          <header className="accounts-list-header">
            <h5>Investing Accounts</h5>
          </header>
          <div className="accounts-list-section">
            <InvestingAccountsList />
          </div>
        </div>
      </div>
    </div>
  );
}

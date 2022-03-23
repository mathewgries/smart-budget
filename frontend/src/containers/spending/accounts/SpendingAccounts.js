import React from "react";
import SpendingAccountsList from "./SpendingAccountsList";
import "../style.css";

export default function SpendingAccounts(props) {
  return (
    <div className="spending-accounts-container">
      <div className="spending-accounts-wrapper">
        <section className="accounts-list-header">
          <header>Spending Accounts</header>
        </section>
        <section className="accounts-list-wrapper">
          <SpendingAccountsList pageStyle={"account-list-style"} />
        </section>
      </div>
    </div>
  );
}

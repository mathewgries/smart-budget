import React from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectSpendingAccountById } from "../../../redux/spending/spendingAccountsSlice";
import SpendingAccountCard from "./SpendingAccountCard";
import SpendingTransactionsList from "../transactions/SpendingTransactionsList";
import "../style.css";

export default function SpendingAccount() {
  const { id } = useParams();
  const account = useSelector((state) => selectSpendingAccountById(state, id));

  return (
    <div className="page-container">
      <div className="page-wrapper">
        <div className="spending-account-wrapper">
          <section className="account-card-section">
            <header>
              <h6>Account</h6>
            </header>
            <SpendingAccountCard account={account} />
          </section>
          <section className="account-transaction-list-section">
            <div>
              <header>
                <h6>Transactions</h6>
              </header>
            </div>
            <SpendingTransactionsList accountId={account.GSI1_PK} />
          </section>
        </div>
      </div>
    </div>
  );
}

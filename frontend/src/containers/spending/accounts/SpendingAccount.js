import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectSpendingAccountById } from "../../../redux/spending/spendingAccountsSlice";
import SpendingAccountCard from "./SpendingAccountCard";
import SpendingTransactionsList from "../transactions/SpendingTransactionsList";
import "../style.css";

export default function SpendingAccount() {
  const { id } = useParams();
  const account = useSelector((state) => selectSpendingAccountById(state, id));
  const [isEdit, setIsEdit] = useState(false);
  const [isNewTransaction, setIsNewTransaction] = useState(false);

  function toggleAccountEdit() {
    setIsEdit((prev) => !prev);
  }

  function toggleIsNewTransaction() {
    setIsNewTransaction((prev) => !prev);
  }

  return (
    <div className="spending-account-container">
      <section className="spending-account-info-header">
        <header>Account Info</header>
      </section>
      <div className="spending-account-wrapper">
        <section className="spending-account-info-section">
          <div>
            <SpendingAccountCard account={account} />
          </div>
        </section>

        <section className="spending-account-transaction-list-section">
          <div className="spending-account-transaction-list-header">
            <header>Transactions</header>
          </div>
          <div>
            <SpendingTransactionsList accountId={account.GSI1_PK} />
          </div>
        </section>
      </div>
    </div>
  );
}

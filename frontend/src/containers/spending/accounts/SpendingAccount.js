import React from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectSpendingAccountById } from "../../../redux/spending/spendingAccountsSlice";
import { Link } from "react-router-dom";
import SpendingAccountCard from "./SpendingAccountCard";
import SpendingTransactionsList from "../transactions/SpendingTransactionsList";
import "../style.css";

export default function SpendingAccount() {
  const { id } = useParams();
  const account = useSelector((state) => selectSpendingAccountById(state, id));

  return (
    <div className="page-container">
      <div className="page-wrapper">
        <div className="account-wrapper">
          <section className="account-card-section">
            <header>
              <h6>Account</h6>
            </header>
            <div>
              <SpendingAccountCard account={account} />
            </div>
            <section className="account-btn-section">
              <div className="account-btn-wrapper">
                <Link
                  to={`/spending/accounts/edit/${id}`}
                  className="btn btn-primary form-control"
                >
                  Edit Account
                </Link>
              </div>
              <div className="account-btn-wrapper">
                <Link
                  to={`/spending/transactions/new/${id}`}
                  className="btn btn-success form-control"
                >
                  Add Transaction
                </Link>
              </div>
            </section>
          </section>
          <section className="transaction-list-section">
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

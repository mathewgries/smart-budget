import React from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectInvestingAccountById } from "../../../redux/investing/investingAccountsSlice";
import { Link } from "react-router-dom";
import InvestingAccountCard from "./InvestingAccountCard";
import InvestingTransactionsList from "../transactions/InvestingTransactionsList";
import "../style.css";

export default function InvestingAccount() {
  const { id } = useParams();
  const account = useSelector((state) => selectInvestingAccountById(state, id));

  return (
    <div className="page-container">
      <div className="page-wrapper">
        <div className="account-wrapper">
          <section className="account-card-section">
            <header>
              <h6>Account</h6>
            </header>
            <div>
              <InvestingAccountCard account={account} />
            </div>
            <section className="account-btn-section">
              <div className="account-btn-wrapper">
                <Link
                  to={`/investing/accounts/edit/${id}`}
                  className="btn btn-primary form-control"
                >
                  Edit Account
                </Link>
              </div>
              <div className="account-btn-wrapper">
                <Link
                  to={`/investing/transactions/new/${id}`}
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
            <InvestingTransactionsList accountId={account.GSI1_PK} />
          </section>
        </div>
      </div>
    </div>
  );
}

import React from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectInvestingTransactionById } from "../../../redux/investing/investingTransactionsSlice";
import InvestingTransactionCard from "./InvestingTransactionCard";
import InvestingTransactionButtons from "./InvestingTransactionButtons";
import "../style.css";

export default function InvestingTransaction(props) {
  const { id } = useParams();
  const transaction = useSelector((state) =>
    selectInvestingTransactionById(state, id)
  );

  const { transactionNote } = transaction;

  return (
    <div className="page-container">
      <div className="page-wrapper">
        <div className="transaction-wrapper">
          <section>
            <header>
              <h6>Transaction Detail</h6>
            </header>
          </section>
          <section className="transaction-info-section">
            <InvestingTransactionCard transaction={transaction} />
          </section>
          <section className="transaction-btn-wrapper">
            <InvestingTransactionButtons transactionId={id} />
          </section>
          <section className="transaction-note-section">
            <div className="transaction-note-header">
              <header>
                <h6>Note:</h6>
              </header>
            </div>
            <div>{transactionNote}</div>
          </section>
        </div>
      </div>
    </div>
  );
}

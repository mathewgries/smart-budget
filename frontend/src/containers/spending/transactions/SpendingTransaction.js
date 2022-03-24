import React from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectSpendingTransactionById } from "../../../redux/spending/spendingTransactionsSlice";
import SpendingTransactionCard from "./SpendingTransactionCard";
import SpendingTransactionButtons from "./SpendingTransactionButtons";
import "../style.css";

export default function SpendingTransaction(props) {
  const { id } = useParams();
  const transaction = useSelector((state) =>
    selectSpendingTransactionById(state, id)
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
            <SpendingTransactionCard transaction={transaction} />
          </section>
          <section className="transaction-btn-wrapper">
            <SpendingTransactionButtons transactionId={id}/>
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

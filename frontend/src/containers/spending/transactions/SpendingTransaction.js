import React from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectSpendingTransactionById } from "../../../redux/spending/spendingTransactionsSlice";
import SpendingTransactionCard from "./SpendingTransactionCard";
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
        <div className="spending-transaction-wrapper">
          <section className="spending-transaction-info-section">
            <SpendingTransactionCard transaction={transaction} />
          </section>
          <section className="spending-transaction-note-section">
            <div className="spending-transaction-note-header">
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

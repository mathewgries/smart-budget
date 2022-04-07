import React from "react";
import { Link } from "react-router-dom";
import SpendingTransactionCard from "./SpendingTransactionCard";

export default function SpendingTransactionsList(props) {
  const { transactions } = props;

  return (
    <div className="transaction-list-container">
      <div className="page-list-wrapper">
        {transactions.map((transaction, index, arr) => (
          <div key={transaction.id} className="transaction-list-item-wrapper">
            <Link to={`/spending/transactions/${transaction.id}`}>
              <SpendingTransactionCard transaction={transaction} />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

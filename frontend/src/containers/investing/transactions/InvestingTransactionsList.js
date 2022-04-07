import React from "react";
import { Link } from "react-router-dom";
import InvestingTransactionCard from "./InvestingTransactionCard";

export default function InvestingTransactionsList(props) {
	const {transactions} = props

  return (
    <div className="transaction-list-container">
      <div className="page-list-wrapper">
        {transactions.map((transaction, index, arr) => (
          <div key={transaction.id} className="transaction-list-item-wrapper">
            <Link to={`/investing/transactions/${transaction.id}`}>
              <InvestingTransactionCard transaction={transaction} />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

import React from "react";
import { useSelector } from "react-redux";
import { selectSpendingTransactionsByAccountId } from "../../../redux/spending/spendingTransactionsSlice";
import { Link } from "react-router-dom";
import SpendingTransactionCard from "./SpendingTransactionCard";
import "../style.css";

export default function SpendingTransactionsList(props) {
  const transactions = useSelector((state) =>
    selectSpendingTransactionsByAccountId(state, props.accountId)
  );

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

import React from "react";
import { useSelector } from "react-redux";
import { selectTransactionsByAccountId } from "../../redux/transactionsSlice";
import { Link } from "react-router-dom";

export default function TransactionList(props) {
  const transactions = useSelector((state) =>
    selectTransactionsByAccountId(state, props.accountId)
  );

  return (
    <div>
      {transactions.map((transaction, index, arr) => (
        <div key={index}>
          <Link to={`/transactions/${transaction.id}`}>
            <p>{transaction.category}</p>
            <p>{transaction.subCategory}</p>
            <p>{transaction.transactionAmount}</p>
            <p>{new Date(transaction.transactionDate).toLocaleDateString()}</p>
            <p>{transaction.transactionNote}</p>
            <p>{transaction.transactionType}</p>
          </Link>
        </div>
      ))}
    </div>
  );
}

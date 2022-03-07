import React from "react";
import { useSelector } from "react-redux";
import { selectTransactionsByAccountId } from "../../redux/transactionsSlice";
import { Link } from "react-router-dom";
import "./style.css";

export default function TransactionList(props) {
  const transactions = useSelector((state) =>
    selectTransactionsByAccountId(state, props.accountId)
  );

  return (
    <div className="transaction-list-container">
      {transactions.map((transaction, index, arr) => (
        <div key={index} className="transaction-list-item-wrapper">
          <Link to={`/transactions/${transaction.id}`}>
            <div className="transaction-list-item">
              <div>
                <span>Amount:</span>
                <p>{transaction.transactionAmount}</p>
              </div>
              <div>
                <span>Type:</span>
                <p>
                  {transaction.transactionType === "W"
                    ? "Withdrawal"
                    : "Deposit"}
                </p>
              </div>
              <div>
                <span>Category:</span>
                <p>{transaction.category}</p>
              </div>
              <div>
                <span>Date:</span>
                <p>
                  {new Date(transaction.transactionDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}

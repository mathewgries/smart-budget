import React from "react";
import { Link } from "react-router-dom";
import SpendingTransactionCard from "./SpendingTransactionCard";
import TransactionCardLoader from "../../loadingContainers/TransactionCardLoader";
import "./spendingTransactions.css";

export default function SpendingTransactionsList(props) {
  const { status, account, transactions } = props;
  const sortedTrans = transactions.sort(
    (a, b) => b.transactionDate - a.transactionDate
  );

  return (
    <div className="spending-transaction-list-container">
      <div>
        {transactions.length > 0 && status !== "pending" ? (
          sortedTrans
            .map((transaction) => (
              <div key={transaction.id}>
                <Link to={`/spending/transactions/${transaction.id}`}>
                  <SpendingTransactionCard transaction={transaction} />
                </Link>
              </div>
            ))
        ) : (
          <TransactionCardLoader
            status={status}
            text={"Add new transactions..."}
            path={`/spending/transactions/new/${account.id}`}
          />
        )}
      </div>
    </div>
  );
}

import React from "react";
import { Link } from "react-router-dom";
import InvestingTransactionCard from "./InvestingTransactionCard";
import TransactionCardLoader from "../../loadingContainers/TransactionCardLoader";
import "./investingTransactions.css";

export default function InvestingTransactionsList(props) {
  const { status, account, transactions } = props;
  const sortedTrans = transactions.sort(
    (a, b) => b.transactionDate - a.transactionDate
  );

  return (
    <div className="investing-transaction-list-container">
      <div>
        {transactions.length > 0 && status !== "pending" ? (
          sortedTrans.map((transaction) => (
            <div key={transaction.id}>
              <Link to={`/investing/transactions/${transaction.id}`}>
                <InvestingTransactionCard transaction={transaction} />
              </Link>
            </div>
          ))
        ) : (
          <TransactionCardLoader
            status={status}
            text={"Add new transactions..."}
            path={`/investing/transactions/new/${account.id}`}
          />
        )}
      </div>
    </div>
  );
}

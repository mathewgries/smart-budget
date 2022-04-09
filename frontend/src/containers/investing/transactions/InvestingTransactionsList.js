import React from "react";
import { Link } from "react-router-dom";
import InvestingTransactionCard from "./InvestingTransactionCard";
import TransactionCardLoader from "../../loadingContainers/TransactionCardLoader";

export default function InvestingTransactionsList(props) {
  const { status, account, transactions } = props;

  return (
    <div className="transaction-list-container">
      <div className="page-list-wrapper">
        {transactions.length > 0 && status !== "pending" ? (
          transactions.map((transaction) => (
            <div key={transaction.id} className="transaction-list-item-wrapper">
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

import React from "react";
import { useSelector } from "react-redux";
import { selectSpendingTransactionsByGSI } from "../../../redux/spending/spendingTransactionsSlice";
import { Link } from "react-router-dom";
import SpendingTransactionCard from "./SpendingTransactionCard";

export default function SpendingTransactionsList(props) {
  const { account } = props;
  const transactions = useSelector((state) =>
    selectSpendingTransactionsByGSI(state, account.GSI1_PK)
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

import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { selectInvestingTransactionsByGSI } from "../../../redux/investing/investingTransactionsSlice";
import InvestingTransactionCard from "./InvestingTransactionCard";

export default function InvestingTransactionsList(props) {
  const transactions = useSelector((state) =>
    selectInvestingTransactionsByGSI(state, props.accountGSI)
  );

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

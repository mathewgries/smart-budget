import React from "react";
import { useSelector } from "react-redux";
import { selectInvestingTransactionsByAccountId } from "../../../redux/investing/investingTransactionsSlice";
import { Link } from "react-router-dom";
import InvestingTransactionCard from './InvestingTransactionCard'
import "../style.css";

export default function InvestingTransactionsList(props) {
  const transactions = useSelector((state) =>
	selectInvestingTransactionsByAccountId(state, props.accountId)
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

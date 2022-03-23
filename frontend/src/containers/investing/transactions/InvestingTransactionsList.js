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
    <div className="spending-transaction-list-container">
      <div className="page-list-wrapper">
        {transactions.map((transaction, index, arr) => (
          <div key={transaction.id} className="spending-transaction-list-item-wrapper">
            <Link to={`/investing/transactions/${transaction.id}`}>
              <InvestingTransactionCard transaction={transaction} />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );

  // return (
  //   <div className="transaction-list-container">
  //     {investingTransactions.map((transaction, index, arr) => (
  //       <div key={transaction.id} className="transaction-list-item-wrapper">
  //         <Link to={`/investing/transactions/${transaction.id}`}>
  //           <div className="transaction-list-item">
  //             <div>
  //               <span>Amount:</span>
  //               <p>{transaction.transactionAmount}</p>
  //             </div>
  //             <div>
  //               <span>Type:</span>
  //               <p>
  //                 {transaction.transactionType === "W"
  //                   ? "Withdrawal"
  //                   : "Deposit"}
  //               </p>
  //             </div>
  //             <div>
  //               <span>Date:</span>
  //               <p>
  //                 {new Date(transaction.transactionDate).toLocaleDateString()}
  //               </p>
  //             </div>
  //           </div>
  //         </Link>
  //       </div>
  //     ))}
  //   </div>
  // );
}

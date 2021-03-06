import React from "react";
import { dateToString } from "../../../helpers/dateFormat";
import "./investingTransactions.css"

export default function InvestingTransactionCard(props) {
  const { transaction } = props;

  const displayAmount =
    transaction.transactionType === "W"
      ? (Number.parseFloat(transaction.transactionAmount) * -1).toFixed(2)
      : transaction.transactionAmount;

  return (
    <div className="investing-transaction-card-container">
      <section>
        <div>{displayAmount}</div>
      </section>
      <section>
        <div>{dateToString(transaction.transactionDate)}</div>
      </section>
    </div>
  );
}

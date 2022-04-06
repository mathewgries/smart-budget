import React from "react";
import { dateToString } from "../../../helpers/dateFormat";

export default function SpendingTransactionCard(props) {
  const { transaction } = props;

  const displayAmount =
    transaction.transactionType === "W"
      ? (Number.parseFloat(transaction.transactionAmount) * -1).toFixed(2)
      : transaction.transactionAmount;

  return (
    <div className="spending-transaction-card-container">
      <section>
        <div>{displayAmount}</div>
        <div>{`${transaction.categoryName}: ${transaction.subcategory}`}</div>
      </section>
      <section>
        <div>
          <div className="transaction-card-date-wrapper">
            {dateToString(transaction.transactionDate)}
          </div>
        </div>
      </section>
    </div>
  );
}

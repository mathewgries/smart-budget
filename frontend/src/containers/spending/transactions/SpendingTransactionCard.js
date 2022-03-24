import React from "react";

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
        <div>{`${transaction.category}: ${transaction.subCategory}`}</div>
      </section>
      <section>
        <div>
          <div className="transaction-card-date-wrapper">
            {new Date(transaction.transactionDate).toLocaleDateString()}
          </div>
        </div>
      </section>
    </div>
  );
}

import React from "react";

export default function InvestingTransactionCard(props) {
  const { transaction } = props;

  const displayAmount =
    transaction.transactionType === "W"
      ? (Number.parseFloat(transaction.transactionAmount) * -1).toFixed(2)
      : transaction.transactionAmount;

  return (
    <div className="spending-transaction-card-container">
      <section>
        <div>{displayAmount}</div>
      </section>
      <section>
        <div>{new Date(transaction.transactionDate).toLocaleDateString()}</div>
      </section>
    </div>
  );
}
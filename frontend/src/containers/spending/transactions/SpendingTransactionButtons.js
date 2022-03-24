import React from "react";
import { Link } from "react-router-dom";

export default function SpendingTransactionButtons(props) {
  const { transactionId } = props;
  return (
    <div className="transaction-card-btn-container">
      <div>
        <Link
          to={`/spending/transactions/edit/${transactionId}`}
          className="btn btn-primary"
        >
          Edit
        </Link>
      </div>
      <div>
        <button className="btn btn-danger">Delete</button>
      </div>
    </div>
  );
}

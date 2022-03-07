import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectTransactionById } from "../../redux/transactionsSlice";
import { selectAccountById } from "../../redux/accountsSlice";
import TransactionForm from "./TransactionForm";

export default function Transaction(props) {
  const { id } = useParams();
  const transaction = useSelector((state) => selectTransactionById(state, id));
  const account = useSelector((state) =>
    selectAccountById(state, transaction.GSI1_PK.replace("ACCT#", ""))
  );
  const [isEdit, setIsEdit] = useState(false);

  function handleIsEditToggle() {
    setIsEdit((prev) => !prev);
  }

  const {
    category,
    subCategory,
    transactionAmount,
    transactionDate,
    transactionNote,
    transactionType,
  } = transaction;

  return (
    <div className="transaction-container">
      <div>
        {isEdit ? (
          <TransactionForm
            account={account}
            transaction={transaction}
            editForm={true}
          />
        ) : (
          <div className="transaction-detail-wrapper">
            <div>
              <h3>Transaction</h3>
            </div>
            <div className="transaction-detail">
              <div>
                <p>Amount: {transactionAmount}</p>
              </div>
              <div>
                <p>Type: {transactionType === "W" ? "Withdrawal" : "Deposit"}</p>
              </div>
              <div>
                <p>Category: {category}</p>
              </div>
              <div>
                <p>Subcategory: {subCategory}</p>
              </div>
              <div>
                <p>Date: {new Date(transactionDate).toLocaleDateString()}</p>
              </div>
              <div>
								<span>Note:</span>
                <p>{transactionNote}</p>
              </div>
            </div>
            <div className="form-group">
              <button
                className="btn btn-primary form-control"
                onClick={handleIsEditToggle}
              >
                {isEdit ? "Cancel" : "Edit"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

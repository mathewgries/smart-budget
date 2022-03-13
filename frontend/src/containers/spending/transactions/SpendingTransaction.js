import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectSpendingTransactionById } from "../../../redux/spending/spendingTransactionsSlice";
import { selectSpendingAccountById } from "../../../redux/spending/spendingAccountsSlice";
import SpendingTransactionForm from "./SpendingTransactionForm";
import "../style.css"

export default function SpendingTransaction(props) {
  const { id } = useParams();
  const spendingTransaction = useSelector((state) => selectSpendingTransactionById(state, id));
  const spendingAccount = useSelector((state) =>
    selectSpendingAccountById(state, spendingTransaction.GSI1_PK.replace("ACCT#SPENDING#", ""))
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
  } = spendingTransaction;

  return (
    <div className="transaction-container">
      <div>
        {isEdit ? (
          <SpendingTransactionForm
            spendingAccount={spendingAccount}
            spendingTransaction={spendingTransaction}
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

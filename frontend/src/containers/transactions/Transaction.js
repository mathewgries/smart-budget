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
    <div>
      <div className="form-group">
        <button
          className="btn btn-primary form-control"
          onClick={handleIsEditToggle}
        >
          {isEdit ? "Cancel" : "Edit"}
        </button>
      </div>
      <div>
        {isEdit ? (
          <TransactionForm
            account={account}
            transaction={transaction}
            editForm={true}
          />
        ) : (
          <div>
            <p>{category}</p>
            <p>{subCategory}</p>
            <p>{transactionAmount}</p>
            <p>{new Date(transactionDate).toLocaleDateString()}</p>
            <p>{transactionNote}</p>
            <p>{transactionType}</p>
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectInvestingTransactionById } from "../../../redux/investing/investingTransactionsSlice";
import { selectInvestingAccountById } from "../../../redux/investing/investingAccountsSlice";
import InvestingTransactionForm from "./InvestingTransactionForm";
import "../style.css"

export default function InvestingTransaction(props) {
  const { id } = useParams();
  const investingTransaction = useSelector((state) => selectInvestingTransactionById(state, id));
  const investingAccount = useSelector((state) =>
	selectInvestingAccountById(state, investingTransaction.GSI1_PK.replace("ACCT#INVESTING#", ""))
  );
  const [isEdit, setIsEdit] = useState(false);

  function handleIsEditToggle() {
    setIsEdit((prev) => !prev);
  }

  const {
    transactionAmount,
    transactionDate,
    transactionNote,
    transactionType,
  } = investingTransaction;

  return (
    <div className="transaction-container">
      <div>
        {isEdit ? (
          <InvestingTransactionForm
            investingAccount={investingAccount}
            investingTransaction={investingTransaction}
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

import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectSpendingAccountById } from "../../../redux/spending/spendingAccountsSlice";
import AccountItem from "../../AccountItem";
import SpendingAccountEdit from "./SpendingAccountEdit";
import SpendingTransactionsList from "../transactions/SpendingTransactionsList"
import SpendingTransactionForm from "../transactions/SpendingTransactionForm";
import "../style.css"

export default function SpendingAccount() {
  const { id } = useParams();
  const spendingAccount = useSelector((state) => selectSpendingAccountById(state, id));
  const [isEdit, setIsEdit] = useState(false);
  const [isNewTransaction, setIsNewTransaction] = useState(false);

  function toggleAccountEdit() {
    setIsEdit((prev) => !prev);
  }

  function toggleIsNewTransaction() {
    setIsNewTransaction((prev) => !prev);
  }

  return (
    <div className="account-wrapper">
			<div>
				<h3>Account</h3>
			</div>
      <div className="account-info-wrapper">
        <div>
          {!isEdit ? (
            <div className="account-item-wrapper">
              <AccountItem account={spendingAccount} />
            </div>
          ) : (
            <div>
              <SpendingAccountEdit
                spendingAccount={spendingAccount}
                toggleAccountEdit={toggleAccountEdit}
              />
            </div>
          )}
        </div>
        <div className="form-group">
          <button
            className="btn btn-primary form-control"
            onClick={toggleAccountEdit}
            disabled={isNewTransaction}
          >
            {isEdit ? "Cancel" : "Edit Account"}
          </button>
        </div>
      </div>

      <div>
        <div className="form-group">
          <button
            className="btn btn-success form-control"
            onClick={toggleIsNewTransaction}
            disabled={isEdit}
          >
            {isNewTransaction ? "Cancel" : "Add Transaction"}
          </button>
        </div>
        <div>
          {isNewTransaction && (
            <SpendingTransactionForm
              editForm={false}
              toggleIsNewTransaction={toggleIsNewTransaction}
              spendingAccount={spendingAccount}
            />
          )}
        </div>
      </div>
      <div>
        <SpendingTransactionsList accountId={spendingAccount.GSI1_PK} />
      </div>
    </div>
  );
}

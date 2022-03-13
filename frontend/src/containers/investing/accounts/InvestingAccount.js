import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectInvestingAccountById } from "../../../redux/investing/investingAccountsSlice";
import AccountItem from "../../AccountItem";
import InvestingAccountEdit from "./InvestingAccountEdit";
import InvestingTransactionForm from "../transactions/InvestingTransactionForm";
import InvestingTransactionList from "../transactions/InvestingTransactionList";

export default function InvestingAccount(props) {
  const { id } = useParams();
  const investingAccount = useSelector((state) =>
    selectInvestingAccountById(state, id)
  );
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
              <AccountItem account={investingAccount} />
            </div>
          ) : (
            <div>
              <InvestingAccountEdit
                investingAccount={investingAccount}
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
            <InvestingTransactionForm
              editForm={false}
              toggleIsNewTransaction={toggleIsNewTransaction}
              investingAccount={investingAccount}
            />
          )}
        </div>
      </div>
      <div>
        <InvestingTransactionList accountId={investingAccount.GSI1_PK} />
      </div>
    </div>
  );
}

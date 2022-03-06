import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAccountById } from "../../redux/accountsSlice";
import AccountItem from "./AccountItem";
import AccountEdit from "./AccountEdit";
import TransactionList from "../transactions/TransactionList";
import TransactionForm from "../transactions/TransactionForm";

export default function Account() {
  const { id } = useParams();
  const account = useSelector((state) => selectAccountById(state, id));
  const [isEdit, setIsEdit] = useState(false);
  const [isNewTransaction, setIsNewTransaction] = useState(false);

  function toggleAccountEdit() {
    setIsEdit((prev) => !prev);
  }

  function toggleIsNewTransaction() {
    setIsNewTransaction((prev) => !prev);
  }

  return (
    <div>
      <section>
        <div>
          {!isEdit ? (
            <div>
              <AccountItem account={account} />
            </div>
          ) : (
            <div>
              <AccountEdit
                account={account}
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
      </section>

      <section>
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
            <TransactionForm
              editForm={false}
              toggleIsNewTransaction={toggleIsNewTransaction}
              account={account}
            />
          )}
        </div>
      </section>
      <section>
        <TransactionList accountId={account.GSI1_PK} />
      </section>
    </div>
  );
}

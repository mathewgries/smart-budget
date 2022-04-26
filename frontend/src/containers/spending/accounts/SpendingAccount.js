import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  selectSpendingAccountById,
  deleteSpendingAccount,
} from "../../../redux/spending/spendingAccountsSlice";
import { selectSpendingTransactionsByGSI } from "../../../redux/spending/spendingTransactionsSlice";
import { Link } from "react-router-dom";
import { onError } from "../../../lib/errorLib";
import SpendingAccountCard from "./SpendingAccountCard";
import SpendingTransactionsList from "../transactions/SpendingTransactionsList";
import AccountCardLoader from "../../loadingContainers/AccountCardLoader";
import ConfirmationPopup from "../../popups/ConfirmationPopup";
import "./spendingAccounts.css";

const ConfirmMessage = () => {
  return (
    <div>
      <p>You are about to delete an account!</p>
      <p>This will remove all related transactions as well!</p>
      <p>Please confirm!</p>
    </div>
  );
};

export default function SpendingAccount() {
  const { id } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const status = useSelector((state) => state.spendingAccounts.status);
  const account = useSelector((state) => selectSpendingAccountById(state, id));
  const transactions = useSelector((state) =>
    selectSpendingTransactionsByGSI(state, account.GSI1_PK)
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [showConfrim, setShowConfirm] = useState(false);

  useEffect(() => {
    if (status === "pending" && !isLoading) {
      setIsLoading(true);
    } else if (status !== "pending" && isLoading) {
      setIsLoading(false);
    }
  }, [status, isLoading]);

  useEffect(() => {
    if (isDelete) {
      history.push("/spending");
    }
  }, [isDelete, history]);

  function handleCancel() {
    setShowConfirm(!showConfrim);
  }

  async function handleConfirm() {
    setShowConfirm(!showConfrim);
    await onDelete();
  }

  async function onDelete() {
    try {
      setIsDelete(true);
      await dispatch(deleteSpendingAccount({ account, transactions })).unwrap();
    } catch (e) {
      onError(e);
    }
  }

  return (
    <div className="page-container">
      <div className="page-wrapper">
        <section>
          {showConfrim && (
            <section className="confirmation-popup-section">
              <ConfirmationPopup
                onCancel={handleCancel}
                onConfirm={handleConfirm}
              >
                <ConfirmMessage />
              </ConfirmationPopup>
            </section>
          )}
        </section>

        <div className="spending-account-wrapper">
          <section className="spending-account-header-wrapper">
            <header className="spending-account-header">
              <Link to="/spending">
                <h4>Spending Account</h4>
              </Link>
            </header>
          </section>

          <section className="spending-account-detail">
            <div>
              <header>
                <h6>Account</h6>
              </header>

              {isLoading ? (
                <div>
                  <AccountCardLoader status={status} />
                </div>
              ) : (
                <div>
                  <SpendingAccountCard account={account} />
                </div>
              )}

              <div className="account-btn-section">
                <div className="account-btn-wrapper">
                  <Link
                    to={`/spending/transactions/new/${id}`}
                    className="btn btn-add-new form-control"
                    style={isLoading ? { pointerEvents: "none" } : null}
                  >
                    Add Transaction
                  </Link>
                </div>

                <div className="account-btn-wrapper">
                  <Link
                    to={`/spending/accounts/edit/${id}`}
                    className="btn btn-edit form-control"
                    style={isLoading ? { pointerEvents: "none" } : null}
                  >
                    Edit Account
                  </Link>
                </div>

                <div className="account-btn-wrapper">
                  <button
                    className="btn btn-delete form-control"
                    onClick={() => setShowConfirm(!showConfrim)}
                    disabled={isLoading}
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </div>

            <div className="spending-transaction-list-section">
              <div>
                <header>
                  <h6>Transactions</h6>
                </header>
              </div>
              <div>
                <SpendingTransactionsList
                  account={account}
                  transactions={transactions}
                  status={status}
                />
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  selectInvestingAccountById,
  deleteInvestingAccount,
} from "../../../redux/investing/investingAccountsSlice";
import { selectInvestingTransactionsByGSI } from "../../../redux/investing/investingTransactionsSlice";
import { selectSharesOrdersByAccounGSI } from "../../../redux/investing/sharesOrdersSlice";
import { selectOptionsOrdersByAccountGSI } from "../../../redux/investing/optionsOrdersSlice";
import { selectVerticalSpreadsOrdersByAccountGSI } from "../../../redux/investing/verticalSpreadsOrdersSlice";
import { Link } from "react-router-dom";
import { onError } from "../../../lib/errorLib";
import InvestingAccountCard from "./InvestingAccountCard";
import InvestingTransactionsList from "../transactions/InvestingTransactionsList";
import AccountCardLoader from "../../loadingContainers/AccountCardLoader";
import ConfirmationPopup from "../../popups/ConfirmationPopup";
import "./investingAccounts.css"

const ConfirmMessage = () => {
  return (
    <div>
      <p>You are about to delete an account!</p>
      <p>This will remove all related transactions as well!</p>
      <p>Please confirm!</p>
    </div>
  );
};

export default function InvestingAccount() {
  const { id } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const status = useSelector((state) => state.investingAccounts.status);
  const account = useSelector((state) => selectInvestingAccountById(state, id));
  const transactions = useSelector((state) =>
    selectInvestingTransactionsByGSI(state, account.GSI1_PK)
  );

  const orders = useSelector((state) =>
    selectSharesOrdersByAccounGSI(state, account.GSI1_PK)
  )
    .concat(
      useSelector((state) =>
        selectOptionsOrdersByAccountGSI(state, account.GSI1_PK)
      )
    )
    .concat(
      useSelector((state) =>
        selectVerticalSpreadsOrdersByAccountGSI(state, account.GSI1_PK)
      )
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
      history.push("/investing");
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
      await dispatch(
        deleteInvestingAccount({ account, transactions, orders })
      ).unwrap();
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

        <section>
          <header>
            <h3>Investing Account</h3>
          </header>
        </section>

        <div className="account-wrapper">
          <section>
            <header>
              <h6>Account</h6>
            </header>

            {isLoading ? (
              <div>
                <AccountCardLoader status={status} />
              </div>
            ) : (
              <div>
                <InvestingAccountCard account={account} />
              </div>
            )}

            <div className="account-btn-section">
              <div className="account-btn-wrapper">
                <Link
                  to={`/investing/journal/${id}`}
                  className="btn btn-info form-control"
                >
                  Journal
                </Link>
              </div>

              <div className="account-btn-wrapper">
                <Link
                  to={`/investing/transactions/new/${id}`}
                  className="btn btn-success form-control"
                >
                  Add Transaction
                </Link>
              </div>

              <div className="account-btn-wrapper">
                <Link
                  to={`/investing/accounts/edit/${id}`}
                  className="btn btn-primary form-control"
                >
                  Edit Account
                </Link>
              </div>

              <div className="account-btn-wrapper">
                <button
                  className="btn btn-danger form-control"
                  onClick={() => setShowConfirm(!showConfrim)}
                >
                  Delete
                </button>
              </div>
            </div>
          </section>

          <section className="transaction-list-section">
            <div>
              <header>
                <h6>Transactions</h6>
              </header>
            </div>
            <div>
              <InvestingTransactionsList
                account={account}
                transactions={transactions}
                status={status}
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

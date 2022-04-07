import React, { useEffect } from "react";
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

export default function SpendingAccount() {
  const { id } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const status = useSelector((state) => state.spendingAccounts.status);
  const account = useSelector((state) => selectSpendingAccountById(state, id));
  const transactions = useSelector((state) =>
    selectSpendingTransactionsByGSI(state, account.GSI1_PK)
  );

  useEffect(() => {
    if (status === "pending") {
      history.push("/");
    }
  }, [status]);

  async function handleDeleteAccount(e) {
    e.preventDefault();

    try {
      await dispatch(deleteSpendingAccount({ account, transactions })).unwrap();
    } catch (e) {
      onError(e);
    }
  }

  return (
    <div className="page-container">
      <div className="page-wrapper">
        <section>
          <header>
            <h3>Spending Account</h3>
          </header>
        </section>

        <div className="account-wrapper">
          <section className="account-card-section">
            <header>
              <h6>Account</h6>
            </header>
            <div>
              <SpendingAccountCard account={account} />
            </div>
            <section className="account-btn-section">
              <div className="account-btn-wrapper">
                <Link
                  to={`/spending/accounts/edit/${id}`}
                  className="btn btn-primary form-control"
                >
                  Edit Account
                </Link>
              </div>

              <div className="account-btn-wrapper">
                <button
                  className="btn btn-danger form-control"
                  onClick={handleDeleteAccount}
                >
                  Delete
                </button>
              </div>

              <div className="account-btn-wrapper">
                <Link
                  to={`/spending/transactions/new/${id}`}
                  className="btn btn-success form-control"
                >
                  Add Transaction
                </Link>
              </div>
            </section>
          </section>

          <section className="transaction-list-section">
            <div>
              <header>
                <h6>Transactions</h6>
              </header>
            </div>
            {status !== "pending" && (
              <div>
                <SpendingTransactionsList transactions={transactions} />
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

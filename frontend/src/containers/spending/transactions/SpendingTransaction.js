import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  selectSpendingTransactionById,
  deleteSpendingTransaction,
} from "../../../redux/spending/spendingTransactionsSlice";
import { selectSpendingAccountByGSI } from "../../../redux/spending/spendingAccountsSlice";
import { deleteTransactionHandler } from "../../../helpers/currencyHandler";
import { onError } from "../../../lib/errorLib";
import { Link } from "react-router-dom";
import SpendingTransactionCard from "./SpendingTransactionCard";
import SpendingTransactionButtons from "./SpendingTransactionButtons";
import TransactionCardLoader from "../../loadingContainers/TransactionCardLoader";
import LoadingSpinner from "../../../components/LoadingSpinner";
import "./spendingTransactions.css";

export default function SpendingTransaction(props) {
  const { id } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const transaction = useSelector((state) =>
    selectSpendingTransactionById(state, id)
  );
  const account = useSelector((state) =>
    selectSpendingAccountByGSI(state, transaction.GSI1_PK)
  );
  const status = useSelector((state) => state.spendingTransactions.status);
  const [isLoading, setIsLoading] = useState(false);
  const [isDelete, setIsDelete] = useState(false);

	console.log(transaction)

  useEffect(() => {
    if (status === "pending" && !isLoading) {
      setIsLoading(true);
    } else if (status !== "pending" && isLoading) {
      setIsLoading(false);
    }
  }, [status, isLoading]);

  useEffect(() => {
    if (isDelete) {
      history.push(`/spending/accounts/${account.id}`);
    }
  }, [isDelete, history, account.id]);

  async function onDelete() {
    try {
      setIsDelete(true);
      const newAccountBalance = getNewAccountBalance();
      await handleTransactionDelete(newAccountBalance);
    } catch (e) {
      onError(e);
    }
  }

  async function handleTransactionDelete(newAccountBalance) {
    await dispatch(
      deleteSpendingTransaction({
        transaction: { id: transaction.id },
        account: { id: account.id, accountBalance: newAccountBalance },
      })
    ).unwrap();
  }

  function getNewAccountBalance() {
    return deleteTransactionHandler(
      account.accountBalance,
      transaction.transactionAmount,
      transaction.transactionType
    );
  }

  return (
    <div className="page-container">
      <div className="page-wrapper">
        <div className="spending-transaction-wrapper">
          <section className="page-header-wrapper">
            <header className="page-header">
              <Link to={`/spending/accounts/${account.id}`}>
                <h4>Spending Transaction</h4>
              </Link>
            </header>
            <div>
              <SpendingTransactionButtons
                transactionId={transaction.id}
                onDelete={onDelete}
                isLoading={isLoading}
              />
            </div>
          </section>

          <section>
            <header>
              <h6>Transaction Detail</h6>
            </header>
          </section>

          <section>
            {isLoading ? (
              <TransactionCardLoader status={status} />
            ) : (
              <SpendingTransactionCard transaction={transaction} />
            )}
          </section>

          <section className="transaction-note-section">
            <div className="transaction-note-header">
              <header>
                <h6>Note:</h6>
              </header>
            </div>
            <div>
              {isLoading ? <LoadingSpinner /> : transaction.transactionNote}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

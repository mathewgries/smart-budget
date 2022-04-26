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
import "./spendingTransactions.css"

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
        <section>
          <header>
            <Link to={`/spending/accounts/${account.id}`}>
              <h3>Spending Account</h3>
            </Link>
          </header>
        </section>

        <section className="transaction-wrapper">
          <div>
            <header>
              <h6>Transaction Detail</h6>
            </header>
          </div>

          <div>
            {isLoading ? (
              <TransactionCardLoader status={status} />
            ) : (
              <SpendingTransactionCard transaction={transaction} />
            )}
          </div>

          <div>
            <SpendingTransactionButtons
              transactionId={transaction.id}
              onDelete={onDelete}
              isLoading={isLoading}
            />
          </div>

          <div className="transaction-note-section">
            <div className="transaction-note-header">
              <header>
                <h6>Note:</h6>
              </header>
            </div>
            <div>
              {isLoading ? <LoadingSpinner /> : transaction.transactionNote}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

import React, { useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  selectSpendingTransactionById,
  deleteSpendingTransaction,
} from "../../../redux/spending/spendingTransactionsSlice";
import { selectSpendingAccountByGSI } from "../../../redux/spending/spendingAccountsSlice";
import { deleteTransactionHandler } from "../../../helpers/currencyHandler";
import { onError } from "../../../lib/errorLib";
import SpendingTransactionCard from "./SpendingTransactionCard";
import SpendingTransactionButtons from "./SpendingTransactionButtons";

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

  useEffect(() => {
    if (status === "pending") {
      history.push(`/spending/accounts/${account.id}`);
    }
  }, [status]);

  async function onDelete() {
    try {
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
            <h3>Spending Account</h3>
          </header>
        </section>

        <section className="transaction-wrapper">
          <div>
            <header>
              <h6>Transaction Detail</h6>
            </header>
          </div>

          <div className="transaction-info-section">
            <SpendingTransactionCard transaction={transaction} />
          </div>

          <div className="transaction-btn-wrapper">
            <SpendingTransactionButtons
              transactionId={transaction.id}
              onDelete={onDelete}
            />
          </div>

          <div className="transaction-note-section">
            <div className="transaction-note-header">
              <header>
                <h6>Note:</h6>
              </header>
            </div>
            <div>{transaction.transactionNote}</div>
          </div>
        </section>
      </div>
    </div>
  );
}

import React, { useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  selectInvestingTransactionById,
  deleteInvestingTransaction,
} from "../../../redux/investing/investingTransactionsSlice";
import { selectInvestingAccountByGSI } from "../../../redux/investing/investingAccountsSlice";
import { deleteTransactionHandler } from "../../../helpers/currencyHandler";
import { onError } from "../../../lib/errorLib";
import InvestingTransactionCard from "./InvestingTransactionCard";
import InvestingTransactionButtons from "./InvestingTransactionButtons";

export default function InvestingTransaction(props) {
  const { id } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const transaction = useSelector((state) =>
    selectInvestingTransactionById(state, id)
  );
  const account = useSelector((state) =>
    selectInvestingAccountByGSI(state, transaction.GSI1_PK)
  );
  const status = useSelector((state) => state.investingTransactions.status);

  useEffect(() => {
    if (status === "pending") {
      history.push(`/investing/accounts/${account.id}`);
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
      deleteInvestingTransaction({
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
            <h3>Investing Account</h3>
          </header>
        </section>

        <section className="transaction-wrapper">
          <div>
            <header>
              <h6>Transaction Detail</h6>
            </header>
          </div>

          <div className="transaction-info-section">
            <InvestingTransactionCard transaction={transaction} />
          </div>

          <div className="transaction-btn-wrapper">
            <InvestingTransactionButtons
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

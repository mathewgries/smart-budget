import React from "react";
import { useParams, Redirect } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectSpendingTransactionById } from "../../../redux/spending/spendingTransactionsSlice";
import { selectSpendingAccountByGSI } from "../../../redux/spending/spendingAccountsSlice";
import SpendingTransactionCard from "./SpendingTransactionCard";
import SpendingTransactionButtons from "./SpendingTransactionButtons";

export default function SpendingTransaction(props) {
  const { id } = useParams();
  const [isRedirect, setIsRedirect] = useState(false);
  const transaction = useSelector((state) =>
    selectSpendingTransactionById(state, id)
  );
  const account = useSelector((state) =>
    selectSpendingAccountByGSI(state, transaction.GSI1_PK)
  );

  function onDelete() {
    setIsRedirect(true);
  }

  const renderTransaction = () => {
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
  };

  function redirectToAccount() {

		

    return (
      <div>
        <Redirect to={`/spending/accounts/${account.id}`} />
      </div>
    );
  }

  return <>{!isRedirect ? renderTransaction() : redirectToAccount()}</>;
}

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectAllSpendingAcounts } from "../../redux/spending/spendingAccountsSlice";
import { selectAllSpendingTransactions } from "../../redux/spending/spendingTransactionsSlice";
import "./graphs.css";

export default function GraphTesting(props) {
  const accounts = useSelector(selectAllSpendingAcounts);
  const allTransactions = useSelector(selectAllSpendingTransactions);
  const [account, setAccount] = useState(accounts[0]);
  const [transactions, setTransactions] = useState(
    allTransactions.filter(
      (transaction) => transaction.GSI1_PK === account.GSI1_PK
    )
  );

	console.log(transactions)

  useEffect(() => {
    setTransactions(
      allTransactions.filter(
        (transaction) => transaction.GSI1_PK === account.GSI1_PK
      )
    );
  }, [account, allTransactions]);

  return (
    <div className="page-container">
      <div className="page-wrapper">
        <div className="account-selector">
          <div className="strategy-dropdown-section">
            <div className="dropdown form-group strategy-dropdown">
              <button
                className="btn dropdown-toggle"
                type="input"
                id="dropdownMenuButton"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
                // disabled={isLoading}
              >
                {account.accountName}
              </button>
              <div
                className="dropdown-menu"
                aria-labelledby="dropdownMenuButton"
              >
                {accounts.map((account) => (
                  <div key={account.id} className="strategy-list-item">
                    <div
                      className="dropdown-item"
                      onClick={() => setAccount(account)}
                    >
                      <div>{account.accountName}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="input-output-graph">
          <div>Graph Testing</div>
        </div>
      </div>
    </div>
  );
}

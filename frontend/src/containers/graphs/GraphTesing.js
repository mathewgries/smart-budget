import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectAllSpendingAcounts } from "../../redux/spending/spendingAccountsSlice";
import { selectAllSpendingTransactions } from "../../redux/spending/spendingTransactionsSlice";
import TotalsBargraph from "./TotalsBargraph";
import PercentBargraph from "./PercentBargraph";
import CategoriesChart from "./CategoriesChart";
import "./graphs.css";

export default function GraphTesting(props) {
  const accounts = useSelector(selectAllSpendingAcounts);
  const allTransactions = useSelector(selectAllSpendingTransactions).sort(
    (a, b) => b.transactionDate - a.transactionDate
  );
  const [account, setAccount] = useState(accounts[0]);
  const [timeFrame, setTimeFrame] = useState("D");
  const [transactions, setTransactions] = useState(
    allTransactions.filter(
      (transaction) => transaction.GSI1_PK === account.GSI1_PK
    )
  );
  const [withdrawals, setWithdrawals] = useState(
    transactions.filter((transaction) => transaction.transactionType === "W")
  );
  const [deposits, setDeposits] = useState(
    transactions.filter((transaction) => transaction.transactionType === "D")
  );

  useEffect(() => {
    const transactions = allTransactions.filter(
      (transaction) => transaction.GSI1_PK === account.GSI1_PK
    );
    setTransactions(transactions);
    setWithdrawals(
      transactions
        .filter((transaction) => transaction.transactionType === "W")
        .sort((a, b) => b.transactionDate - a.transactionDate)
    );
    setDeposits(
      transactions
        .filter((transaction) => transaction.transactionType === "D")
        .sort((a, b) => b.transactionDate - a.transactionDate)
    );
  }, [account, allTransactions, timeFrame]);

  return (
    <div className="page-container">
      <div className="page-wrapper">
        <section className="graph-page-selector-bar">
          <div className="account-selector-wrapper">
            <div className="account-dropdown-section">
              <div className="dropdown form-group account-dropdown">
                <button
                  className="btn dropdown-toggle account-dropwdown-toggle"
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
                  className="dropdown-menu account-selector-dropdown-menu"
                  aria-labelledby="dropdownMenuButton"
                >
                  {accounts.map((account) => (
                    <div key={account.id} className="account-list-item">
                      <div
                        className="dropdown-item account-dropdown-item"
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

          <div className="time-frame-toggle-btn-wrapper">
            <div className="time-frame-toggle-btn-section">
              <div
                onClick={() => setTimeFrame("D")}
                className={`time-frame-toggle-btn ${
                  timeFrame === "D" ? "tf-active" : "tf-not-active"
                }`}
              >
                D
              </div>

              <div
                onClick={() => setTimeFrame("W")}
                className={`time-frame-toggle-btn ${
                  timeFrame === "W" ? "tf-active" : "tf-not-active"
                }`}
              >
                W
              </div>
              <div
                onClick={() => setTimeFrame("M")}
                className={`time-frame-toggle-btn ${
                  timeFrame === "M" ? "tf-active" : "tf-not-active"
                }`}
              >
                M
              </div>
              <div
                onClick={() => setTimeFrame("Q")}
                className={`time-frame-toggle-btn ${
                  timeFrame === "Q" ? "tf-active" : "tf-not-active"
                }`}
              >
                Q
              </div>
              <div
                onClick={() => setTimeFrame("Y")}
                className={`time-frame-toggle-btn ${
                  timeFrame === "Y" ? "tf-active" : "tf-not-active"
                }`}
              >
                Y
              </div>
              <div
                onClick={() => setTimeFrame("YTD")}
                className={`time-frame-toggle-btn ${
                  timeFrame === "YTD" ? "tf-active" : "tf-not-active"
                }`}
              >
                YTD
              </div>
            </div>
          </div>
        </section>

        <section className="bargraph-wrapper">
          <div>
            <header>
              <h5>Income</h5>
            </header>
          </div>
          <TotalsBargraph
            transactions={deposits}
            timeFrame={timeFrame}
          />
        </section>

        <section className="bargraph-wrapper">
          <div>
            <header>
              <h5>Spending</h5>
            </header>
          </div>
          <TotalsBargraph
            transactions={withdrawals}
            timeFrame={timeFrame}
          />
        </section>

        <section className="bargraph-wrapper">
          <div>
            <header>
              <h5>Average out vs in</h5>
            </header>
          </div>
          <PercentBargraph
            withdrawals={withdrawals}
            deposits={deposits}
            timeFrame={timeFrame}
          />
        </section>

        <section className="bargraph-wrapper">
          <div>
            <header>
              <h5>Categories</h5>
            </header>
          </div>
          <CategoriesChart
            transactions={withdrawals}
            timeFrame={timeFrame}
          />
        </section>
      </div>
    </div>
  );
}

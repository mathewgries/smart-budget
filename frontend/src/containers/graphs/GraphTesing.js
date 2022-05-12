import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectAllSpendingAcounts } from "../../redux/spending/spendingAccountsSlice";
import { selectSpendingTransactionsByGSI } from "../../redux/spending/spendingTransactionsSlice";
import {
  setFixedTimeFrame,
  getTransactionsForTimeFrame,
  sumReducer,
  getMinDate,
} from "./incomeGraphHelpers";
import { inputDateFormat } from "../../helpers/dateFormat";
import TotalsBargraph from "./TotalsBargraph";
import PercentBargraph from "./PercentBargraph";
import CategoriesChart from "./CategoriesChart";
import DatePickerPopup from "../popups/DatePickerPopup";
import "./graphs.css";

export default function GraphTesting(props) {
  const accounts = useSelector(selectAllSpendingAcounts);
  const [account, setAccount] = useState(accounts[0]);
  const transactions = useSelector((state) =>
    selectSpendingTransactionsByGSI(state, account.GSI1_PK)
  );
  const minDate = getMinDate(transactions.map((n) => n.transactionDate));
  const [timeFrame, setTimeFrame] = useState(setFixedTimeFrame("D", minDate));
  const transForTime = getTransactionsForTimeFrame(
    transactions,
    timeFrame.startDate,
    timeFrame.endDate
  ).sort((a, b) => b.transactionDate - a.transactionDate);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const withdrawals = transForTime
    .filter((transaction) => transaction.transactionType === "W")
    .sort((a, b) => b.transactionDate - a.transactionDate);
  const deposits = transForTime
    .filter((transaction) => transaction.transactionType === "D")
    .sort((a, b) => b.transactionDate - a.transactionDate);

  useEffect(() => {
    setTimeFrame((prev) => setFixedTimeFrame(prev.label, minDate));
  }, [account, minDate]);


  function handleShowDatePicker() {
    setShowDatePicker(!showDatePicker);
  }

  function handlDatePickerConfirm(dates) {
    setTimeFrame({
      label: "CUS",
      startDate: dates.start,
      endDate: dates.end,
    });
    setShowDatePicker(false);
  }

  function toggleFixedTimeFrame(value) {
    if (value === "CUS") {
      setShowDatePicker(true);
    } else if (value === timeFrame.label) {
      return;
    } else {
      setTimeFrame(setFixedTimeFrame(value, minDate));
    }
  }

  return (
    <div className="page-container">
      <div className="page-wrapper">
        <section>
          {showDatePicker && (
            <section className="confirmation-popup-section">
              <DatePickerPopup
                timeFrame={timeFrame}
                onCancel={handleShowDatePicker}
                onConfirm={handlDatePickerConfirm}
              ></DatePickerPopup>
            </section>
          )}
        </section>

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
                onClick={() => toggleFixedTimeFrame("D")}
                className={`time-frame-toggle-btn ${
                  timeFrame.label === "D" ? "tf-active" : "tf-not-active"
                }`}
              >
                D
              </div>

              <div
                onClick={() => toggleFixedTimeFrame("W")}
                className={`time-frame-toggle-btn ${
                  timeFrame.label === "W" ? "tf-active" : "tf-not-active"
                }`}
              >
                W
              </div>
              <div
                onClick={() => toggleFixedTimeFrame("M")}
                className={`time-frame-toggle-btn ${
                  timeFrame.label === "M" ? "tf-active" : "tf-not-active"
                }`}
              >
                M
              </div>
              <div
                onClick={() => toggleFixedTimeFrame("Q")}
                className={`time-frame-toggle-btn ${
                  timeFrame.label === "Q" ? "tf-active" : "tf-not-active"
                }`}
              >
                Q
              </div>
              <div
                onClick={() => toggleFixedTimeFrame("Y")}
                className={`time-frame-toggle-btn ${
                  timeFrame.label === "Y" ? "tf-active" : "tf-not-active"
                }`}
              >
                Y
              </div>
              <div
                onClick={() => toggleFixedTimeFrame("YTD")}
                className={`time-frame-toggle-btn ${
                  timeFrame.label === "YTD" ? "tf-active" : "tf-not-active"
                }`}
              >
                YTD
              </div>
              <div
                onClick={() => toggleFixedTimeFrame("CUS")}
                className={`time-frame-toggle-btn ${
                  timeFrame.label === "CUS" ? "tf-active" : "tf-not-active"
                }`}
              >
                CUSTOM
              </div>
            </div>
          </div>

          <div className="start-end-date-wrapper">
            <div className="start-end-date-section">
              <div className="start-end-date">
                Start:{" "}
                <input
                  type="date"
                  value={inputDateFormat(timeFrame.startDate)}
                  readOnly={true}
                  disabled={true}
                />
              </div>
              <div className="start-end-date">
                End:{" "}
                <input
                  type="date"
                  value={inputDateFormat(timeFrame.endDate)}
                  readOnly={true}
                  disabled={true}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="total-amounts-wrapper">
          <div>
            <header>
              <h5>Totals</h5>
            </header>
          </div>
          <div className="total-amounts-section">
            <div>
              <span>Deposits: $</span>
              {sumReducer(deposits)}
            </div>
            <div>
              <span>Withdrawals: $</span>
              {sumReducer(withdrawals)}
            </div>
            <div>
              <span>Out vs In: </span>
              {sumReducer(deposits) > sumReducer(withdrawals) ||
              sumReducer(deposits) !== 0
                ? (
                    (sumReducer(withdrawals) / sumReducer(deposits)) *
                    100
                  ).toFixed(2)
                : (
                    (sumReducer(deposits) / sumReducer(withdrawals)) *
                    100
                  ).toFixed(2)}
              <span>%</span>
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
            minDate={minDate}
          />
        </section>

        <section className="bargraph-wrapper">
          <div>
            <header>
              <h5>Spending</h5>
            </header>
          </div>
          <TotalsBargraph transactions={withdrawals} timeFrame={timeFrame} />
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
          <CategoriesChart transactions={withdrawals} timeFrame={timeFrame} />
        </section>
      </div>
    </div>
  );
}

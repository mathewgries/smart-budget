import React, { useState, useEffect } from "react";
import { getBargraphDisplay, getMaxValue } from "./incomeGraphHelpers";
import TotalsBargraphBar from "./TotalsBargraphBar";
import "./graphs.css";

export default function OutVsInBargraph(props) {
  const { deposits, withdrawals, timeFrame } = props;
  const [graphDisplay, setGraphDisplay] = useState([]);
  const [max, setMax] = useState(0);

  useEffect(() => {
    const withdrawalItems = getBargraphDisplay(withdrawals, timeFrame);
    const depositItems = getBargraphDisplay(deposits, timeFrame);
    const displayItems = withdrawalItems.map((wdItem) => ({
      ...wdItem,
      depositAmount: depositItems.find(
        (depItem) =>
          depItem.date === wdItem.date && depItem.year === wdItem.year
      ).amount,
    }));
    const withDifference = displayItems.map((item) => ({
      ...item,
      diff: getDifference(item.depositAmount, item.amount),
    }));

    setGraphDisplay(withDifference);
    setMax(
      getMaxValue(
        withDifference.map((item) =>
          item.diff > 0 ? item.diff : item.diff * -1
        )
      )
    );
  }, [deposits, withdrawals, timeFrame]);

  function getDifference(deposit, withdrawal) {
    return Number.parseFloat(deposit) - Number.parseFloat(withdrawal);
  }

  return (
    <div className="outvsin-bargraph-container">
      <div className="outvsin-bargraph-display">
        {graphDisplay.map((item) => (
          <div key={item.date} className="outvsin-bargraph-display-item">
            <div className="totals-bargraph-bar-wrapper oubd-top">
              {item.depositAmount > item.amount && (
                <TotalsBargraphBar
                  value={item.diff}
                  max={max}
                  displayTop={true}
                />
              )}
            </div>
            <div className="totals-bargraph-bar-wrapper oubd-bottom">
              {item.amount > item.depositAmount && (
                <TotalsBargraphBar
                  value={item.diff}
                  max={max}
                  displayTop={false}
                />
              )}
            </div>
            <div className="bargraph-display-amount">
              {item.diff > 0 ? item.diff.toFixed(2) : item.diff}
            </div>
            <div className="bargraph-display-date-wrapper">
              <div className="bargraph-display-date">{item.date}</div>
              <div className="bargraph-display-year">{item.year}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { getBargraphDisplay, getMaxValue } from "./incomeGraphHelpers";
import TotalsBargraphBar from "./TotalsBargraphBar";
import "./graphs.css";

export default function PercentBargraph(props) {
  const { deposits, withdrawals, timeFrame } = props;
  const barHeight = 95;
  const [graphDisplay, setGraphDisplay] = useState([]);
  const [ratio, setRatio] = useState();

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
    const withPercentage = displayItems.map((item) => ({
      ...item,
      percentage: getPercentChange(item.depositAmount, item.amount),
    }));
    setGraphDisplay(withPercentage);

    const max = getMaxValue(withPercentage.map((item) => item.percentage));

    if (max === barHeight || max === 0) {
      setRatio(1);
    } else {
      setRatio(barHeight / max);
    }
  }, [deposits, withdrawals, timeFrame]);

  function getPercentChange(deposit, withdrawal) {
    if (deposit === 0 && withdrawal === 0) {
      return 0;
    } else if (deposit === 0 || withdrawal === 0) {
      return 100;
    } else if (deposit === withdrawal) {
      return 100;
    } else if (deposit > withdrawal) {
      return (deposit / withdrawal) * 100;
    } else if (withdrawal > deposit) {
      return (withdrawal / deposit) * 100;
    }
  }

  return (
    <div className="precentage-bargraph-container">
      <div className="percentage-bargraph-display">
        {graphDisplay.map((item) => (
          <div key={item.date} className="percentage-bargraph-display-item">
            <div className="overunder-bargraph-display oubd-top">
              {item.depositAmount > item.amount && (
                <TotalsBargraphBar
                  value={item.percentage}
                  ratio={ratio}
                  displayTop={true}
                />
              )}
            </div>
            <div className="overunder-bargraph-display oubd-bottom">
              {item.amount > item.depositAmount && (
                <TotalsBargraphBar
                  value={item.percentage}
                  ratio={ratio}
                  displayTop={false}
                />
              )}
            </div>
            <div className="bargraph-display-amount">
              {item.percentage > 0
                ? item.percentage.toFixed(2)
                : item.percentage}
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

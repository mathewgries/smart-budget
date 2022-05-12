import React, { useState, useEffect } from "react";
import { getBargraphDisplay, getMaxValue } from "./incomeGraphHelpers";
import TotalsBaraphBar from "./TotalsBargraphBar";
import "./graphs.css";

export default function TotalsBargraph(props) {
  const { transactions, timeFrame, minDate } = props;
  const barHeight = 56;
  const [graphDisplay, setGraphDisplay] = useState([]);
  const [ratio, setRatio] = useState();

  useEffect(() => {
    const displayItems = getBargraphDisplay(transactions, timeFrame, minDate);
    const max = getMaxValue(displayItems.map((item) => item.amount));

    if (max === barHeight || max === 0) {
      setRatio(1);
    } else {
      setRatio(barHeight / max);
    }

    setGraphDisplay(displayItems);
  }, [transactions, timeFrame, minDate]);

  return (
    <div className="bargraph-container">
      <div className="bargraph-display">
        {graphDisplay.map((item) => (
          <div key={item.date} className="bargraph-display-item">
            <TotalsBaraphBar
              value={item.amount}
              ratio={ratio}
              displayTop={true}
            />
            <div className="bargraph-display-amount">{item.amount}</div>
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

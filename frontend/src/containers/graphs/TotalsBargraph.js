import React, { useState, useEffect } from "react";
import { getBargraphDisplay, getMaxValue } from "./incomeGraphHelpers";
import TotalsBaraphBar from "./TotalsBargraphBar";
import "./graphs.css";

export default function TotalsBargraph(props) {
  const { transactions, timeFrame, minDate } = props;
  const [graphDisplay, setGraphDisplay] = useState([]);
  const [max, setMax] = useState(0);

	console.log({transactions, timeFrame, minDate})

  useEffect(() => {
    const displayItems = getBargraphDisplay(transactions, timeFrame, minDate);

    setGraphDisplay(displayItems);
    setMax(getMaxValue(displayItems.map((item) => item.amount)));
  }, [transactions, timeFrame, minDate]);

  return (
    <div className="bargraph-container">
      <div className="bargraph-display">
        {graphDisplay.map((item) => (
          <div key={item.date} className="bargraph-display-item">
            <div className="totals-bargraph-bar-wrapper">
              <TotalsBaraphBar
                value={item.amount}
                max={max}
                displayTop={true}
              />
            </div>
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

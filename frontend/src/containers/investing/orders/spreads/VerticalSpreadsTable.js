import React from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { selectAllStrategies } from "../../../../redux/investing/strategiesSlice";
import "../orders.css";

export default function VerticalSpreadsTable(props) {
  const { orders } = props;
  const history = useHistory();
  const strategies = useSelector(selectAllStrategies);

  const handleOnClick = (id) => {
    history.push(`/investing/orders/spreads/vertical/${id}`);
  };

  return (
    <div className="journal-table-container">
      <table className="table journal-table">
        <caption>Vertical Spread Orders</caption>
        <thead className="">
          <tr>
            <th>Ticker</th>
            <th>Open Date</th>
            <th>Contract</th>
            <th>P/L $</th>
            <th>Strategy</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => {
            const strategy = strategies.find(
              (strategy) => strategy.id === order.strategyId
            );
            return (
              <tr
                key={order.id}
                // className={
                //   Number.parseFloat(order.profitLoss) > 0
                //     ? "table-success"
                //     : "table-danger"
                // }
                onClick={() => handleOnClick(order.id)}
              >
                <td>{order.ticker}</td>
                <td>{new Date(order.openDate).toLocaleDateString()}</td>
                <td>{order.contractType}</td>
                <td>{order.profitLoss}</td>
                <td>{strategy.strategyName}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

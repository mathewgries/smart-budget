import React from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAllStrategies } from "../../../../redux/investing/strategiesSlice";
import "../orders.css";

export default function OptionsOrdersTable(props) {
  const { orders } = props;
  const history = useHistory();
  const strategies = useSelector(selectAllStrategies);

  const sortedOrders = orders.sort((a, b) => b.openDate - a.openDate);

  const handleOnClick = (id) => {
    history.push(`/investing/orders/options/${id}`);
  };

  return (
    <div className="journal-table-container">
      <table className="table journal-table">
        <caption>Options Orders</caption>
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
          {sortedOrders.map((order) => {
            const strategy = strategies.find(
              (strategy) => strategy.id === order.strategyId
            );
            return (
              <tr
                // className={
                //   Number.parseFloat(order.profitLoss) > 0
                //     ? "table-success"
                //     : "table-danger"
                // }
                onClick={() => handleOnClick(order.id)}
                key={order.id}
              >
                <td>{order.ticker}</td>
                <td>{new Date(order.openDate).toLocaleDateString()}</td>
                <td>{order.contractType}</td>
                <td>{order.profitLoss}</td>
                <td>{strategy ? strategy.strategyName : "N/A"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

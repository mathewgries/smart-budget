import React from "react";
import { useHistory } from "react-router-dom";

export default function OptionsOrdersTable(props) {
  const history = useHistory();
  const { orders } = props;

  const handleOnClick = (id) => {
    history.push(`/investing/orders/options/${id}`);
  };

  return (
    <div className="orders-table-container">
      <div className="orders-table-wrapper">
        <table className="table-bordered orders-table">
          <caption>Options Orders</caption>
          <thead className="">
            <tr>
              <th>Ticker</th>
              <th>Open Date</th>
              <th>Close Date</th>
              <th>Size</th>
              <th>Side</th>
              <th>Open Price</th>
              <th>Close Price</th>
              <th>Strike</th>
              <th>Contract</th>
              <th>P/L $</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                className={
                  Number.parseFloat(order.profitLoss) > 0
                    ? "table-success"
                    : "table-danger"
                }
                onClick={() => handleOnClick(order.id)}
                key={order.id}
              >
                <td>{order.ticker}</td>
                <td>{new Date(order.openDate).toLocaleDateString()}</td>
                <td>{new Date(order.closeDate).toLocaleDateString()}</td>
                <td>{order.orderSize}</td>
                <td>{order.tradeSide}</td>
                <td>{order.openPrice}</td>
                <td>{order.closePrice}</td>
                <td>{order.strikePrice}</td>
                <td>{order.contractType}</td>
                <td>{order.profitLoss}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

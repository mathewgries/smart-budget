import React from "react";
import { useParams, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectSharesOrdersByAccountId } from "../../../../redux/investing/investingOrdersSlice";

export default function SharesOrdersTable(props) {
  const { id } = useParams();
  const history = useHistory();
  const orders = useSelector((state) =>
    selectSharesOrdersByAccountId(state, id)
  );

  const handleOnClick = (id) => {
    history.push(`/investing/orders/shares/${id}`);
  };

  return (
    <div className="orders-table-container">
      <div className="orders-table-wrapper">
        <table className="table-bordered orders-table">
          <caption>Share Orders</caption>
          <thead>
            <tr>
              <th>Ticker</th>
              <th>Open Date</th>
              <th>Close Date</th>
              <th>Size</th>
              <th>Side</th>
              <th>Open Price</th>
              <th>Close Price</th>
              <th>P/L $</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className={
                  Number.parseFloat(order.profitLoss) > 0
                    ? "table-success"
                    : "table-danger"
                }
                onClick={() => handleOnClick(order.id)}
              >
                <td>{order.ticker}</td>
                <td>{new Date(order.openDate).toLocaleDateString()}</td>
                <td>{new Date(order.closeDate).toLocaleDateString()}</td>
                <td>{order.orderSize}</td>
                <td>{order.tradeSide}</td>
                <td>{order.openPrice}</td>
                <td>{order.closePrice}</td>
                <td>{order.profitLoss}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

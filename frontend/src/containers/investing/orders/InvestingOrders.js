import React from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectOrdersByAccountId } from "../../../redux/investing/investingOrdersSlice";

export default function InvestingOrders(props) {
  const { id } = useParams();
  const orders = useSelector((state) => selectOrdersByAccountId(state, id));

  return (
    <div className="page-container">
      <div className="journal-table-wrapper">
        <table className="journal-table">
          <thead>
            <tr>
              <th>Ticker</th>
              <th>Open Date</th>
              <th>Close Date</th>
              <th>Strike</th>
              <th>Side</th>
              <th>Size</th>
              <th>Contract</th>
              <th>Open Price</th>
              <th>Close Price</th>
              <th>P/L $</th>
              <th>P/L %</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.ticker}</td>
                <td>{new Date(order.openDatetime).toLocaleDateString()}</td>
                <td>{new Date(order.closeDatetime).toLocaleDateString()}</td>
                <td>{order.strikePrice}</td>
                <td>{order.orderSide}</td>
                <td>{order.quantity}</td>
                <td>{order.contractType}</td>
                <td>{order.openPrice}</td>
                <td>{order.closePrice}</td>
                <td>{order.resultDollars}</td>
                <td>{order.resultPercent}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

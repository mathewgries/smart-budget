import React from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectSharesOrderById } from "../../../../redux/investing/sharesOrdersSlice";
import { getPLPercent } from "../../../../helpers/currencyHandler";
import { Link } from "react-router-dom";

export default function SharesOrder(props) {
  const { id } = useParams();
  const order = useSelector((state) => selectSharesOrderById(state, id));

  return (
    <div className="page-container">
      <div className="page-wrapper">
        <div className="order-page-wrapper">
          <section className="order-page-header">
            <header>
              <h5>Share Order</h5>
            </header>
            <div className="form-group">
              <Link
                to={`/investing/orders/shares/edit/${id}`}
                className="btn btn-primary"
              >
                Edit
              </Link>
            </div>
          </section>

          <section>
            <table className="table table-bordered table-sm">
              <thead className="thead-light">
                <tr>
                  <th>Ticker</th>
                  <th>Open Date</th>
                  <th>Close Date</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{order.ticker}</td>
                  <td>{order.openDate}</td>
                  <td>{order.closeDate}</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section className="option-order-contract-section">
            <table className="table table-bordered table-sm">
              <thead className="thead-light">
                <tr>
                  <th>Qty</th>
                  <th>Side</th>
                  <th>Open Price</th>
                  <th>Close Price</th>
                  <th>P/L $</th>
                  <th>P/L %</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{order.orderSize}</td>
                  <td>{order.tradeSide}</td>
                  <td>{order.openPrice}</td>
                  <td>{order.closePrice}</td>
                  <td>{order.profitLoss}</td>
                  <td>
                    {getPLPercent(
                      order.openPrice,
                      order.closePrice,
                      order.tradeSide
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </section>

          {order.signalList && order.signalList.length > 0 && (
            <section>
              <table className="table table-bordered">
                <thead className="thead-light">
                  <tr>
                    <th>Signals</th>
                  </tr>
                </thead>
                <tbody>
                  {order.signalList.map((signal) => (
                    <tr key={signal}>
                      <td>{signal}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

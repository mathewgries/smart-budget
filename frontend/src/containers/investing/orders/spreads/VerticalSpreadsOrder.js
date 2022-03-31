import React from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectVerticalSpreadsOrderById } from "../../../../redux/investing/verticalSpreadsOrdersSlice";
import { getPLPercent } from "../../../../helpers/currencyHandler";
import { Link } from "react-router-dom";

export default function VerticalSpreadsOrder(props) {
  const { id } = useParams();
  const order = useSelector((state) =>
    selectVerticalSpreadsOrderById(state, id)
  );

  return (
    <div className="page-container">
      <div className="page-wrapper form-wrapper">
        <div className="order-page-wrapper">
          <section className="order-page-header">
            <header>
              <h5>Vertical Spread Order</h5>
            </header>
            <div className="form-group">
              <Link
                to={`/investing/orders/spreads/vertical/edit/${id}`}
                className="btn btn-primary"
              >
                Edit
              </Link>
            </div>
          </section>

          <section className="option-order-ticker-section">
            <table className="table table-bordered table-sm">
              <thead className="thead-light">
                <tr>
                  <th>Ticker</th>
                  <th>Spread</th>
                  <th>Contact</th>
                  <th>Side</th>
                  <th>Expiration</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{order.ticker}</td>
                  <td>{`${order.strikeUpperLegPrice}/${order.strikeLowerLegPrice}`}</td>
                  <td>{order.contractType}</td>
                  <td>{order.tradeSide}</td>
                  <td>{order.spreadExpirationDate}</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section className="option-order-ticker-section">
            <table className="table table-bordered table-sm">
              <thead className="thead-light">
                <tr>
                  <th>Qty</th>
                  <th>Open Price</th>
                  <th>Close Price</th>
                  <th>P/L$</th>
                  <th>P/L%</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{order.orderSize}</td>
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

          <section>
            <table className="table table-bordered table-sm">
              <thead className="thead-light">
                <tr>
                  <th>#</th>
                  <th>Date</th>
                  <th>Share Price</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="rowß">Open</th>
                  <td>{order.openDate}</td>
                  <td>{order.openUnderlyingPrice}</td>
                </tr>
                <tr>
                  <th scope="row">Close</th>
                  <td>{order.closeDate}</td>
                  <td>{order.closeUnderlyingPrice}</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section>
            <table className="table table-bordered table-sm">
              <thead className="thead-light">
                <tr>
                  <th>Name</th>
                  <th>Open</th>
                  <th>Close</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>Delta</th>
                  <td>{order.openDelta}</td>
                  <td>{order.closeDelta}</td>
                </tr>
                <tr>
                  <th>Gamma</th>
                  <td>{order.openGamma}</td>
                  <td>{order.closeGamma}</td>
                </tr>
                <tr>
                  <th>Vega</th>
                  <td>{order.openVega}</td>
                  <td>{order.closeVega}</td>
                </tr>
                <tr>
                  <th>Theta</th>
                  <td>{order.openTheta}</td>
                  <td>{order.closeTheta}</td>
                </tr>
                <tr>
                  <th>I.V.</th>
                  <td>{order.openImpliedVolatility}</td>
                  <td>{order.closeImpliedVolatility}</td>
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

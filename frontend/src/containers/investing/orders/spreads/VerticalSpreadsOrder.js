import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  selectVerticalSpreadsOrderById,
  deleteVerticalSpreadOrder,
} from "../../../../redux/investing/verticalSpreadsOrdersSlice";
import { selectInvestingAccountByGSI } from "../../../../redux/investing/investingAccountsSlice";
import { selectStrategyById } from "../../../../redux/investing/strategiesSlice";
import { selectAllSignals } from "../../../../redux/investing/signalsSlice";
import {
  getPLPercent,
  deleteOrderHandler,
} from "../../../../helpers/currencyHandler";
import { dateToString } from "../../../../helpers/dateFormat";
import { onError } from "../../../../lib/errorLib";
import { Link } from "react-router-dom";
import ConfirmationPopup from "../../../popups/ConfirmationPopup";
import "../orders.css"

const ConfirmMessage = () => {
  return (
    <div>
      <p>You are about to delete an order!</p>
      <p>This effects account balance as well!</p>
      <p>Please confirm!</p>
    </div>
  );
};

export default function VerticalSpreadsOrder(props) {
  const { id } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const order = useSelector((state) =>
    selectVerticalSpreadsOrderById(state, id)
  );

  const account = useSelector((state) =>
    selectInvestingAccountByGSI(state, order.GSI1_PK)
  );
  const strategy = useSelector((state) =>
    selectStrategyById(state, order.strategyId)
  );
  const signals = useSelector((state) => {
    const allSignals = selectAllSignals(state);
    return allSignals.filter((signal) => strategy.signals.includes(signal.id));
  });
  const [isDelete, setIsDelete] = useState(false);
  const [showConfrim, setShowConfirm] = useState(false);

  useEffect(() => {
    if (isDelete) {
      history.push(`/investing/journal/${account.id}`);
    }
  }, [isDelete, history, account.id]);

  function handleCancel() {
    setShowConfirm(!showConfrim);
  }

  async function handleConfirm() {
    setShowConfirm(!showConfrim);
    await onDelete();
  }

  async function onDelete() {
    try {
      setIsDelete(true);
      const newAccountBalance = deleteOrderHandler(
        order.profitLoss,
        account.accountBalance
      );
      await handleOrderDelete(newAccountBalance);
    } catch (e) {
      onError(e);
    }
  }

  async function handleOrderDelete(newAccountBalance) {
    await dispatch(
      deleteVerticalSpreadOrder({
        order: { id: order.id, type: order.type },
        account: { id: account.id, accountBalance: newAccountBalance },
      })
    ).unwrap();
  }

  return (
    <div className="page-container">
      <div className="page-wrapper form-wrapper">
        <div className="order-page-wrapper">
          <section>
            {showConfrim && (
              <section className="confirmation-popup-section">
                <ConfirmationPopup
                  onCancel={handleCancel}
                  onConfirm={handleConfirm}
                >
                  <ConfirmMessage />
                </ConfirmationPopup>
              </section>
            )}
          </section>
          <section className="order-page-header">
            <header>
              <h5>Vertical Spread Order</h5>
            </header>
            <div className="orders-btn-group">
              <div className="form-group">
                <Link
                  to={`/investing/orders/spreads/vertical/edit/${id}`}
                  className="btn btn-add-new"
                >
                  Edit
                </Link>
              </div>
              <div className="form-group">
                <button
                  className="btn btn-danger"
                  onClick={() => setShowConfirm(!showConfrim)}
                >
                  Delete
                </button>
              </div>
            </div>
          </section>

          <section>
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
                  <td>{dateToString(order.spreadExpirationDate)}</td>
                </tr>
              </tbody>
            </table>
          </section>

          {strategy && (
            <section>
              <table className="table table-bordered table-sm">
                <thead className="thead-light">
                  <tr>
                    <th>Strategy</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{strategy.strategyName}</td>
                  </tr>
                </tbody>
              </table>
            </section>
          )}

          {strategy && signals.length > 0 && (
            <section>
              <table className="table table-bordered table-sm">
                <thead className="thead-light">
                  <tr>
                    <th>Signals</th>
                  </tr>
                </thead>
                <tbody>
                  {signals.map((signal) => (
                    <tr key={signal.id}>
                      <td>{signal.name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}

          <section>
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
                  <td>{dateToString(order.openDate)}</td>
                  <td>{order.openUnderlyingPrice}</td>
                </tr>
                <tr>
                  <th scope="row">Close</th>
                  <td>{dateToString(order.closeDate)}</td>
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
        </div>
      </div>
    </div>
  );
}

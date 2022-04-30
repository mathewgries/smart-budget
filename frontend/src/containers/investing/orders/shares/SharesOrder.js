import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  selectSharesOrderById,
  deleteSharesOrder,
} from "../../../../redux/investing/sharesOrdersSlice";
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
import "../orders.css";

const ConfirmMessage = () => {
  return (
    <div>
      <p>You are about to delete an order!</p>
      <p>This effects account balance as well!</p>
      <p>Please confirm!</p>
    </div>
  );
};

export default function SharesOrder(props) {
  const { id } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const order = useSelector((state) => selectSharesOrderById(state, id));
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
    onDelete();
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
      deleteSharesOrder({
        order: { id: order.id, type: order.type },
        account: { id: account.id, accountBalance: newAccountBalance },
      })
    ).unwrap();
  }

  return (
    <div className="page-container">
      <div className="page-wrapper">
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
        <div className="order-page-wrapper">
          <section className="page-header-wrapper">
            <header className="page-header">
              <Link to={`/investing/journal/${account.id}`}>
                <h4>Shares Order</h4>
              </Link>
            </header>
            <div className="orders-button-wrapper">
              <div>
                <Link
                  to={`/investing/orders/shares/edit/${id}`}
                  className="btn btn-add-new"
                >
                  Edit
                </Link>
              </div>
              <div>
                <button
                  className="btn btn-delete"
                  onClick={() => setShowConfirm(!showConfrim)}
                >
                  Delete
                </button>
              </div>
            </div>
          </section>

          <section>
            <table className="table orders-table">
              <thead>
                <tr>
                  <th>Ticker</th>
                  <th>Open Date</th>
                  <th>Close Date</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{order.ticker}</td>
                  <td>{dateToString(order.openDate)}</td>
                  <td>{dateToString(order.closeDate)}</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section>
            <table className="table orders-table">
              <thead>
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

          {strategy && (
            <section>
              <table className="table orders-table">
                <thead>
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
              <table className="table orders-table">
                <thead>
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
        </div>
      </div>
    </div>
  );
}

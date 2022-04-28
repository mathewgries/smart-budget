import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  selectSharesOrderById,
  updateSharesOrder,
} from "../../../../redux/investing/sharesOrdersSlice";
import { selectInvestingAccountByGSI } from "../../../../redux/investing/investingAccountsSlice";
import {
  selectActiveStrategy,
  activeStrategyRemoved,
  activeStrategyUpdated,
} from "../../../../redux/investing/strategiesSlice";
import { Link } from "react-router-dom";
import { onError } from "../../../../lib/errorLib";
import { inputDateFormat } from "../../../../helpers/dateFormat";
import {
  sharesProfitLossHandler,
  updateOrderHandler,
} from "../../../../helpers/currencyHandler";
import StrategyListGroup from "../StrategyListGroup";
import CurrencyInput from "../../../inputFields/CurrencyInput";
import "../orders.css";

export default function SharesOrderEdit(props) {
  const { id } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const order = useSelector((state) => selectSharesOrderById(state, id));
  const account = useSelector((state) =>
    selectInvestingAccountByGSI(state, order.GSI1_PK)
  );
  const activeStrategy = useSelector((state) => selectActiveStrategy(state));
  const [isSaving, setIsSaving] = useState(false);
  const [fields, setFields] = useState({
    ticker: order.ticker,
    openDate: inputDateFormat(order.openDate),
    closeDate: inputDateFormat(order.closeDate),
    orderSize: order.orderSize,
    openPrice: order.openPrice,
    closePrice: order.closePrice,
    tradeSide: order.tradeSide,
    commissions: order.commissions,
  });

  useEffect(() => {
    if (order.strategyId) {
      dispatch(activeStrategyUpdated(order.strategyId));
    } else {
      dispatch(activeStrategyRemoved());
    }
  }, [dispatch, order.strategyId]);

  useEffect(() => {
    if (isSaving) {
      history.push(`/investing/journal/${account.id}`);
    }
  }, [isSaving, history, account.id]);

  function validateForm() {
    return (
      fields.ticker === "" ||
      fields.openDate === "" ||
      fields.closeDate === "" ||
      fields.orderSize === "" ||
      fields.openPrice === "" ||
      fields.closePrice === "" ||
      fields.tradeSide === "" ||
      validateOpenAndCloseDates()
    );
  }

  function handleOnChange(e) {
    const { name, value } = e.target;
    setFields((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function validateOpenAndCloseDates() {
    const open = new Date(fields.openDate).getTime();
    const close = new Date(fields.closeDate).getTime();
    return open > close;
  }

  const handleCurrencyInput = ({ name, value }) => {
    setFields({ ...fields, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsSaving(true);
      const newPL = sharesProfitLossHandler(
        fields.orderSize,
        fields.openPrice,
        fields.closePrice,
        fields.tradeSide
      );
      const newAccountBalance = updateOrderHandler(
        order.profitLoss,
        newPL,
        order.commissions,
        fields.commissions,
        account.accountBalance
      );
      await handleUpdateOrder(newAccountBalance, newPL);
    } catch (e) {
      onError(e);
    }
  };

  const handleUpdateOrder = async (newAccountBalance, profitLoss) => {
    await dispatch(
      updateSharesOrder({
        order: {
          ...order,
          ...fields,
          openDate: Date.parse(fields.openDate),
          closeDate: Date.parse(fields.closeDate),
          profitLoss: profitLoss,
          strategyId: activeStrategy ? activeStrategy.id : null,
        },
        account: {
          id: account.id,
          accountBalance: newAccountBalance,
        },
      })
    ).unwrap();
  };

  return (
    <div className="page-container">
      <div className="page-wrapper">
        <div className="form-wrapper">
          <form onSubmit={handleSubmit}>
            <section className="page-header-wrapper">
              <header className="page-header">
                <Link to={`/investing/orders/shares/${id}`}>
                  <h4>Edit Shares Order</h4>
                </Link>
              </header>
              <div className="orders-button-wrapper">
                <div className="form-group">
                  <button
                    type="submit"
                    className="btn btn-add-new"
                    disabled={validateForm()}
                  >
                    Update
                  </button>
                </div>
                <div>
                  <Link
                    to={`/investing/orders/shares/${id}`}
                    className="btn btn-delete"
                  >
                    Cancel
                  </Link>
                </div>
              </div>
            </section>

            <section className="form-section">
              <div className="order-form-row-group-left">
                <div className="form-group">
                  <label htmlFor="ticker">Ticker</label>
                  <input
                    className="form-control"
                    type="text"
                    id="ticker"
                    name="ticker"
                    value={fields.ticker}
                    onChange={handleOnChange}
                    data-lpignore="true"
                  />
                </div>
                <div>
                  <CurrencyInput
                    inputName={"commissions"}
                    inputLabel={"Commissions"}
                    inputValue={fields.commissions}
                    inputChangeHandler={handleCurrencyInput}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="orderSize">Order Size</label>
                  <input
                    className="form-control"
                    type="text"
                    id="orderSize"
                    name="orderSize"
                    value={fields.orderSize}
                    onChange={handleOnChange}
                    data-lpignore="true"
                  />
                </div>
              </div>
              <div>
                <span style={{ fontSize: "12px", color: "red" }}>
                  {validateOpenAndCloseDates() &&
                    "Open must be less than or equal to close"}
                </span>
              </div>
              <div className="order-form-row-group">
                <div className="form-group">
                  <label htmlFor="openDate">Open Date</label>
                  <input
                    className="form-control"
                    type="date"
                    id="openDate"
                    name="openDate"
                    value={fields.openDate}
                    onChange={handleOnChange}
                    data-lpignore="true"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="closeDate">Close Date</label>
                  <input
                    className="form-control"
                    type="date"
                    id="closeDate"
                    name="closeDate"
                    value={fields.closeDate}
                    onChange={handleOnChange}
                    data-lpignore="true"
                  />
                </div>
              </div>
            </section>

            <section className="form-section">
              <div className="order-form-row-group">
                <div className="order-form-greek-group-wrapper">
                  <div className="order-form-greek-header">
                    <label>Share Price</label>
                  </div>
                  <div className="order-form-greek-group">
                    <div>
                      <CurrencyInput
                        inputName={"openPrice"}
                        inputLabel={"Open"}
                        inputValue={fields.openPrice}
                        inputChangeHandler={handleCurrencyInput}
                      />
                    </div>

                    <div>
                      <CurrencyInput
                        inputName={"closePrice"}
                        inputLabel={"Close"}
                        inputValue={fields.closePrice}
                        inputChangeHandler={handleCurrencyInput}
                      />
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label>Side</label>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="tradeSide"
                      id="tradeSide1"
                      value="LONG"
                      checked={fields.tradeSide === "LONG"}
                      onChange={handleOnChange}
                    />
                    <label className="form-check-label" htmlFor="tradeSide1">
                      LONG
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="tradeSide"
                      id="tradeSide2"
                      value="SHORT"
                      checked={fields.tradeSide === "SHORT"}
                      onChange={handleOnChange}
                    />
                    <label className="form-check-label" htmlFor="tradeSide1">
                      SHORT
                    </label>
                  </div>
                </div>
              </div>
            </section>
            <section>
              <StrategyListGroup />
            </section>
          </form>
        </div>
      </div>
    </div>
  );
}

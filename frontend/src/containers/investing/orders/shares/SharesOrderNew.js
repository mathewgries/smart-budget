import React, { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { saveNewSharesOrder } from "../../../../redux/investing/sharesOrdersSlice";
import { selectInvestingAccountById } from "../../../../redux/investing/investingAccountsSlice";
import { onError } from "../../../../lib/errorLib";
import { inputDateFormat } from "../../../../helpers/dateFormat";
import {
  sharesProfitLossHandler,
  addOrderHandler,
} from "../../../../helpers/currencyHandler";
import SignalsListGroup from "../SignalListGroup";
import CurrencyInput from "../../../inputFields/CurrencyInput";
import LoadingSpinner from "../../../../components/LoadingSpinner";

export default function SharesOrderNew(props) {
  const { id } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const account = useSelector((state) => selectInvestingAccountById(state, id));
  const status = useSelector((state) => state.sharesOrders.status)
  const [selectedSignals, setSelectedSignals] = useState([]);
  const [fields, setFields] = useState({
    ticker: "",
    openDate: inputDateFormat(new Date()),
    closeDate: inputDateFormat(new Date()),
    orderSize: "",
    openPrice: "0.00",
    closePrice: "0.00",
    tradeSide: "",
  });

  function validateForm() {
    return (
      fields.ticker === "" ||
      fields.openDate === "" ||
      fields.closeDate === "" ||
      fields.orderSize === "" ||
      fields.openPrice === "" ||
      fields.closePrice === "" ||
      fields.tradeSide === ""
    );
  }

  function handleOnChange(e) {
    const { name, value } = e.target;
    setFields((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  const handleCurrencyInput = ({ name, value }) => {
    setFields({ ...fields, [name]: value });
  };

  function handleSignalSelection(signal, action) {
    if (action) {
      setSelectedSignals([...selectedSignals, signal]);
    } else {
      setSelectedSignals(selectedSignals.filter((item) => item !== signal));
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { orderSize, openPrice, closePrice, tradeSide } = fields;

    try {
      const profitLoss = sharesProfitLossHandler(
        orderSize,
        openPrice,
        closePrice,
        tradeSide
      );
      const newAccountBalance = addOrderHandler(
        profitLoss,
        account.accountBalance
      );
      await handleSaveNewOrder(newAccountBalance, profitLoss);
      history.push(`/investing/journal/${id}`);
    } catch (e) {
      onError(e);
    }
  };

  const handleSaveNewOrder = async (newAccountBalance, profitLoss) => {
    await dispatch(
      saveNewSharesOrder({
        order: {
          ticker: fields.ticker,
          openDate: Date.parse(fields.openDate),
          closeDate: Date.parse(fields.closeDate),
          orderSize: fields.orderSize,
          openPrice: fields.openPrice,
          closePrice: fields.closePrice,
          tradeSide: fields.tradeSide,
          profitLoss: profitLoss,
          signalList: selectedSignals,
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
            <section className="order-form-header">
              <header>
                <h5>New Share Order</h5>
              </header>
              <div className="form-group">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={validateForm() || status === "pending"}
                >
                  {status === "pending" ? <LoadingSpinner text={"Saving"} /> : "Save"}
                </button>
              </div>
            </section>

            <section className="order-form-section">
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

            <section className="order-form-section">
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
              <SignalsListGroup
                handleSignalSelection={handleSignalSelection}
                selectedSignals={selectedSignals}
              />
            </section>
          </form>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  selectSharesOrderById,
  updateSharesOrder,
} from "../../../../redux/investing/sharesOrdersSlice";
import { selectInvestingAccountByGSI } from "../../../../redux/investing/investingAccountsSlice";
import { onError } from "../../../../lib/errorLib";
import { inputDateFormat } from "../../../../helpers/dateFormat";
import {
  sharesProfitLossHandler,
  updateOrderHandler,
} from "../../../../helpers/currencyHandler";
import SignalsListGroup from "../SignalListGroup";
import CurrencyInput from "../../../inputFields/CurrencyInput";
import LoadingSpinner from "../../../../components/LoadingSpinner";

export default function SharesOrderEdit(props) {
  const { id } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const order = useSelector((state) => selectSharesOrderById(state, id));
  const account = useSelector((state) =>
    selectInvestingAccountByGSI(state, order.GSI1_PK)
  );
  const [isSaving, setIsSaving] = useState(false);
  const [selectedSignals, setSelectedSignals] = useState([]);
  const [fields, setFields] = useState({
    ticker: "",
    openDate: "",
    closeDate: "",
    orderSize: "",
    openPrice: "",
    closePrice: "",
    tradeSide: "",
  });

  useEffect(() => {
    setFields({
      ticker: order.ticker,
      openDate: inputDateFormat(order.openDate),
      closeDate: inputDateFormat(order.closeDate),
      orderSize: order.orderSize,
      openPrice: order.openPrice,
      closePrice: order.closePrice,
      tradeSide: order.tradeSide,
    });
    setSelectedSignals(order.signalList);
  }, [order]);

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
      setIsSaving(true);
      const newPL = sharesProfitLossHandler(
        orderSize,
        openPrice,
        closePrice,
        tradeSide
      );
      const newAccountBalance = updateOrderHandler(
        order.profitLoss,
        newPL,
        account.accountBalance
      );
      await handleUpdateOrder(newAccountBalance, newPL);
      history.push(`/investing/journal/${account.id}`);
    } catch (e) {
      onError(e);
      setIsSaving(false);
    }
  };

  const handleUpdateOrder = async (newAccountBalance, profitLoss) => {
    await dispatch(
      updateSharesOrder({
        order: {
          id: order.id,
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
                <h5>Edit Share Order</h5>
              </header>
              <div className="form-group">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={validateForm() || isSaving}
                >
                  {isSaving ? <LoadingSpinner text={"Updating"}/> : "Update"}
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

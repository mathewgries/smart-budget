import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  updateVerticalSpreadOrder,
  selectVerticalSpreadsOrderById,
} from "../../../../redux/investing/verticalSpreadsOrdersSlice";
import {
  selectInvestingAccountByGSI,
  updateInvestingAccountBalance,
} from "../../../../redux/investing/investingAccountsSlice";
import { onError } from "../../../../lib/errorLib";
import { inputDateFormat } from "../../../../helpers/dateFormat";
import {
  optionsProfitLossHandler,
  updateOrderHandler,
} from "../../../../helpers/currencyHandler";
import SignalsListGroup from "../SignalListGroup";
import CurrencyInput from "../../../inputFields/CurrencyInput";
import LoadingSpinner from "../../../../components/LoadingSpinner";

export default function VerticalSpreadsOrderEdit(props) {
  const { id } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const order = useSelector((state) =>
    selectVerticalSpreadsOrderById(state, id)
  );
  const account = useSelector((state) =>
    selectInvestingAccountByGSI(state, order.GSI1_PK)
  );
  const [isSaving, setIsSaving] = useState(false);
  const [selectedSignals, setSelectedSignals] = useState([]);
  const [openGreeks, setOpenGreeks] = useState(false);

  const [fields, setFields] = useState({
    ticker: "",
    openDate: inputDateFormat(new Date()),
    closeDate: inputDateFormat(new Date()),
    orderSize: "",
    openPrice: "",
    closePrice: "",
    openUnderlyingPrice: "",
    closeUnderlyingPrice: "",
    strikeUpperLegPrice: "",
    strikeLowerLegPrice: "",
    contractType: "",
    tradeSide: "",
    spreadExpirationDate: inputDateFormat(new Date()),
    openDelta: "",
    closeDelta: "",
    openGamma: "",
    closeGamma: "",
    openVega: "",
    closeVega: "",
    openTheta: "",
    closeTheta: "",
    openImpliedVolatility: "",
    closeImpliedVolatility: "",
  });

  useEffect(() => {
    setFields({
      ticker: order.ticker,
      openDate: order.openDate,
      closeDate: order.closeDate,
      orderSize: order.orderSize,
      openPrice: order.openPrice,
      closePrice: order.closePrice,
      openUnderlyingPrice: order.openUnderlyingPrice,
      closeUnderlyingPrice: order.closeUnderlyingPrice,
      strikeUpperLegPrice: order.strikeUpperLegPrice,
      strikeLowerLegPrice: order.strikeLowerLegPrice,
      contractType: order.contractType,
      tradeSide: order.tradeSide,
      spreadExpirationDate: order.spreadExpirationDate,
      openDelta: order.openDelta,
      closeDelta: order.closeDelta,
      openGamma: order.openGamma,
      closeGamma: order.closeGamma,
      openVega: order.openVega,
      closeVega: order.closeVega,
      openTheta: order.openTheta,
      closeTheta: order.closeTheta,
      openImpliedVolatility: order.openImpliedVolatility,
      closeImpliedVolatility: order.closeImpliedVolatility,
    });
    setSelectedSignals(order.signalList);
  }, [order]);

  const saveDisabled =
    fields.ticker === "" ||
    fields.openDate === "" ||
    fields.closeDate === "" ||
    fields.orderSize === "" ||
    fields.openPrice === "" ||
    fields.closePrice === "" ||
    fields.strikeUpperLegPrice === "" ||
    fields.strikeLowerLegPrice === "" ||
    fields.contractType === "" ||
    fields.tradeSide === "" ||
    fields.spreadExpirationDate === "";

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
      const newPL = optionsProfitLossHandler(
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
      dispatch(
        updateInvestingAccountBalance({
          id: account.id,
          accountBalance: newAccountBalance,
        })
      );
      history.push(`/investing/journal/${account.id}`);
    } catch (e) {
      onError(e);
    }
  };

  const handleUpdateOrder = async (newAccountBalance, profitLoss) => {
    await dispatch(
      updateVerticalSpreadOrder({
        id: order.id,
        accountId: account.id,
        accountBalance: newAccountBalance,
        ticker: fields.ticker,
        openDate: fields.openDate,
        closeDate: fields.closeDate,
        orderSize: fields.orderSize,
        openPrice: fields.openPrice,
        closePrice: fields.closePrice,
        openUnderlyingPrice: fields.openUnderlyingPrice,
        closeUnderlyingPrice: fields.closeUnderlyingPrice,
        strikeUpperLegPrice: fields.strikeUpperLegPrice,
        strikeLowerLegPrice: fields.strikeLowerLegPrice,
        contractType: fields.contractType,
        tradeSide: fields.tradeSide,
        spreadExpirationDate: fields.spreadExpirationDate,
        openDelta: fields.openDelta,
        closeDelta: fields.closeDelta,
        openGamma: fields.openGamma,
        closeGamma: fields.closeGamma,
        openVega: fields.openVega,
        closeVega: fields.closeVega,
        openTheta: fields.openTheta,
        closeTheta: fields.closeTheta,
        openImpliedVolatility: fields.openImpliedVolatility,
        closeImpliedVolatility: fields.closeImpliedVolatility,
        profitLoss: profitLoss,
        signalList: selectedSignals,
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
                <h5>Edit Vertical Spread Order</h5>
              </header>
              <div className="form-group">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={saveDisabled || isSaving}
                >
                  {isSaving ? <LoadingSpinner /> : "Update"}
                </button>
              </div>
            </section>

            <section className="order-form-section">
              <div className="order-form-row-group">
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
                  <label htmlFor="spreadExpirationDate">Expiration</label>
                  <input
                    className="form-control"
                    type="date"
                    id="spreadExpirationDate"
                    name="spreadExpirationDate"
                    value={fields.spreadExpirationDate}
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

            <section>
              <SignalsListGroup
                handleSignalSelection={handleSignalSelection}
                selectedSignals={selectedSignals}
              />
            </section>

            <section className="order-form-section">
              <div className="order-form-row-group">
                <div>
                  <CurrencyInput
                    inputName={"openPrice"}
                    inputLabel={"Open Value"}
                    inputValue={fields.openPrice}
                    inputChangeHandler={handleCurrencyInput}
                  />
                </div>

                <div>
                  <CurrencyInput
                    inputName={"closePrice"}
                    inputLabel={"Close Value"}
                    inputValue={fields.closePrice}
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
            </section>

            <section className="order-form-section">
              <div className="order-form-row-group">
                <div className="order-form-greek-group-wrapper">
                  <div className="order-form-greek-header">
                    <label>Strikes</label>
                  </div>
                  <div className="order-form-greek-group">
                    <div className="form-group">
                      <label htmlFor="strikeUpperLegPrice">Upper Leg</label>
                      <input
                        className="form-control"
                        type="text"
                        id="strikeUpperLegPrice"
                        name="strikeUpperLegPrice"
                        value={fields.strikeUpperLegPrice}
                        onChange={handleOnChange}
                        data-lpignore="true"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="strikeLowerLegPrice">Lower Leg</label>
                      <input
                        className="form-control"
                        type="text"
                        id="strikeLowerLegPrice"
                        name="strikeLowerLegPrice"
                        value={fields.strikeLowerLegPrice}
                        onChange={handleOnChange}
                        data-lpignore="true"
                      />
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <label>Contract</label>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="contractType"
                      id="contractType1"
                      value="CALL"
                      checked={fields.contractType === "CALL"}
                      onChange={handleOnChange}
                    />
                    <label className="form-check-label" htmlFor="contractType1">
                      CALL
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="contractType"
                      id="contractType2"
                      value="PUT"
                      checked={fields.contractType === "PUT"}
                      onChange={handleOnChange}
                    />
                    <label className="form-check-label" htmlFor="contractType2">
                      PUT
                    </label>
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

            <section className="order-form-section">
              <div className="order-form-row-group">
                <div className="order-form-greek-group-wrapper">
                  <div className="order-form-greek-header">
                    <label>Underlying Share Price</label>
                  </div>
                  <div className="order-form-greek-group">
                    <div>
                      <CurrencyInput
                        inputName={"openUnderlyingPrice"}
                        inputLabel={"Open"}
                        inputValue={fields.openUnderlyingPrice}
                        inputChangeHandler={handleCurrencyInput}
                      />
                    </div>

                    <div>
                      <CurrencyInput
                        inputName={"closeUnderlyingPrice"}
                        inputLabel={"Close"}
                        inputValue={fields.closeUnderlyingPrice}
                        inputChangeHandler={handleCurrencyInput}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="order-accordian-section">
              <div className="order-type-accordian">
                <div className="order-type-accordian-item">
                  <div
                    className="order-type-accordian-title"
                    onClick={() => setOpenGreeks(!openGreeks)}
                  >
                    <div>
                      Greeks <span>(optional)</span>
                    </div>
                    <div>{openGreeks ? "-" : "+"}</div>
                  </div>
                  {openGreeks && (
                    <div>
                      <div className="order-form-row-group">
                        <div className="order-form-greek-group-wrapper">
                          <div className="order-form-greek-header">
                            <label>Delta</label>
                          </div>
                          <div className="order-form-greek-group">
                            <div className="form-group">
                              <label htmlFor="openDelta">Open</label>
                              <input
                                className="form-control"
                                type="text"
                                id="openDelta"
                                name="openDelta"
                                value={fields.openDelta}
                                onChange={handleOnChange}
                                data-lpignore="true"
                              />
                            </div>
                            <div className="form-group">
                              <label htmlFor="closeDelta">Close</label>
                              <input
                                className="form-control"
                                type="text"
                                id="closeDelta"
                                name="closeDelta"
                                value={fields.closeDelta}
                                onChange={handleOnChange}
                                data-lpignore="true"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="order-form-greek-group-wrapper">
                          <div className="order-form-greek-header">
                            <label>Gamma</label>
                          </div>
                          <div className="order-form-greek-group">
                            <div className="form-group">
                              <label htmlFor="openGamma">Open</label>
                              <input
                                className="form-control"
                                type="text"
                                id="openGamma"
                                name="openGamma"
                                value={fields.openGamma}
                                onChange={handleOnChange}
                                data-lpignore="true"
                              />
                            </div>
                            <div className="form-group">
                              <label htmlFor="closeGamma">Close</label>
                              <input
                                className="form-control"
                                type="text"
                                id="closeGamma"
                                name="closeGamma"
                                value={fields.closeGamma}
                                onChange={handleOnChange}
                                data-lpignore="true"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="order-form-row-group">
                        <div className="order-form-greek-group-wrapper">
                          <div className="order-form-greek-header">
                            <label>Vega</label>
                          </div>
                          <div className="order-form-greek-group">
                            <div className="form-group">
                              <label htmlFor="openVega">Open</label>
                              <input
                                className="form-control"
                                type="text"
                                id="openVega"
                                name="openVega"
                                value={fields.openVega}
                                onChange={handleOnChange}
                                data-lpignore="true"
                              />
                            </div>
                            <div className="form-group">
                              <label htmlFor="closeVega">Close</label>
                              <input
                                className="form-control"
                                type="text"
                                id="closeVega"
                                name="closeVega"
                                value={fields.closeVega}
                                onChange={handleOnChange}
                                data-lpignore="true"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="order-form-greek-group-wrapper">
                          <div className="order-form-greek-header">
                            <label>Theta</label>
                          </div>
                          <div className="order-form-greek-group">
                            <div className="form-group">
                              <label htmlFor="openTheta">Open</label>
                              <input
                                className="form-control"
                                type="text"
                                id="openTheta"
                                name="openTheta"
                                value={fields.openTheta}
                                onChange={handleOnChange}
                                data-lpignore="true"
                              />
                            </div>
                            <div className="form-group">
                              <label htmlFor="closeTheta">Close</label>
                              <input
                                className="form-control"
                                type="text"
                                id="closeTheta"
                                name="closeTheta"
                                value={fields.closeTheta}
                                onChange={handleOnChange}
                                data-lpignore="true"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="order-form-row-group">
                        <div className="form-group">
                          <label htmlFor="openImpliedVolatility">
                            Open I.V.
                          </label>
                          <input
                            className="form-control"
                            type="text"
                            id="openImpliedVolatility"
                            name="openImpliedVolatility"
                            value={fields.openImpliedVolatility}
                            onChange={handleOnChange}
                            data-lpignore="true"
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="closeImpliedVolatility">
                            Close I.V.
                          </label>
                          <input
                            className="form-control"
                            type="text"
                            id="closeImpliedVolatility"
                            name="closeImpliedVolatility"
                            value={fields.closeImpliedVolatility}
                            onChange={handleOnChange}
                            data-lpignore="true"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>
          </form>
        </div>
      </div>
    </div>
  );
}

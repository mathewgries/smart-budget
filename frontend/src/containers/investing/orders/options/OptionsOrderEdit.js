import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  selectOptionsOrderById,
  updateOptionsOrder,
} from "../../../../redux/investing/optionsOrdersSlice";
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

export default function OptionsOrderEdit(props) {
  const { id } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const order = useSelector((state) => selectOptionsOrderById(state, id));
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
    strikePrice: "",
    contractType: "",
    tradeSide: "",
    contractExpirationDate: inputDateFormat(new Date()),
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
      strikePrice: order.strikePrice,
      contractType: order.contractType,
      tradeSide: order.tradeSide,
      contractExpirationDate: order.contractExpirationDate,
      openDelta: order.openDelta || "",
      closeDelta: order.closeDelta || "",
      openGamma: order.openGamma || "",
      closeGamma: order.closeGamma || "",
      openVega: order.openVega || "",
      closeVega: order.closeVega || "",
      openTheta: order.openTheta || "",
      closeTheta: order.closeTheta || "",
      openImpliedVolatility: order.openImpliedVolatility || "",
      closeImpliedVolatility: order.closeImpliedVolatility || "",
    });
    setSelectedSignals(order.signalList);
  }, [order]);

  const saveDisabled =
    fields.ticker === "" ||
    fields.orderSize === "" ||
    fields.openPrice === "" ||
    fields.closePrice === "" ||
    fields.strikePrice === "" ||
    fields.contractType === "" ||
    fields.tradeSide === "";

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
      setIsSaving(false);
    }
  };

  const handleUpdateOrder = async (newAccountBalance, profitLoss) => {
    await dispatch(
      updateOptionsOrder({
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
        strikePrice: fields.strikePrice,
        contractType: fields.contractType,
        tradeSide: fields.tradeSide,
        contractExpirationDate: fields.contractExpirationDate,
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
                <h5>Edit Option Order</h5>
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
                  <label htmlFor="contractExpirationDate">Expiration</label>
                  <input
                    className="form-control"
                    type="date"
                    id="contractExpirationDate"
                    name="contractExpirationDate"
                    value={fields.contractExpirationDate}
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
                editPage={true}
              />
            </section>

            <section className="order-form-section">
              <div className="order-form-row-group">
                <div>
                  <CurrencyInput
                    inputName={"openPrice"}
                    inputLabel={"Open Price"}
                    inputValue={fields.openPrice}
                    inputChangeHandler={handleCurrencyInput}
                  />
                </div>

                <div>
                  <CurrencyInput
                    inputName={"closePrice"}
                    inputLabel={"Close Price"}
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
                <div className="form-group">
                  <label htmlFor="strikePrice">Strike Price</label>
                  <input
                    className="form-control"
                    type="text"
                    id="strikePrice"
                    name="strikePrice"
                    value={fields.strikePrice}
                    onChange={handleOnChange}
                    data-lpignore="true"
                  />
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
                        inputValue={fields.openUnderlyingPrice || "0.00"}
                        inputChangeHandler={handleCurrencyInput}
                      />
                    </div>

                    <div>
                      <CurrencyInput
                        inputName={"closeUnderlyingPrice"}
                        inputLabel={"Close"}
                        inputValue={fields.closeUnderlyingPrice || "0.00"}
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
                            <div>
                              <CurrencyInput
                                inputName={"openDelta"}
                                inputLabel={`Open ${fields.contractType === "PUT" ? "(-)" : "(+)"}`}
                                inputValue={fields.openDelta || "0.00"}
                                inputChangeHandler={handleCurrencyInput}
                              />
                            </div>

                            <div>
                              <CurrencyInput
                                inputName={"closeDelta"}
                                inputLabel={`Close  ${fields.contractType === "PUT" ? "(-)" : "(+)"}`}
                                inputValue={fields.closeDelta || "0.00"}
                                inputChangeHandler={handleCurrencyInput}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="order-form-greek-group-wrapper">
                          <div className="order-form-greek-header">
                            <label>Gamma</label>
                          </div>
                          <div className="order-form-greek-group">
                            <div>
                              <CurrencyInput
                                inputName={"openGamma"}
                                inputLabel={"Open"}
                                inputValue={fields.openGamma || "0.00"}
                                inputChangeHandler={handleCurrencyInput}
                              />
                            </div>

                            <div>
                              <CurrencyInput
                                inputName={"closeGamma"}
                                inputLabel={"Close"}
                                inputValue={fields.closeGamma || "0.00"}
                                inputChangeHandler={handleCurrencyInput}
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
                            <div>
                              <CurrencyInput
                                inputName={"openVega"}
                                inputLabel={"Open"}
                                inputValue={fields.openVega || "0.00"}
                                inputChangeHandler={handleCurrencyInput}
                              />
                            </div>

                            <div>
                              <CurrencyInput
                                inputName={"closeVega"}
                                inputLabel={"Close"}
                                inputValue={fields.closeVega || "0.00"}
                                inputChangeHandler={handleCurrencyInput}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="order-form-greek-group-wrapper">
                          <div className="order-form-greek-header">
                            <label>Theta</label>
                          </div>
                          <div className="order-form-greek-group">
                            <div>
                              <CurrencyInput
                                inputName={"openTheta"}
                                inputLabel={"Open"}
                                inputValue={fields.openTheta || "0.00"}
                                inputChangeHandler={handleCurrencyInput}
                              />
                            </div>

                            <div>
                              <CurrencyInput
                                inputName={"closeTheta"}
                                inputLabel={"Close"}
                                inputValue={fields.closeTheta || "0.00"}
                                inputChangeHandler={handleCurrencyInput}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="order-form-row-group">
                        <div>
                          <CurrencyInput
                            inputName={"openImpliedVolatility"}
                            inputLabel={"Open I.V."}
                            inputValue={fields.openImpliedVolatility || "0.00"}
                            inputChangeHandler={handleCurrencyInput}
                          />
                        </div>

                        <div>
                          <CurrencyInput
                            inputName={"closeImpliedVolatility"}
                            inputLabel={"Close I.V."}
                            inputValue={fields.closeImpliedVolatility || "0.00"}
                            inputChangeHandler={handleCurrencyInput}
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

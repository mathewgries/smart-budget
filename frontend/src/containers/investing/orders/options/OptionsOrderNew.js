import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { saveNewOptionsOrder } from "../../../../redux/investing/optionsOrdersSlice";
import { selectInvestingAccountById } from "../../../../redux/investing/investingAccountsSlice";
import {
  selectActiveStrategy,
  activeStrategyRemoved,
} from "../../../../redux/investing/strategiesSlice";
import { onError } from "../../../../lib/errorLib";
import { inputDateFormat } from "../../../../helpers/dateFormat";
import {
  optionsProfitLossHandler,
  addOrderHandler,
} from "../../../../helpers/currencyHandler";
import StrategyListGroup from "../StrategyListGroup";
import CurrencyInput from "../../../inputFields/CurrencyInput";

export default function OptionsOrderNew(props) {
  const { id } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const account = useSelector((state) => selectInvestingAccountById(state, id));
  const activeStrategy = useSelector((state) => selectActiveStrategy(state));
  const [isSaving, setIsSaving] = useState(false);
  const [openGreeks, setOpenGreeks] = useState(false);
  const [fields, setFields] = useState({
    ticker: "",
    openDate: inputDateFormat(new Date()),
    closeDate: inputDateFormat(new Date()),
    orderSize: "",
    openPrice: "0.00",
    closePrice: "0.00",
    openUnderlyingPrice: "0.00",
    closeUnderlyingPrice: "0.00",
    strikePrice: "",
    contractType: "",
    tradeSide: "",
    contractExpirationDate: inputDateFormat(new Date()),
    openDelta: "0.00",
    closeDelta: "0.00",
    openGamma: "0.00",
    closeGamma: "0.00",
    openVega: "0.00",
    closeVega: "0.00",
    openTheta: "0.00",
    closeTheta: "0.00",
    openImpliedVolatility: "0.00",
    closeImpliedVolatility: "0.00",
  });

  useEffect(() => {
    dispatch(activeStrategyRemoved());
  }, [dispatch]);

  useEffect(() => {
    if (isSaving) {
      history.push(`/investing/journal/${id}`);
    }
  }, [isSaving, history, id]);

  function validateForm() {
    return (
      fields.ticker === "" ||
      fields.orderSize === "" ||
      fields.openPrice === "" ||
      fields.closePrice === "" ||
      fields.strikePrice === "" ||
      fields.contractType === "" ||
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsSaving(true);
      const profitLoss = optionsProfitLossHandler(
        fields.orderSize,
        fields.openPrice,
        fields.closePrice,
        fields.tradeSide
      );
      const newAccountBalance = addOrderHandler(
        profitLoss,
        account.accountBalance
      );
      await handleSaveNewOrder(newAccountBalance, profitLoss);
    } catch (e) {
      onError(e);
    }
  };

  const handleSaveNewOrder = async (newAccountBalance, profitLoss) => {
    await dispatch(
      saveNewOptionsOrder({
        order: {
          ticker: fields.ticker,
          openDate: Date.parse(fields.openDate),
          closeDate: Date.parse(fields.closeDate),
          orderSize: fields.orderSize,
          openPrice: fields.openPrice,
          closePrice: fields.closePrice,
          openUnderlyingPrice: fields.openUnderlyingPrice,
          closeUnderlyingPrice: fields.closeUnderlyingPrice,
          strikePrice: fields.strikePrice,
          contractType: fields.contractType,
          tradeSide: fields.tradeSide,
          contractExpirationDate: Date.parse(fields.contractExpirationDate),
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
          strategyId: activeStrategy ? activeStrategy.id : null,
          strategyName: activeStrategy ? activeStrategy.strategyName : null,
        },
        account: { id: account.id, accountBalance: newAccountBalance },
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
                <h5>New Option Order</h5>
              </header>
              <div className="form-group">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={validateForm()}
                >
                  Save
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
              <StrategyListGroup />
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
                            <div>
                              <CurrencyInput
                                inputName={"openDelta"}
                                inputLabel={`Open ${
                                  fields.contractType === "PUT" ? "(-)" : "(+)"
                                }`}
                                inputValue={fields.openDelta}
                                inputChangeHandler={handleCurrencyInput}
                              />
                            </div>

                            <div>
                              <CurrencyInput
                                inputName={"closeDelta"}
                                inputLabel={`Close  ${
                                  fields.contractType === "PUT" ? "(-)" : "(+)"
                                }`}
                                inputValue={fields.closeDelta}
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
                                inputValue={fields.openGamma}
                                inputChangeHandler={handleCurrencyInput}
                              />
                            </div>

                            <div>
                              <CurrencyInput
                                inputName={"closeGamma"}
                                inputLabel={"Close"}
                                inputValue={fields.closeGamma}
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
                                inputValue={fields.openVega}
                                inputChangeHandler={handleCurrencyInput}
                              />
                            </div>

                            <div>
                              <CurrencyInput
                                inputName={"closeVega"}
                                inputLabel={"Close"}
                                inputValue={fields.closeVega}
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
                                inputLabel={"Open (-)"}
                                inputValue={fields.openTheta}
                                inputChangeHandler={handleCurrencyInput}
                              />
                            </div>

                            <div>
                              <CurrencyInput
                                inputName={"closeTheta"}
                                inputLabel={"Close (-)"}
                                inputValue={fields.closeTheta}
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
                            inputValue={fields.openImpliedVolatility}
                            inputChangeHandler={handleCurrencyInput}
                          />
                        </div>

                        <div>
                          <CurrencyInput
                            inputName={"closeImpliedVolatility"}
                            inputLabel={"Close I.V."}
                            inputValue={fields.closeImpliedVolatility}
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

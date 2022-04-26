import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  updateVerticalSpreadOrder,
  selectVerticalSpreadsOrderById,
} from "../../../../redux/investing/verticalSpreadsOrdersSlice";
import { selectInvestingAccountByGSI } from "../../../../redux/investing/investingAccountsSlice";
import {
  selectActiveStrategy,
  activeStrategyRemoved,
  activeStrategyUpdated,
} from "../../../../redux/investing/strategiesSlice";
import { onError } from "../../../../lib/errorLib";
import { inputDateFormat } from "../../../../helpers/dateFormat";
import {
  optionsProfitLossHandler,
  updateOrderHandler,
} from "../../../../helpers/currencyHandler";
import StrategyListGroup from "../StrategyListGroup";
import CurrencyInput from "../../../inputFields/CurrencyInput";
import "../orders.css"

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
  const activeStrategy = useSelector((state) => selectActiveStrategy(state));
  const [isSaving, setIsSaving] = useState(false);
  const [openGreeks, setOpenGreeks] = useState(false);
  const [fields, setFields] = useState({
    ticker: order.ticker,
    openDate: inputDateFormat(order.openDate),
    closeDate: inputDateFormat(order.closeDate),
    orderSize: order.orderSize,
    openPrice: order.openPrice,
    closePrice: order.closePrice,
    openUnderlyingPrice: order.openUnderlyingPrice,
    closeUnderlyingPrice: order.closeUnderlyingPrice,
    strikeUpperLegPrice: order.strikeUpperLegPrice,
    strikeLowerLegPrice: order.strikeLowerLegPrice,
    contractType: order.contractType,
    tradeSide: order.tradeSide,
    spreadExpirationDate: inputDateFormat(order.spreadExpirationDate),
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
      fields.strikeUpperLegPrice === "" ||
      fields.strikeLowerLegPrice === "" ||
      fields.contractType === "" ||
      fields.tradeSide === "" ||
      fields.spreadExpirationDate === "" ||
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
      const newPL = optionsProfitLossHandler(
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
      updateVerticalSpreadOrder({
        order: {
          ...order,
          ...fields,
          openDate: Date.parse(fields.openDate),
          closeDate: Date.parse(fields.closeDate),
          spreadExpirationDate: Date.parse(fields.spreadExpirationDate),
          profitLoss: profitLoss,
          strategyId: activeStrategy ? activeStrategy.id : null,
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
            <section className="form-header">
              <header>
                <h5>Edit Vertical Spread Order</h5>
              </header>
              <div className="form-group">
                <button
                  type="submit"
                  className="btn btn-add-new"
                  disabled={validateForm()}
                >
                  Update
                </button>
              </div>
            </section>

            <section className="form-section">
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
                <div>
                  <CurrencyInput
                    inputName={"commissions"}
                    inputLabel={"Commissions"}
                    inputValue={fields.commissions}
                    inputChangeHandler={handleCurrencyInput}
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
              <div>
                <span style={{ fontSize: "12px", color: "coral" }}>
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

            <section>
              <StrategyListGroup />
            </section>

            <section className="form-section">
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

            <section className="form-section">
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

            <section className="form-section">
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
                                inputLabel={"Open"}
                                inputValue={fields.openDelta}
                                inputChangeHandler={handleCurrencyInput}
                              />
                            </div>

                            <div>
                              <CurrencyInput
                                inputName={"closeDelta"}
                                inputLabel={"Close"}
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
                                inputLabel={"Open"}
                                inputValue={fields.openTheta}
                                inputChangeHandler={handleCurrencyInput}
                              />
                            </div>

                            <div>
                              <CurrencyInput
                                inputName={"closeTheta"}
                                inputLabel={"Close"}
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

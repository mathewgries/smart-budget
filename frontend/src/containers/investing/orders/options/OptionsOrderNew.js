import React, { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { saveNewOptionsOrder } from "../../../../redux/investing/investingOrdersSlice";
import {
  selectInvestingAccountById,
  updateInvestingAccountBalance,
} from "../../../../redux/investing/investingAccountsSlice";
import { onError } from "../../../../lib/errorLib";
import { inputDateFormat } from "../../../../helpers/dateFormat";
import {
  optionsProfitLossHandler,
  addOrderHandler,
} from "../../../../helpers/currencyHandler";
import LoadingSpinner from "../../../../components/LoadingSpinner";

export default function OptionsOrderNew(props) {
  const { id } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const account = useSelector((state) => selectInvestingAccountById(state, id));
  const [isSaving, setIsSaving] = useState(false);

  const [fields, setFields] = useState({
    ticker: "",
    openDate: inputDateFormat(new Date()),
    closeDate: inputDateFormat(new Date()),
    orderSize: "",
    openContractPrice: "",
    closeContractPrice: "",
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

  const saveDisabled =
    fields.ticker === "" ||
    fields.orderSize === "" ||
    fields.openContractPrice === "" ||
    fields.closeContractPrice === "" ||
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { orderSize, openContractPrice, closeContractPrice, tradeSide } =
      fields;

    try {
      setIsSaving(true);
      const profitLoss = optionsProfitLossHandler(
        orderSize,
        openContractPrice,
        closeContractPrice,
        tradeSide
      );
      const newAccountBalance = addOrderHandler(
        profitLoss,
        account.accountBalance
      );
      await handleSaveNewOrder(newAccountBalance, profitLoss);
      dispatch(
        updateInvestingAccountBalance({
          accountId: account.id,
          accountBalance: newAccountBalance,
        })
      );
      history.push(`/investing/journal/${id}`);
    } catch (e) {
      onError(e);
    }
  };

  const handleSaveNewOrder = async (newAccountBalance, profitLoss) => {
    await dispatch(
      saveNewOptionsOrder({
        accountId: account.id,
        accountBalance: newAccountBalance,
        ticker: fields.ticker,
        openDate: fields.openDate,
        closeDate: fields.closeDate,
        orderSize: fields.orderSize,
        openContractPrice: fields.openContractPrice,
        closeContractPrice: fields.closeContractPrice,
        strikePrice: fields.strikePrice,
        contractType: fields.contractType,
        tradeSide: fields.tradeSide,
        contractExpirationDate: fields.contractExpirationDate,
        openDelta: fields.openDelta,
        closeDelta: fields.closeDate,
        openGamma: fields.openGamma,
        closeGamma: fields.closeGamma,
        openVega: fields.openVega,
        closeVega: fields.closeVega,
        openTheta: fields.openTheta,
        closeTheta: fields.closeTheta,
        openImpliedVolatility: fields.openImpliedVolatility,
        closeImpliedVolatility: fields.closeImpliedVolatility,
        profitLoss: profitLoss,
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
                  disabled={saveDisabled || isSaving}
                >
                  {isSaving ? <LoadingSpinner /> : "Save"}
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

            <section className="order-form-section">
              <div className="order-form-row-group">
                <div className="form-group">
                  <label htmlFor="openContractPrice">Open Price</label>
                  <input
                    className="form-control"
                    type="text"
                    id="openContractPrice"
                    name="openContractPrice"
                    value={fields.openContractPrice}
                    onChange={handleOnChange}
                    data-lpignore="true"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="closeContractPrice">Close Price</label>
                  <input
                    className="form-control"
                    type="text"
                    id="closeContractPrice"
                    name="closeContractPrice"
                    value={fields.closeContractPrice}
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
                  <label htmlFor="openImpliedVolatility">Open I.V.</label>
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
                  <label htmlFor="closeImpliedVolatility">Close I.V.</label>
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
            </section>
          </form>
        </div>
      </div>
    </div>
  );
}

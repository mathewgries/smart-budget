import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addNewInvestingOrder } from "../../../redux/investing/investingOrdersSlice";
import {
  selectInvestingAccountById,
  updateInvestingAccountBalance,
} from "../../../redux/investing/investingAccountsSlice";
import { onError } from "../../../lib/errorLib";
import "../style.css";

export default function InvestingOrdersNew(props) {
  const { id } = useParams();
  const dispatch = useDispatch();
  const account = useSelector((state) => selectInvestingAccountById(state, id));
  const [fields, setFields] = useState({
    ticker: "",
    openDate: "",
    closeDate: "",
    strikePrice: "",
    orderSide: "LONG",
    orderSize: 0,
    contractType: "CALL",
    openPrice: 0,
    closePrice: 0,
    result: "",
    resultDollars: 0,
    resultPercent: 0,
  });

  function handleOnChange(e) {
    const { name, value } = e.target;
    setFields({ ...fields, [name]: value });
  }

  const handleSubmit = async () => {
    const result = getResult();
    const resultDollars = getResultDollars();
    const resultPercent = getResultPercent();
    const newAccountBalance = getNewAccountBalance(result, resultDollars);
    const body = {
      accountId: id,
      ...fields,
      result,
      resultDollars,
      resultPercent,
      accountBalance: newAccountBalance,
    };
    try {
      await dispatch(addNewInvestingOrder(body)).unwrap();
      dispatch(
        updateInvestingAccountBalance({
          accountId: account.id,
          accountBalance: newAccountBalance,
        })
      );
    } catch (e) {
      onError(e);
    }
  };

  function getResult() {
    const { orderSide, openPrice, closePrice } = fields;
    if (orderSide === "LONG") {
      return openPrice < closePrice ? "win" : "loss";
    } else if (orderSide === "SHORT") {
      return openPrice > closePrice ? "win" : "loss";
    }
  }

  function getResultDollars() {
    const { orderSide, openPrice, closePrice } = fields;
    let result;
    if (orderSide === "LONG") {
      result =
        openPrice < closePrice
          ? closePrice - openPrice
          : openPrice - closePrice;
    } else if (orderSide === "SHORT") {
      result =
        openPrice > closePrice
          ? closePrice - openPrice
          : openPrice - closePrice;
    }
    return (result * 100).toFixed(2);
  }

  function getResultPercent() {
    // (new - old)/old
    const { orderSide, openPrice, closePrice } = fields;
    let result;
    if (orderSide === "LONG") {
      result = (closePrice - openPrice) / openPrice;
    } else if (orderSide === "SHORT") {
      result = (openPrice - closePrice) / closePrice;
    }
    return (result * 100).toFixed(2);
  }

  function getNewAccountBalance(result, resultDollars) {
    const accountBalance  = Number.parseFloat(account.accountBalance);
    let newAccountBalance;
    if (result === "win") {
      newAccountBalance = Number.parseFloat(accountBalance) + Number.parseFloat(resultDollars);
    } else if (result === "loss") {
      newAccountBalance = Number.parseFloat(accountBalance) - Number.parseFloat(resultDollars);
    }
    return newAccountBalance.toFixed(2);
  }

  return (
    <tr className="investing-order-form">
      <td className="form-group">
        <input
          type="text"
          className="form-control"
          value={fields.ticker}
          name="ticker"
          onChange={handleOnChange}
          data-lpignore="true"
        />
      </td>
      <td className="form-group">
        <input
          type="date"
          className="form-control"
          value={fields.openDate}
          name="openDate"
          onChange={handleOnChange}
        />
      </td>
      <td className="form-group">
        <input
          type="date"
          className="form-control"
          value={fields.closeDate}
          name="closeDate"
          onChange={handleOnChange}
        />
      </td>
      <td className="form-group">
        <input
          type="text"
          className="form-control"
          value={fields.strikePrice}
          name="strikePrice"
          onChange={handleOnChange}
        />
      </td>
      <td className="form-group">
        <select
          type="text"
          className="form-control"
          value={fields.orderSide}
          name="orderSide"
          onChange={handleOnChange}
        >
          <option value="LONG">LONG</option>
          <option value={"SHORT"}>SHORT</option>
        </select>
      </td>
      <td className="form-group">
        <input
          type="number"
          className="form-control"
          value={fields.orderSize}
          name="orderSize"
          onChange={handleOnChange}
          min={1}
        />
      </td>
      <td className="form-group">
        <select
          type="text"
          className="form-control"
          value={fields.contractType}
          name="contractType"
          onChange={handleOnChange}
        >
          <option value="CALL">CALL</option>
          <option value={"PUT"}>PUT</option>
        </select>
      </td>
      <td className="form-group">
        <input
          type="number"
          className="form-control"
          value={fields.openPrice}
          name="openPrice"
          onChange={handleOnChange}
          min={0.01}
        />
      </td>
      <td className="form-group">
        <input
          type="number"
          className="form-control"
          value={fields.closePrice}
          name="closePrice"
          onChange={handleOnChange}
          min={0.01}
        />
      </td>
      <td className="form-group" colSpan={2}>
        <button className="btn btn-primary" onClick={handleSubmit}>
          Save
        </button>
      </td>
    </tr>
  );
}

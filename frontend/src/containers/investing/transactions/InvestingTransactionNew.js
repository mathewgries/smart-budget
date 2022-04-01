import React, { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { saveNewInvestingTransaction } from "../../../redux/investing/investingTransactionsSlice";
import {
  selectInvestingAccountById,
  updateInvestingAccountBalance,
} from "../../../redux/investing/investingAccountsSlice";
import { onError } from "../../../lib/errorLib";
import { inputDateFormat } from "../../../helpers/dateFormat";
import { addTransactionHandler } from "../../../helpers/currencyHandler";
import LoadingSpinner from "../../../components/LoadingSpinner";

export default function InvestingTransactionNew(props) {
  const { id } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const account = useSelector((state) => selectInvestingAccountById(state, id));
  const [isSaving, setIsSaving] = useState(false)
  const [fields, setFields] = useState({
    transactionAmount: 0.01,
    transactionDate: inputDateFormat(new Date()),
    transactionType: "Withdrawal",
    transactionNote: "",
  });

  const typeList = ["Withdrawal", "Deposit"];

  function handleChange(e) {
    const { name, value } = e.target;
    setFields({ ...fields, [name]: value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
			setIsSaving(true)
      const newAccountBalance = getNewAccountBalance();
      await handleSaveNewTransaction(newAccountBalance);
      dispatch(
        updateInvestingAccountBalance({
          id: account.id,
          accountBalance: newAccountBalance,
        })
      );
      history.push(`/investing/accounts/${id}`);
    } catch (e) {
      onError(e);
    }
  };

  const getNewAccountBalance = () => {
    return addTransactionHandler(
      account.accountBalance,
      fields.transactionAmount,
      fields.transactionType.charAt(0)
    );
  };

  const handleSaveNewTransaction = async (newAccountBalance) => {
    await dispatch(
      saveNewInvestingTransaction({
        accountId: account.id,
        accountBalance: newAccountBalance,
        transactionAmount: fields.transactionAmount,
        transactionDate: fields.transactionDate,
        transactionType: fields.transactionType.charAt(0),
        transactionNote: fields.transactionNote,
      })
    ).unwrap();
  };

  return (
    <div className="page-container">
      <div className="page-wrapper">
        <div className="form-wrapper">
          <form onSubmit={handleSubmit}>
            <div>
              <div className="form-group">
                <label>Amount</label>
                <input
                  className="form-control"
                  type="number"
                  min=".01"
                  step="any"
                  name="transactionAmount"
                  value={fields.transactionAmount}
                  onChange={handleChange}
                  placeholder="0.00"
                />
              </div>

              <div className="form-group">
                <label>Transaction Type</label>
                <select
                  className="form-control"
                  name="transactionType"
                  value={fields.transactionType}
                  onChange={handleChange}
                >
                  {typeList.map((element, index, arr) => (
                    <option key={index} value={element}>
                      {element}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Transaction Date</label>
              <input
                className="form-control"
                type="date"
                name="transactionDate"
                value={fields.transactionDate}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Transaction Note</label>
              <input
                className="form-control"
                type="text"
                name="transactionNote"
                value={fields.transactionNote}
                onChange={handleChange}
                placeholder="Enter transaction detail..."
              />
            </div>

            <div className="form-group">
              <button type="submit" className="btn btn-primary form-control">
                {isSaving ? <LoadingSpinner /> : "Save Transaction"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
// redux imports
import { useDispatch } from "react-redux";
import {
  saveNewInvestingTransaction,
  updateInvestingTransaction,
} from "../../../redux/investing/investingTransactionsSlice";
import { updateInvestingAccountBalance } from "../../../redux/investing/investingAccountsSlice";
// Helper imports
import { onError } from "../../../lib/errorLib";
import { inputDateFormat } from "../../../helpers/dateFormat";
import {
  addTransactionHandler,
  updateTransactionHelper,
} from "../../../helpers/currencyHandler";
// Component imports
import LoadingSpinner from "../../../components/LoadingSpinner";
import "../style.css";

export default function SpendingTransactionForm(props) {
  const dispatch = useDispatch();
  const {
    editForm,
    investingAccount,
    investingTransaction,
    toggleIsNewTransaction,
  } = props;
  const [isSaving, setIsSaving] = useState(false);
  const [fields, setFields] = useState({
    transactionAmount: 0.01,
    transactionDate: inputDateFormat(new Date()),
    transactionType: "Withdrawal",
    transactionNote: "",
  });

  const typeList = ["Withdrawal", "Deposit"];

  useEffect(() => {
    if (editForm) {
      setFields({
        ...fields,
        transactionAmount: investingTransaction.transactionAmount,
        transactionDate: inputDateFormat(investingTransaction.transactionDate),
        transactionType:
				investingTransaction.transactionType === "W"
            ? typeList[0]
            : typeList[1],
        transactionNote: investingTransaction.transactionNote,
      });
    }
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setFields({ ...fields, [name]: value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsSaving(true);
      const newAccountBalance = getNewAccountBalance();

      if (editForm) {
        handleUpdateTransaction(newAccountBalance);
      } else {
        handleSaveNewTransaction(newAccountBalance);
        toggleIsNewTransaction();
      }

      dispatch(
        updateInvestingAccountBalance({
          accountId: investingAccount.id,
          accountBalance: newAccountBalance,
        })
      );
    } catch (e) {
      onError(e);
    } finally {
      setIsSaving(false);
    }
  };

  const getNewAccountBalance = () => {
    if (editForm) {
      return updateTransactionHelper(
        investingTransaction,
        {...fields},
        investingAccount.accountBalance
      );
    } else {
      return addTransactionHandler(
        investingAccount.accountBalance,
        fields.transactionAmount,
        fields.transactionType.charAt(0)
      );
    }
  };

  const handleSaveNewTransaction = async (newAccountBalance) => {
    await dispatch(
      saveNewInvestingTransaction({
        accountId: investingAccount.id,
        accountBalance: newAccountBalance,
        transactionAmount: fields.transactionAmount,
        transactionDate: fields.transactionDate,
        transactionType: fields.transactionType.charAt(0),
        transactionNote: fields.transactionNote,
      })
    ).unwrap();
  };

  const handleUpdateTransaction = async (newAccountBalance) => {
    await dispatch(
      updateInvestingTransaction({
        id: investingTransaction.id,
        accountId: investingAccount.id,
        ...fields,
        transactionType: fields.transactionType.charAt(0),
        accountBalance: newAccountBalance,
      })
    ).unwrap();
  };

  return (
    <div className="transaction-form-container">
      <form onSubmit={handleSubmit}>
        <div className="transaction-form-input-group">
          <div className="transaction-form-top-row">
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
        </div>
        <div className="form-group">
          <button type="submit" className="btn btn-primary form-control">
            {editForm ? (
              isSaving ? (
                <LoadingSpinner />
              ) : (
                "Save Changes"
              )
            ) : isSaving ? (
              <LoadingSpinner />
            ) : (
              "Save Transaction"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

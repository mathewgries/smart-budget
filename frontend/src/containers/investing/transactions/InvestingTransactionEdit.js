import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  selectInvestingTransactionById,
  updateInvestingTransaction,
} from "../../../redux/investing/investingTransactionsSlice";
import { selectInvestingAccountByGSI } from "../../../redux/investing/investingAccountsSlice";
import { Link } from "react-router-dom";
import { onError } from "../../../lib/errorLib";
import { inputDateFormat } from "../../../helpers/dateFormat";
import { updateTransactionHelper } from "../../../helpers/currencyHandler";
import CurrencyInput from "../../inputFields/CurrencyInput";
import "./investingTransactions.css";

export default function InvestingTransactionEdit(props) {
  const { id } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const typeList = ["Withdrawal", "Deposit"];
  const transaction = useSelector((state) =>
    selectInvestingTransactionById(state, id)
  );
  const account = useSelector((state) =>
    selectInvestingAccountByGSI(state, transaction.GSI1_PK)
  );
  const [isSaving, setIsSaving] = useState(false);
  const [fields, setFields] = useState({
    transactionAmount: transaction.transactionAmount,
    transactionDate: inputDateFormat(transaction.transactionDate),
    transactionType:
      transaction.transactionType === "W" ? typeList[0] : typeList[1],
    transactionNote: transaction.transactionNote,
  });

  useEffect(() => {
    if (isSaving) {
      history.push(`/investing/transactions/${id}`);
    }
  }, [isSaving, history, id]);

  function validateForm() {
    return fields.transactionAmount > 0.0;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFields({ ...fields, [name]: value });
  }

  const handleCurrencyInput = ({ name, value }) => {
    setFields({ ...fields, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsSaving(true);
      const newAccountBalance = getNewAccountBalance();
      await handleUpdateTransaction(newAccountBalance);
    } catch (e) {
      onError(e);
    }
  };

  const getNewAccountBalance = () => {
    return updateTransactionHelper(
      transaction,
      { ...fields },
      account.accountBalance
    );
  };

  const handleUpdateTransaction = async (newAccountBalance) => {
    await dispatch(
      updateInvestingTransaction({
        transaction: {
          ...transaction,
          ...fields,
          transactionDate: Date.parse(fields.transactionDate),
          transactionType: fields.transactionType.charAt(0),
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
            <section className="page-header-wrapper">
              <header className="page-header">
                <Link to={`/investing/transactions/${id}`}>
                  <h4>Edit Investing Transaction</h4>
                </Link>
              </header>
              <div className="investing-transaction-form-button-wrapper">
                <div>
                  <button
                    type="submit"
                    className="btn btn-add-new"
                    disabled={!validateForm()}
                  >
                    Save
                  </button>
                </div>
                <div>
                  <Link
                    to={`/investing/transactions/${id}`}
                    className="btn btn-delete"
                  >
                    Cancel
                  </Link>
                </div>
              </div>
            </section>

            <section className="form-section">
              <div>
                <CurrencyInput
                  inputName={"transactionAmount"}
                  inputLabel={"Transaction Amount"}
                  inputValue={fields.transactionAmount}
                  inputChangeHandler={handleCurrencyInput}
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

              <div className="form-group">
                <label>Transaction Date</label>
                <input
                  className="form-control"
                  type="date"
                  name="transactionDate"
                  value={fields.transactionDate}
                  onChange={handleChange}
                  data-lpignore="true"
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
                  data-lpignore="true"
                />
              </div>
            </section>
          </form>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { saveNewInvestingTransaction } from "../../../redux/investing/investingTransactionsSlice";
import { selectInvestingAccountById } from "../../../redux/investing/investingAccountsSlice";
import { onError } from "../../../lib/errorLib";
import { inputDateFormat } from "../../../helpers/dateFormat";
import { addTransactionHandler } from "../../../helpers/currencyHandler";
import CurrencyInput from "../../inputFields/CurrencyInput";
import LoadingSpinner from "../../../components/LoadingSpinner";

export default function InvestingTransactionNew(props) {
  const { id } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const typeList = ["Withdrawal", "Deposit"];
  const account = useSelector((state) => selectInvestingAccountById(state, id));
  const status = useSelector((state) => state.investingTransactions.status);
  const [fields, setFields] = useState({
    transactionAmount: "0.00",
    transactionDate: inputDateFormat(new Date()),
    transactionType: "Withdrawal",
    transactionNote: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setFields({ ...fields, [name]: value });
  }

  const handleCurrencyInput = ({ name, value }) => {
    setFields({ ...fields, [name]: value });
  };

  function validateForm() {
    return fields.transactionAmount !== "0.00";
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const newAccountBalance = getNewAccountBalance();
      await handleSaveNewTransaction(newAccountBalance);
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
        transaction: {
          transactionAmount: fields.transactionAmount,
          transactionDate: Date.parse(fields.transactionDate),
          transactionType: fields.transactionType.charAt(0),
          transactionNote: fields.transactionNote,
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
                <h5>Add Investing Transaction</h5>
              </header>
              <div className="form-group">
                <button
                  type="submit"
                  className="btn btn-primary form-control"
                  disabled={!validateForm() || status === "pending"}
                >
                  {status === "pending" ? (
                    <LoadingSpinner text={"Saving"} />
                  ) : (
                    "Save"
                  )}
                </button>
              </div>
            </section>

            <section className="order-form-section">
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

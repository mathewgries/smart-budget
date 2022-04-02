import React, { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { saveNewSpendingTransaction } from "../../../redux/spending/spendingTransactionsSlice";
import {
  selectActiveCategory,
  selectActiveSubCategory,
} from "../../../redux/spending/categoriesSlice";
import {
  updateSpendingAccountBalance,
  selectSpendingAccountById,
} from "../../../redux/spending/spendingAccountsSlice";
import { onError } from "../../../lib/errorLib";
import { inputDateFormat } from "../../../helpers/dateFormat";
import { addTransactionHandler } from "../../../helpers/currencyHandler";
import Categories from "../categories/Categories";
import CurrencyInput from "../../inputFields/CurrencyInput";
import LoadingSpinner from "../../../components/LoadingSpinner";

export default function SpendingTransactionNew(props) {
  const { id } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const typeList = ["Withdrawal", "Deposit"];
  const account = useSelector((state) => selectSpendingAccountById(state, id));
  const activeCategory = useSelector(selectActiveCategory);
  const activeSubCategory = useSelector(selectActiveSubCategory);
  const [isSaving, setIsSaving] = useState(false);
  const [fields, setFields] = useState({
    transactionAmount: "0.01",
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
    return fields.transactionAmount > 0.0;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsSaving(true);
      const newAccountBalance = getNewAccountBalance();
      await handleSaveNewTransaction(newAccountBalance);
      dispatch(
        updateSpendingAccountBalance({
          id: account.id,
          accountBalance: newAccountBalance,
        })
      );
      history.push(`/spending/accounts/${id}`);
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
      saveNewSpendingTransaction({
        accountId: account.id,
        accountBalance: newAccountBalance,
        transactionAmount: fields.transactionAmount,
        transactionDate: fields.transactionDate,
        transactionType: fields.transactionType.charAt(0),
        category: activeCategory,
        subCategory: activeSubCategory,
        transactionNote: fields.transactionNote,
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
                <h5>Add Spending Transaction</h5>
              </header>
              <div className="form-group">
                <button
                  type="submit"
                  className="btn btn-primary form-control"
                  disabled={!validateForm() || isSaving}
                >
                  {isSaving ? <LoadingSpinner /> : "Save"}
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
              <div>
                <Categories />
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
            </section>
          </form>
        </div>
      </div>
    </div>
  );
}

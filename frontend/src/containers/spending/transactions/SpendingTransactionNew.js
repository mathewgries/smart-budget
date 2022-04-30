import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { saveNewSpendingTransaction } from "../../../redux/spending/spendingTransactionsSlice";
import {
  selectActiveCategory,
  selectActiveSubcategory,
} from "../../../redux/spending/categoriesSlice";
import { selectSpendingAccountById } from "../../../redux/spending/spendingAccountsSlice";
import { Link } from "react-router-dom";
import { onError } from "../../../lib/errorLib";
import { inputDateFormat } from "../../../helpers/dateFormat";
import { addTransactionHandler } from "../../../helpers/currencyHandler";
import CategoriesSelector from "../categories/CategoriesSelector";
import CategoriesForm from "../categories/CategoriesForm";
import CurrencyInput from "../../inputFields/CurrencyInput";
import LoadingSpinner from "../../../components/LoadingSpinner";
import "./spendingTransactions.css";

export default function SpendingTransactionNew(props) {
  const { id } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const typeList = ["Withdrawal", "Deposit"];
  const account = useSelector((state) => selectSpendingAccountById(state, id));
  const activeCategory = useSelector((state) => selectActiveCategory(state));
  const activeSubcategory = useSelector((state) =>
    selectActiveSubcategory(state)
  );
  const categoryStatus = useSelector((state) => state.categories.status);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [fields, setFields] = useState({
    transactionAmount: "0.00",
    transactionDate: inputDateFormat(new Date()),
    transactionType: "Withdrawal",
    transactionNote: "",
  });

  useEffect(() => {
    function validateStatus() {
      return categoryStatus === "pending";
    }

    if (validateStatus() && !isLoading) {
      setIsLoading(true);
    } else if (!validateStatus() && isLoading) {
      setIsLoading(false);
    }
  }, [categoryStatus, isLoading]);

  useEffect(() => {
    if (isSaving) {
      history.push(`/spending/accounts/${id}`);
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
      await handleSaveNewTransaction(newAccountBalance);
    } catch (e) {
      onError(e);
    }
  };

  const getNewAccountBalance = () => {
		const result = addTransactionHandler(
      account.accountBalance,
      fields.transactionAmount,
      fields.transactionType.charAt(0)
    );
		return result
  };

  const handleSaveNewTransaction = async (newAccountBalance) => {
    await dispatch(
      saveNewSpendingTransaction({
        transaction: {
          transactionAmount: fields.transactionAmount,
          transactionDate: Date.parse(fields.transactionDate),
          transactionType: fields.transactionType.charAt(0),
          categoryId: activeCategory.id,
          subcategoryId: activeSubcategory.id,
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
            <section className="page-header-wrapper">
              <header className="page-header">
                <Link to={`/spending/accounts/${id}`}>
                  <h4>Add Spending Transaction</h4>
                </Link>
              </header>
              <div className="spending-transaction-form-button-wrapper">
                <div>
                  <button
                    type="submit"
                    className="btn btn-add-new"
                    disabled={!validateForm() || isLoading || isSaving}
                  >
                    {isLoading || isSaving ? (
                      <LoadingSpinner text={"Saving"} />
                    ) : (
                      "Save"
                    )}
                  </button>
                </div>
                <div>
                  <Link
                    to={`/spending/accounts/${id}`}
                    className="btn btn-delete"
                    style={isLoading ? { pointerEvents: "none" } : null}
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
                  isDisabled={isLoading || isSaving}
                />
              </div>

              <div className="form-group">
                <label>Transaction Type</label>
                <select
                  className="form-control"
                  name="transactionType"
                  value={fields.transactionType}
                  onChange={handleChange}
                  disabled={isLoading || isSaving}
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
                  disabled={isLoading || isSaving}
                  data-lpignore="true"
                />
              </div>

              <div>
                <div>
                  <CategoriesSelector />
                </div>
                <div>
                  <CategoriesForm />
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
                  disabled={isLoading || isSaving}
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

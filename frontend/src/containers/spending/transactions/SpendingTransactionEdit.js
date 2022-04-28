import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  selectSpendingTransactionById,
  updateSpendingTransaction,
} from "../../../redux/spending/spendingTransactionsSlice";
import {
  activeCategoryUpdated,
  activeSubcategoryUpdated,
  selectActiveCategory,
  selectActiveSubcategory,
} from "../../../redux/spending/categoriesSlice";
import { selectSpendingAccountByGSI } from "../../../redux/spending/spendingAccountsSlice";
import { Link } from "react-router-dom";
import { onError } from "../../../lib/errorLib";
import { inputDateFormat } from "../../../helpers/dateFormat";
import { updateTransactionHelper } from "../../../helpers/currencyHandler";
import CategoriesSelector from "../categories/CategoriesSelector";
import CategoriesForm from "../categories/CategoriesForm";
import CurrencyInput from "../../inputFields/CurrencyInput";
import LoadingSpinner from "../../../components/LoadingSpinner";
import "./spendingTransactions.css";

export default function SpendingTransactionEdit(props) {
  const { id } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const typeList = ["Withdrawal", "Deposit"];
  const transaction = useSelector((state) =>
    selectSpendingTransactionById(state, id)
  );
  const account = useSelector((state) =>
    selectSpendingAccountByGSI(state, transaction.GSI1_PK)
  );
  const activeCategory = useSelector((state) => selectActiveCategory(state));
  const activeSubcategory = useSelector((state) =>
    selectActiveSubcategory(state)
  );
  const categoryStatus = useSelector((state) => state.categories.status);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [fields, setFields] = useState({
    transactionAmount: transaction.transactionAmount,
    transactionDate: inputDateFormat(transaction.transactionDate),
    transactionType:
      transaction.transactionType === "W" ? typeList[0] : typeList[1],
    transactionNote: transaction.transactionNote,
  });

  useEffect(() => {
    if (transaction.categoryId) {
      dispatch(activeCategoryUpdated(transaction.categoryId));
      dispatch(activeSubcategoryUpdated(transaction.subcategoryId));
    }
  }, [transaction.categoryId, transaction.subcategoryId, dispatch]);

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
      history.push(`/spending/transactions/${id}`);
    }
  }, [isSaving, history, id]);

  function validateForm() {
    return fields.transactionAmount !== "0.00";
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
      updateSpendingTransaction({
        transaction: {
          ...transaction,
          ...fields,
          transactionDate: Date.parse(fields.transactionDate),
          transactionType: fields.transactionType.charAt(0),
          categoryId: activeCategory.id || null,
          subcategoryId: activeSubcategory.id || null,
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
                <Link to={`/spending/transactions/${id}`}>
                  <h4>Edit Spending Transaction</h4>
                </Link>
              </header>
              <div className="spending-transaction-form-button-wrapper">
                <div className="form-group">
                  <button
                    type="submit"
                    className="btn btn-add-new form-control"
                    disabled={!validateForm() || isLoading}
                  >
                    {isLoading ? <LoadingSpinner text={"Loading"} /> : "Save"}
                  </button>
                </div>
                <div>
                  <Link
                    to={`/spending/transactions/${id}`}
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
                  isDisabled={isLoading}
                />
              </div>

              <div className="form-group">
                <label>Transaction Type</label>
                <select
                  className="form-control"
                  name="transactionType"
                  value={fields.transactionType}
                  onChange={handleChange}
                  disabled={isLoading}
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
                  disabled={isLoading}
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
                  disabled={isLoading}
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

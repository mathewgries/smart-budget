import React, {useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { saveNewSpendingTransaction } from "../../../redux/spending/spendingTransactionsSlice";
import {
  selectAllCategories,
  activeCategoryUpdated,
  activeSubcategoryUpdated,
  selectActiveCategory,
  selectActiveSubcategory,
} from "../../../redux/spending/categoriesSlice";
import { selectSpendingAccountById } from "../../../redux/spending/spendingAccountsSlice";
import { onError } from "../../../lib/errorLib";
import { inputDateFormat } from "../../../helpers/dateFormat";
import { addTransactionHandler } from "../../../helpers/currencyHandler";
import CategoriesSelector from "../categories/CategoriesSelector";
import CategoriesForm from "../categories/CategoriesForm";
import CurrencyInput from "../../inputFields/CurrencyInput";
import LoadingSpinner from "../../../components/LoadingSpinner";

export default function SpendingTransactionNew(props) {
  const { id } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const typeList = ["Withdrawal", "Deposit"];
  const account = useSelector((state) => selectSpendingAccountById(state, id));
  const categories = useSelector(selectAllCategories);
  const activeCategory = useSelector((state) => selectActiveCategory(state));
  const activeSubcategory = useSelector((state) =>
    selectActiveSubcategory(state)
  );
  const [subcategories, setSubcategories] = useState([]);
  const transactionStatus = useSelector((state) => state.spendingTransactions.status);
	const categoryStatus = useSelector((state) => state.categories.status);
	const [status, setStatus] = useState("")
  const [fields, setFields] = useState({
    transactionAmount: "0.00",
    transactionDate: inputDateFormat(new Date()),
    transactionType: "Withdrawal",
    transactionNote: "",
  });

	useEffect(() => {
		let status
		if(transactionStatus === "pending" || categoryStatus === "pending"){
			status = "pending"
		}else {
			status = ""
		}
		setStatus(status)
	}, [transactionStatus, categoryStatus])

  function handleChange(e) {
    const { name, value } = e.target;
    setFields({ ...fields, [name]: value });
  }

  const handleCurrencyInput = ({ name, value }) => {
    setFields({ ...fields, [name]: value });
  };

  function handleCategoryToggle(category) {
    dispatch(activeCategoryUpdated(category));
		setSubcategories(category.subcategories);
  }

  function handleSubcategoryToggle(subcategory) {
    dispatch(activeSubcategoryUpdated(subcategory));
  }

  function validateForm() {
    return fields.transactionAmount > 0.0;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const newAccountBalance = getNewAccountBalance();
      await handleSaveNewTransaction(newAccountBalance);
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
        transaction: {
          transactionAmount: fields.transactionAmount,
          transactionDate: Date.parse(fields.transactionDate),
          transactionType: fields.transactionType.charAt(0),
          categoryName: activeCategory.categoryName,
          subcategory: activeSubcategory,
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
                <h5>Add Spending Transaction</h5>
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

              <div>
                <div>
                  <CategoriesSelector
                    categories={categories}
                    subcategories={subcategories}
                    activeCategory={activeCategory}
                    activeSubcategory={activeSubcategory}
                    toggleCategory={handleCategoryToggle}
                    toggleSubcategory={handleSubcategoryToggle}
                  />
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

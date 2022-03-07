import React, { useState, useEffect } from "react";
import {
  addTransactionHandler,
  updateTransactionHelper,
} from "../../helpers/currencyHandler";
import { useDispatch, useSelector } from "react-redux";
import { onError } from "../../lib/errorLib";
import { inputDateFormat } from "../../helpers/dateFormat";
import {
  saveNewTransaction,
  updateTransaction,
} from "../../redux/transactionsSlice";
import {
  selectActiveCategory,
  selectActiveSubCategory,
  updateActiveCategory,
  updateActiveSubCategory,
} from "../../redux/categoriesSlice";
import Categories from "../categories/Categories";
import LoadingSpinner from "../../components/LoadingSpinner";
import { updateAccountBalance } from "../../redux/accountsSlice";

export default function TransactionForm(props) {
  const dispatch = useDispatch();
  const { editForm, account, transaction, toggleIsNewTransaction } = props;
  const activeCategory = useSelector(selectActiveCategory);
  const activeSubCategory = useSelector(selectActiveSubCategory);
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
        transactionAmount: transaction.transactionAmount,
        transactionDate: inputDateFormat(transaction.transactionDate),
        transactionType:
          transaction.transactionType === "W" ? typeList[0] : typeList[1],
        transactionNote: transaction.transactionNote,
      });
      dispatch(updateActiveCategory(transaction.category));
      dispatch(updateActiveSubCategory(transaction.subCategory));
    }
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setFields({ ...fields, [name]: value });
  }

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      setIsSaving(true);
      const newAccountBalance = editForm
        ? updateTransactionHelper(
            transaction,
            {
              ...fields,
              category: activeCategory,
              subCategory: activeSubCategory,
            },
            account.accountBalance
          )
        : addTransactionHandler(
            account.accountBalance,
            fields.transactionAmount,
            fields.transactionType.charAt(0)
          );

      if (editForm) {
        await dispatch(
          updateTransaction({
            id: transaction.id,
            accountId: account.id,
            ...fields,
            transactionType: fields.transactionType.charAt(0),
            category: activeCategory,
            subCategory: activeSubCategory,
            accountBalance: newAccountBalance,
          })
        ).unwrap();
      } else {
        await dispatch(
          saveNewTransaction({
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
        toggleIsNewTransaction();
      }

      dispatch(
        updateAccountBalance({
          accountId: account.id,
          accountBalance: newAccountBalance,
        })
      );
    } catch (e) {
      onError(e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateTransaction = async () => {};

  return (
    <div className="transaction-form-container">
      <form onSubmit={handleSave}>
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
            {/* {isSaving ? <LoadingSpinner /> : "Save Changes"} */}
          </button>
        </div>
      </form>
    </div>
  );
}

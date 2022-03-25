import React, { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
// redux imports
import { useDispatch, useSelector } from "react-redux";
import {
  selectSpendingTransactionById,
  updateSpendingTransaction,
} from "../../../redux/spending/spendingTransactionsSlice";
import {
  selectActiveCategory,
  selectActiveSubCategory,
  updateActiveCategory,
  updateActiveSubCategory,
} from "../../../redux/spending/categoriesSlice";
import {
  selectSpendingAccountById,
  updateSpendingAccountBalance,
} from "../../../redux/spending/spendingAccountsSlice";
// Helper imports
import { onError } from "../../../lib/errorLib";
import { inputDateFormat } from "../../../helpers/dateFormat";
import { updateTransactionHelper } from "../../../helpers/currencyHandler";
// Component imports
import Categories from "../categories/Categories";
import LoadingSpinner from "../../../components/LoadingSpinner";

export default function SpendingTransactionEdit(props) {
  const { id } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
	const typeList = ["Withdrawal", "Deposit"];
  const transaction = useSelector((state) =>
    selectSpendingTransactionById(state, id)
  );
  const account = useSelector((state) =>
    selectSpendingAccountById(
      state,
      transaction.GSI1_PK.replace("ACCT#SPENDING#", "")
    )
  );
  const activeCategory = useSelector(selectActiveCategory);
  const activeSubCategory = useSelector(selectActiveSubCategory);
  const [isSaving, setIsSaving] = useState(false);
  const [fields, setFields] = useState({
    transactionAmount: transaction.transactionAmount,
    transactionDate: inputDateFormat(transaction.transactionDate),
    transactionType:
      transaction.transactionType === "W" ? typeList[0] : typeList[1],
    transactionNote: transaction.transactionNote,
  });

  dispatch(updateActiveCategory(transaction.category));
  dispatch(updateActiveSubCategory(transaction.subCategory));

  

  function handleChange(e) {
    const { name, value } = e.target;
    setFields({ ...fields, [name]: value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsSaving(true);
      const newAccountBalance = getNewAccountBalance();

      await handleUpdateTransaction(newAccountBalance);

      dispatch(
        updateSpendingAccountBalance({
          accountId: account.id,
          accountBalance: newAccountBalance,
        })
      );
      history.push(`/spending/transactions/${id}`);
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
        id: transaction.id,
        accountId: account.id,
        ...fields,
        transactionType: fields.transactionType.charAt(0),
        category: activeCategory,
        subCategory: activeSubCategory,
        accountBalance: newAccountBalance,
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

            <div className="form-group">
              <button type="submit" className="btn btn-primary form-control">
                {isSaving ? <LoadingSpinner /> : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { API } from "aws-amplify";
import { onError } from "../../lib/errorLib";
import { inputDateFormat } from "../../helpers/dateFormat";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function NewTransaction(props) {
  const [categories, setCategories] = useState(null);
  const [categoryNames, setCategoryNames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [fields, setFields] = useState({
    transactionAmount: 0.0,
    transactionDate: "",
    transactionType: "",
    category: "",
    subCategory: "",
    transactionNote: "",
  });

  const typeList = ["Withdrawal", "Deposit"];

  useEffect(() => {
    function loadCategories() {
      return API.get("smartbudget", `/categories`);
    }

    async function onLoad() {
      try {
        const categories = await loadCategories();
        const keys = Object.keys(categories.categoryMap);
        setCategoryNames(keys);
        setCategories(categories.categoryMap);
        setFields({
          transactionAmount: 0.01,
          transactionDate: inputDateFormat(new Date()),
          transactionType: "Withdrawal",
          category: keys[0],
          subCategory: categories.categoryMap[keys[0]][0],
					transactionNote: ""
        });
      } catch (e) {
        onError(e);
      }

      setIsLoading(false);
    }

    onLoad();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    if (categoryNames.includes(value)) {
      setFields({
        ...fields,
        [name]: value,
        subCategory: categories[value][0],
      });
    } else {
      setFields({ ...fields, [name]: value });
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSaving(true);
    try {
      await saveTransaction();
			props.toggleIsNewTransaction()
    } catch (e) {
      onError(e);
    } finally {
      setIsSaving(false);
    }
  }

  function saveTransaction() {
    return API.post("smartbudget", "/transactions", {
      body: {
        accountId: props.accountInfo.id,
        accountBalance: props.accountInfo.accountBalance,
        transactionAmount: fields.transactionAmount,
        transactionDate: Date.parse(fields.transactionDate),
        transactionType: fields.transactionType.charAt(0).toUpperCase(),
        category: fields.category,
        subCategory: fields.subCategory,
        transactionNote: fields.transactionNote,
      },
    });
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Category</label>
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <select
              className="form-control"
              name="category"
              value={fields.category}
              onChange={handleChange}
            >
              {categoryNames.map((element, index, arr) => (
                <option key={index} value={element}>
                  {element}
                </option>
              ))}
            </select>
          )}
        </div>
        <div className="form-group">
          <label>Sub Category</label>
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <select
              className="form-control"
              name="subCategory"
              value={fields.subCategory}
              onChange={handleChange}
            >
              {categories[fields.category].map((element, index, arr) => (
                <option key={index} value={element}>
                  {element}
                </option>
              ))}
            </select>
          )}
        </div>
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
  );
}

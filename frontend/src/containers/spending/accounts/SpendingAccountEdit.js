import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  selectSpendingAccountById,
  updateSpendingAccount,
} from "../../../redux/spending/spendingAccountsSlice";
import { Link } from "react-router-dom";
import { onError } from "../../../lib/errorLib";
import CurrencyInput from "../../inputFields/CurrencyInput";
import "./spendingAccounts.css";

export default function SpendingAccountEdit(props) {
  const { id } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const account = useSelector((state) => selectSpendingAccountById(state, id));
  const [isSaving, setIsSaving] = useState(false);
  const [fields, setFields] = useState({
    accountName: account.accountName,
    accountBalance: account.accountBalance,
  });

  useEffect(() => {
    if (isSaving) {
      history.push(`/spending/accounts/${id}`);
    }
  }, [isSaving, history, id]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
  }

  const handleCurrencyInput = ({ name, value }) => {
    setFields({ ...fields, [name]: value });
  };

  function validateForm() {
    return fields.accountName.length > 0;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsSaving(true);
      const { accountName, accountBalance } = fields;
      await dispatch(
        updateSpendingAccount({ id, accountName, accountBalance })
      ).unwrap();
    } catch (e) {
      onError(e);
    }
  };

  return (
    <div className="page-container">
      <div className="page-wrapper">
        <div className="form-wrapper">
          <form onSubmit={handleSubmit}>
            <section className="page-header-wrapper">
              <header className="page-header">
                <Link to={`/spending/accounts/${id}`}>
                  <h4>Edit Spending Account</h4>
                </Link>
              </header>
              <div className="spending-account-form-button-wrapper">
                <div className="form-group">
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
                    to={`/spending/accounts/${id}`}
                    className="btn btn-delete"
                  >
                    Cancel
                  </Link>
                </div>
              </div>
            </section>

            <section className="form-section">
              <div className="form-group">
                <label>Account Name</label>
                <input
                  className="form-control"
                  type="text"
                  name="accountName"
                  value={fields.accountName}
                  onChange={handleChange}
                  data-lpignore="true"
                />
              </div>
              <div>
                <CurrencyInput
                  inputName={"accountBalance"}
                  inputLabel={"Account Balance"}
                  inputValue={fields.accountBalance}
                  inputChangeHandler={handleCurrencyInput}
                />
              </div>
            </section>
          </form>
        </div>
      </div>
    </div>
  );
}

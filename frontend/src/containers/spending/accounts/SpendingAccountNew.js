import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addNewSpendingAccount } from "../../../redux/spending/spendingAccountsSlice";
import { Link } from "react-router-dom";
import { onError } from "../../../lib/errorLib";
import CurrencyInput from "../../inputFields/CurrencyInput";
import "./spendingAccounts.css";

export default function SpendingAccountNew() {
  const history = useHistory();
  const dispatch = useDispatch();
  const [isSaving, setIsSaving] = useState(false);
  const [fields, setFields] = useState({
    accountName: "",
    accountBalance: "0.00",
  });

  useEffect(() => {
    if (isSaving) {
      history.push("/");
    }
  }, [isSaving, history]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setFields({ ...fields, [name]: value });
  };

  const handleCurrencyInput = ({ name, value }) => {
    setFields({ ...fields, [name]: value });
  };

  function validateForm() {
    return fields.accountName.length > 0;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setIsSaving(true);
      await dispatch(
        addNewSpendingAccount({ account: { ...fields } })
      ).unwrap();
    } catch (e) {
      onError(e);
    }
  };

  return (
    <div className="page-cointainer">
      <div className="page-wrapper">
        <div className="form-wrapper">
          <form onSubmit={handleSubmit}>
            <section className="page-header-wrapper">
              <header className="page-header">
                <Link to="/spending">
                  <h4>Add Spending Account</h4>
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
                  <Link to="/spending" className="btn btn-delete">
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
                  onChange={handleOnChange}
                  data-lpignore="true"
                />
              </div>
              <div>
                <CurrencyInput
                  inputName={"accountBalance"}
                  inputLabel={"Starting Balance"}
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

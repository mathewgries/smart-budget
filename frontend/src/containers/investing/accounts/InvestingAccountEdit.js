import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  selectInvestingAccountById,
  updateInvestingAccount,
} from "../../../redux/investing/investingAccountsSlice";
import { onError } from "../../../lib/errorLib";
import CurrencyInput from "../../inputFields/CurrencyInput";
import LoadingSpinner from "../../../components/LoadingSpinner";

export default function InvestingAccountsEdit(props) {
  const { id } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const account = useSelector((state) => selectInvestingAccountById(state, id));
  const [isSaving, setIsSaving] = useState(false);
  const [fields, setFields] = useState({
    accountName: "",
    accountBalance: "",
  });

  useEffect(() => {
    setFields((prev) => ({
      ...prev,
      accountName: account.accountName,
      accountBalance: account.accountBalance,
    }));
  }, [account]);

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
    const { accountName, accountBalance } = fields;

    try {
      setIsSaving(true);
      await dispatch(
        updateInvestingAccount({ id, accountName, accountBalance })
      ).unwrap();
      history.push(`/investing/accounts/${id}`);
    } catch (e) {
      onError(e);
    }
  };

  return (
    <div className="page-container">
      <div className="page-wrapper">
        <div className="form-wrapper">
          <form onSubmit={handleSubmit}>
            <section className="order-form-header">
              <header>
                <h5>Edit Investing Account</h5>
              </header>
              <div className="form-group">
                <button
                  type="submit"
                  className="btn btn-primary form-control"
                  disabled={!validateForm() || isSaving}
                >
                  {isSaving ? <LoadingSpinner /> : "Update"}
                </button>
              </div>
            </section>

            <section className="order-form-section">
              <div>
                <header>
                  <h4>Edit Investing Account</h4>
                </header>
              </div>
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

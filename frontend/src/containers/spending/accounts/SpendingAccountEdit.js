import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  selectSpendingAccountById,
  updateSpendingAccount,
} from "../../../redux/spending/spendingAccountsSlice";
import { onError } from "../../../lib/errorLib";
import LoadingSpinner from "../../../components/LoadingSpinner";

export default function SpendingAccountEdit(props) {
  const { id } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const account = useSelector((state) => selectSpendingAccountById(state, id));
  const [isSaving, setIsSaving] = useState(false);
  const [fields, setFields] = useState({ accountName: "", accountBalance: "" });

  useEffect(() => {
    setFields((prev) => ({
      ...prev,
      accountName: account.accountName,
      accountBalance: account.accountBalance,
    }));
  }, [account]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFields({ ...fields, [name]: value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { accountName, accountBalance } = fields;

    try {
      setIsSaving(true);
      await dispatch(
        updateSpendingAccount({ id, accountName, accountBalance })
      ).unwrap();
      history.push(`/spending/accounts/${id}`)
    } catch (e) {
      onError(e);
    }
  };

  return (
    <div className="page-cointainer">
      <div className="page-wrapper">
        <div className="form-wrapper">
          <form onSubmit={handleSubmit}>
            <div>
              <header>
                <h4>Edit Spending Account</h4>
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
              />
            </div>
            <div className="form-group">
              <label>Account Balance</label>
              <input
                className="form-control"
                type="text"
                name="accountBalance"
                value={fields.accountBalance}
                onChange={handleChange}
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

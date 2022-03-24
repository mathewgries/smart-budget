import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addNewSpendingAccount } from "../../../redux/spending/spendingAccountsSlice";
import { onError } from "../../../lib/errorLib";
import LoadingSpinner from "../../../components/LoadingSpinner";
import "../style.css";

export default function SpendingAccountNew() {
  const history = useHistory();
  const dispatch = useDispatch();
  const [addRequestStatus, setAddRequestStatus] = useState("idle");
  const [fields, setFields] = useState({
    accountName: "",
    accountBalance: "",
  });

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setFields({ ...fields, [name]: value });
  };

  function validateForm() {
    return fields.accountName.length > 0;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setAddRequestStatus("pending");
      await dispatch(addNewSpendingAccount(fields)).unwrap();
      history.push("/");
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
                <h4>New Spending Account</h4>
              </header>
            </div>
            <div className="form-group">
              <label>Account Name</label>
              <input
                className="form-control"
                type="text"
                name="accountName"
                value={fields.accountName}
                onChange={handleOnChange}
              />
            </div>
            <div className="form-group">
              <label>Starting Balance</label>
              <input
                className="form-control"
                type="text"
                name="accountBalance"
                value={fields.accountBalance}
                onChange={handleOnChange}
              />
            </div>
            <div className="form-group">
              <button
                type="submit"
                className="btn btn-primary form-control"
                disabled={!validateForm()}
              >
                {addRequestStatus === "pending" ? <LoadingSpinner /> : "Create"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

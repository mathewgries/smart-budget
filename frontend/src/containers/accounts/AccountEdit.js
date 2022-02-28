import React, { useState } from "react";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function AccountItem(props) {
  const [fields, setFields] = useState({
    accountName: props.account.accountName,
    accountBalance: props.account.accountBalance,
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setFields({ ...fields, [name]: value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    props.updateAccountInfo(fields);
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
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
            {!props.isSaving ? "Save Changes" : <LoadingSpinner />}
          </button>
        </div>
      </form>
    </div>
  );
}

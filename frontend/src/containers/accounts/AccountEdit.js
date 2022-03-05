import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { updateAccount } from "../../redux/accountsSlice";
import { onError } from "../../lib/errorLib";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function AccountItem(props) {
  const dispatch = useDispatch();
  const [isSaving, setIsSaving] = useState(false);
  const { id, accountName, accountBalance } = props.account;
  const [fields, setFields] = useState({ id, accountName, accountBalance });

  function handleChange(e) {
    const { name, value } = e.target;
    setFields({ ...fields, [name]: value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { id, accountName, accountBalance } = fields;

    try {
      setIsSaving(true);
      await dispatch(
        updateAccount({ id, accountName, accountBalance })
      ).unwrap();
      props.toggleAccountEdit();
    } catch (e) {
      onError(e);
    }
  };

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
            {isSaving ? <LoadingSpinner /> : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

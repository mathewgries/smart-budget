import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function SpendingTransactionButtons(props) {
  const { transactionId } = props;
  const [showConfrim, setShowConfirm] = useState(false);

  function handleCancel() {
    setShowConfirm(!showConfrim);
  }

  async function handleConfirm() {
    setShowConfirm(!showConfrim);
    props.onDelete();
  }

  return (
    <div className="transaction-card-btn-container">
      <div>
        <Link
          to={`/spending/transactions/edit/${transactionId}`}
          className="btn btn-primary"
        >
          Edit
        </Link>
      </div>
      <div>
        <button
          className="btn btn-danger"
          onClick={() => setShowConfirm(!showConfrim)}
        >
          Delete
        </button>
      </div>
      {showConfrim && (
        <section className="confirmation-popup-section">
          <ConfirmDelete cancel={handleCancel} confirm={handleConfirm} />
        </section>
      )}
    </div>
  );
}

const ConfirmDelete = (props) => {
  function handleCancel() {
    props.cancel();
  }

  function handleConfirm() {
    props.confirm();
  }

  return (
    <div className="confirmation-popup-wrapper">
      <div className="confirmation-popup">
        <div className="confirm-popup-info-wrapper">
          <p>You are about to delete a transaction!</p>
          <p>This effects account balance as well!</p>
          <p>Please confirm</p>
        </div>
        <div className="confirm-popup-btn-wrapper">
          <button className="btn btn-secondary" onClick={handleCancel}>
            Cancel
          </button>
          <button className="btn btn-danger" onClick={handleConfirm}>
            Confrim
          </button>
        </div>
      </div>
    </div>
  );
};

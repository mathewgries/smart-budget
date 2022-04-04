import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ConfirmationPopup from "../../popups/ConfirmationPopup";
import LoadingSpinner from "../../../components/LoadingSpinner";

const ConfirmMessage = () => {
  return (
    <div>
      <p>You are about to delete a transaction!</p>
      <p>This effects account balance as well!</p>
      <p>Please confirm</p>
    </div>
  );
};

export default function SpendingTransactionButtons(props) {
  const { transactionId } = props;
  const [showConfrim, setShowConfirm] = useState(false);
  const status = useSelector((state) => state.spendingTransactions.status);

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
          {status === "pending" ? (
            <LoadingSpinner text={"Deleting"} />
          ) : (
            "Delete"
          )}
        </button>
      </div>
      {showConfrim && (
        <section className="confirmation-popup-section">
          <ConfirmationPopup onCancel={handleCancel} onConfirm={handleConfirm}>
            <ConfirmMessage />
          </ConfirmationPopup>
        </section>
      )}
    </div>
  );
}

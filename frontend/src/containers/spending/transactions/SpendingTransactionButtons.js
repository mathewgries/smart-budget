import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ConfirmationPopup from "../../popups/ConfirmationPopup";
import LoadingSpinner from "../../../components/LoadingSpinner";

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
          <ConfirmationPopup cancel={handleCancel} onConfirm={handleConfirm} />
        </section>
      )}
    </div>
  );
}

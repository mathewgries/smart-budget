import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import ConfirmationPopup from "../../popups/ConfirmationPopup";
import LoadingSpinner from "../../../components/LoadingSpinner";
import "./spendingTransactions.css"

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
  const { transactionId, isLoading } = props;
  const history = useHistory();
  const [showConfrim, setShowConfirm] = useState(false);

  function handleRedirect() {
    history.push(`/spending/transactions/edit/${transactionId}`);
  }

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
        <button
          className="btn btn-add-new"
          onClick={handleRedirect}
          disabled={isLoading}
        >
          {isLoading ? <LoadingSpinner /> : "Edit"}
        </button>
      </div>

      <div>
        <button
          className="btn btn-delete"
          onClick={() => setShowConfirm(!showConfrim)}
          disabled={isLoading}
        >
          {isLoading ? <LoadingSpinner /> : "Delete"}
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

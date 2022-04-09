import React from "react";
import { useHistory } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function TransactionCardLoader(props) {
  const { status, text, path } = props;
  const history = useHistory();

  function handleRedirect() {
    history.push(path);
  }

  return (
    <div className="spending-transaction-card-container">
      <div className="transaction-list-item-wrapper">
        {status === "pending" ? (
          <LoadingSpinner />
        ) : (
          <div className="placeholder-card" onClick={handleRedirect}>
            {text}
          </div>
        )}
      </div>
    </div>
  );
}

import React from "react";
import { Link } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function AccountCardLoader(props) {
  const { status, text } = props;

  return (
    <div className="account-card-container">
      <div className="account-list-item-wrapper">
        {status === "pending" ? (
          <LoadingSpinner />
        ) : (
          <Link className="placeholder-card" to={`spending/accounts/new`}>
            {text}
          </Link>
        )}
      </div>
    </div>
  );
}

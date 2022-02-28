import React from "react";
import { Link } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function AccountList(props) {
  const { isLoading, accounts } = props;
  return (
    <div>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div>
          {accounts.map(({ accountName, id, createDate }, index, arr) => (
            <div key={id}>
              <Link to={`/accounts/${id}`}>
                <div>{accountName}</div>
                <div className="text-muted">
                  {new Date(createDate).toLocaleString()}
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import React from "react";
import { Link } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useSelector } from "react-redux";
import { selectAllAcounts } from "../../redux/accountsSlice";
import "./style.css";

export default function AccountList(props) {
  const accounts = useSelector(selectAllAcounts);
  const accountStatus = useSelector((state) => state.accounts.status);

  return (
    <div className="account-list-wrapper">
      {accountStatus === "loading" ? (
        <LoadingSpinner />
      ) : (
        <div className="account-list">
          {accounts.map((account, index, arr) => (
            <div key={account.id} className="account-list-item-wrapper">
              <Link
                to={`/accounts/${account.id}`}
                className="account-list-item"
              >
                <div className="account-list-item-detail">
                  <div>{account.accountName}</div>
                  <div>{`$${account.accountBalance}`}</div>
                </div>
                <div className="text-muted">
                  {new Date(account.createDate).toLocaleString()}
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

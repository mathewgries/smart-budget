import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAllSpendingAcounts } from "../../../redux/spending/spendingAccountsSlice";
import { BsPencilSquare } from "react-icons/bs";
import LoadingSpinner from "../../../components/LoadingSpinner";
import "../style.css";

const NoAccountsAction = (props) => {
  return <div>Add your first spending account...</div>;
};

const AccountList = (props) => {
  const { spendingAccounts } = props;

  return (
    <div className="account-list-wrapper">
      {spendingAccounts.length === 0 ? (
        <NoAccountsAction />
      ) : (
        <div className="account-list">
          {spendingAccounts.map((account, index, arr) => (
            <div key={account.id} className="account-list-item-wrapper">
              <Link
                to={`spending/accounts/${account.id}`}
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
};

export default function SpendingAccountsList(props) {
  const spendingAccounts = useSelector(selectAllSpendingAcounts);
  const status = useSelector((state) => state.spendingAccounts.status);

  return (
    <div className="account-list-container">
      <div className="account-list-header">
        <div>
          <h3>Spending Accounts</h3>
        </div>
        <div>
          <Link to="/spending/accounts/new" className="btn btn-primary">
            <BsPencilSquare size={17} />
            <span className="ml-2 font-weight-bold">Add</span>
          </Link>
        </div>
      </div>
      <div>
        {status === "loading" ? (
          <LoadingSpinner />
        ) : (
          <div>
            <AccountList spendingAccounts={spendingAccounts} />
          </div>
        )}
      </div>
    </div>
  );
}

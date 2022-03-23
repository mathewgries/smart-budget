import React from "react";
import { useSelector } from "react-redux";
import { selectAllInvestingAccounts } from "../../../redux/investing/investingAccountsSlice";
import { Link } from "react-router-dom";
import { BsPencilSquare } from "react-icons/bs";
import LoadingSpinner from "../../../components/LoadingSpinner";
import "../style.css";

const NoAccountsAction = (props) => {
  return <div>Add your first spending account...</div>;
};

const AccountList = (props) => {
  const { investingAccounts } = props;

  return (
    <div className="account-list-wrapper">
      {investingAccounts.length === 0 ? (
        <NoAccountsAction />
      ) : (
        <div className="account-list">
          {investingAccounts.map((account) => (
            <div key={account.id} className="account-list-item-wrapper">
              <div className="account-list-item">
                <div>
                  <div>Account: {account.accountName}</div>
                  <div>Balance: {account.accountBalance}</div>
                  <div>
                    Created On:{" "}
                    {new Date(account.createDate).toLocaleDateString()}
                  </div>
                </div>
                <div className="investing-list-btn-wrapper">
                  <Link
                    to={`/investing/accounts/${account.id}`}
                    className="btn btn-primary"
                  >
                    Details
                  </Link>
                  <Link
                    to={`/investing/orders/${account.id}`}
                    className="btn btn-success"
                  >
                    Orders
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function InvestingAccountsList(props) {
  const investingAccounts = useSelector(selectAllInvestingAccounts);
  const status = useSelector((state) => state.investingAccounts.status);

  return (
    <div className="account-list-container">
      <div className="account-list-header">
        <div>
          <h3>Investing Accounts</h3>
        </div>
        <div>
          <Link to="/investing/accounts/new" className="btn btn-primary">
            <BsPencilSquare size={17} />
            <span className="ml-2 font-weight-bold">Add</span>
          </Link>
        </div>
      </div>
      {status === "loading" ? (
        <LoadingSpinner />
      ) : (
        <div>
          <AccountList investingAccounts={investingAccounts} />
        </div>
      )}
    </div>
  );
}

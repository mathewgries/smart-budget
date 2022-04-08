import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAllSpendingAcounts } from "../../../redux/spending/spendingAccountsSlice";
import SpendingAccountsList from "./SpendingAccountsList";
import LoadingSpinner from "../../../components/LoadingSpinner";

export default function SpendingAccounts(props) {
  const history = useHistory();
  const status = useSelector((state) => state.spendingAccounts.status);
	const accounts = useSelector(selectAllSpendingAcounts);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (status === "pending" && !isLoading) {
      setIsLoading(true);
    } else if (status !== "pending" && isLoading) {
      setIsLoading(false);
    }
  }, [status]);

  function handleRedirect(path) {
    history.push(path);
  }

  return (
    <div className="page-container">
      <div className="page-wrapper">
        <div className="page-list-wrapper">
          <div className="account-list-header-wrapper">
            <header className="spending-accounts-list-header">
              <h5>Spending Accounts</h5>
            </header>
            <div className="form-group">
              <button
                disabled={isLoading}
                className={`btn ${isLoading ? "btn-secondary" : "btn-primary"}`}
                onClick={() => handleRedirect("/spending/accounts/new")}
              >
                {isLoading ? <LoadingSpinner text={"loading"} /> : "Add"}
              </button>
            </div>
          </div>
          <div className="spending-accounts-list-section">
            <SpendingAccountsList status={status} accounts={accounts}/>
          </div>
        </div>
      </div>
    </div>
  );
}

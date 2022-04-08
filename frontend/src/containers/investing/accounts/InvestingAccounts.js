import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAllInvestingAccounts } from "../../../redux/investing/investingAccountsSlice";
import InvestingAccountsList from "./InvestingAccountsList";
import LoadingSpinner from "../../../components/LoadingSpinner";

export default function InvestingAccounts(props) {
  const history = useHistory();
  const status = useSelector((state) => state.investingAccounts.status);
	const accounts = useSelector(selectAllInvestingAccounts);
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
            <header className="account-list-header">
              <h5>Investing Accounts</h5>
            </header>
            <button
              disabled={isLoading}
              className={`btn ${isLoading ? "btn-secondary" : "btn-primary"}`}
              onClick={() => handleRedirect("/investing/accounts/new")}
            >
              {isLoading ? <LoadingSpinner text={"loading"} /> : "Add"}
            </button>
          </div>
          <div className="accounts-list-section">
            <InvestingAccountsList status={status} accounts={accounts}/>
          </div>
        </div>
      </div>
    </div>
  );
}

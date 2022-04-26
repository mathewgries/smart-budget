import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAllSpendingAcounts } from "../../../redux/spending/spendingAccountsSlice";
import { Link } from "react-router-dom";
import SpendingAccountsList from "./SpendingAccountsList";
import LoadingSpinner from "../../../components/LoadingSpinner";
import "./spendingAccounts.css";

export default function SpendingAccounts(props) {
  const history = useHistory();
  const status = useSelector((state) => state.spendingAccounts.status);
  const accounts = useSelector(selectAllSpendingAcounts);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (accounts.length === 0) {
      history.push("/");
    }
  });

  useEffect(() => {
    if (status === "pending" && !isLoading) {
      setIsLoading(true);
    } else if (status !== "pending" && isLoading) {
      setIsLoading(false);
    }
  }, [status, isLoading]);

  function handleRedirect(path) {
    history.push(path);
  }

  return (
    <div className="page-container">
      <div className="page-wrapper">
        <div className="spending-accounts-wrapper">
          <section className="spending-account-header-wrapper">
            <header className="spending-account-header">
              <Link to="/">
                <h4>Spending Accounts</h4>
              </Link>
            </header>
            <div className="form-group">
              <button
                disabled={isLoading}
                className="btn btn-add-new"
                onClick={() => handleRedirect("/spending/accounts/new")}
              >
                {isLoading ? <LoadingSpinner text={"loading"} /> : "Add"}
              </button>
            </div>
          </section>
          <section className="spending-accounts-list-wrapper">
            <SpendingAccountsList status={status} accounts={accounts} />
          </section>
        </div>
      </div>
    </div>
  );
}

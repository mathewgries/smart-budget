import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAllInvestingAccounts } from "../../../redux/investing/investingAccountsSlice";
import { Link } from "react-router-dom";
import InvestingAccountsList from "./InvestingAccountsList";
import LoadingSpinner from "../../../components/LoadingSpinner";
import "./investingAccounts.css";

export default function InvestingAccounts(props) {
  const history = useHistory();
  const status = useSelector((state) => state.investingAccounts.status);
  const accounts = useSelector(selectAllInvestingAccounts);
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
        <div className="investing-accounts-wrapper">
          <section className="page-header-wrapper  account-list-header">
            <header className="page-header">
              <Link to="/">
                <h4>Investing Accounts</h4>
              </Link>
            </header>
            <div>
              <button
                disabled={isLoading}
                className="btn btn-add-new"
                onClick={() => handleRedirect("/investing/accounts/new")}
              >
                {isLoading ? <LoadingSpinner text={"loading"} /> : "Add"}
              </button>
            </div>
          </section>
          <section className="investing-accounts-list-wrapper">
            <InvestingAccountsList status={status} accounts={accounts} />
          </section>
        </div>
      </div>
    </div>
  );
}

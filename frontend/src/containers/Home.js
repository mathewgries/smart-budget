import React, { useEffect } from "react";
import { useAppContext } from "../lib/contextLib";
import { useSelector, useDispatch } from "react-redux";
import { fetchSpendingAccounts } from "../redux/spending/spendingAccountsSlice";
import { fetchSpendingTransactions } from "../redux/spending/spendingTransactionsSlice";
import { fetchCategories } from "../redux/spending/categoriesSlice";
import { fetchInvestingAccounts } from "../redux/investing/investingAccountsSlice";
import { fetchInvestingTransactions } from "../redux/investing/investingTransactionsSlice";
import { Link } from "react-router-dom";
import SpendingAccountsList from "./spending/accounts/SpendingAccountsList";
import InvestingAccountsList from "./investing/accounts/InvestingAccountsList";
import "./style.css";

export default function Home() {
  const dispatch = useDispatch();
  const spendingAccountsState = useSelector(
    (state) => state.spendingAccounts.status
  );
  const categoriesStatus = useSelector((state) => state.categories.status);
  const spendingTransactionsStatus = useSelector(
    (state) => state.spendingTransactions.status
  );
  const investingAccountsStatus = useSelector(
    (state) => state.investingAccounts.status
  );
  const investingTransactionsStatus = useSelector(
    (state) => state.investingTransactions.status
  );
  const { isAuthenticated } = useAppContext();

  useEffect(() => {
    async function onLoad() {
      if (!isAuthenticated) {
        return;
      }

      if (spendingAccountsState === "idle") {
        dispatch(fetchSpendingAccounts());
      }

      if (spendingTransactionsStatus === "idle") {
        dispatch(fetchSpendingTransactions());
      }

      if (categoriesStatus === "idle") {
        dispatch(fetchCategories());
      }

      if (investingAccountsStatus === "idle") {
        dispatch(fetchInvestingAccounts());
      }

      if (investingTransactionsStatus === "idle") {
        dispatch(fetchInvestingTransactions());
      }
    }

    onLoad();
  }, [
    isAuthenticated,
    spendingAccountsState,
    spendingTransactionsStatus,
    categoriesStatus,
    investingAccountsStatus,
    investingTransactionsStatus,
    dispatch,
  ]);

  function renderLander() {
    return (
      <div className="lander">
        <h1>Smart Budget</h1>
        <p className="text-muted">Control your money habits</p>
      </div>
    );
  }

  function renderAccounts() {
    return (
      <div className="page-wrapper">
        <section className="home-account-list-section">
          <div className="page-list-wrapper">
            <div className="home-list-header-wrapper">
              <header className="home-list-header">
                <h5>Spending Accounts</h5>
              </header>
              <div>
                <Link to="/spending/accounts/new" className="btn btn-primary">
                  Add
                </Link>
              </div>
            </div>
            <div className="home-list-section">
              <SpendingAccountsList />
            </div>
          </div>
          <div className="page-list-wrapper">
            <div className="home-list-header-wrapper">
              <header className="home-list-header">
                <h5>Investing Accounts</h5>
              </header>
              <div>
                <Link to="/investing/accounts/new" className="btn btn-primary">
                  Add
                </Link>
              </div>
            </div>
            <div className="home-list-section">
              <InvestingAccountsList />
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="page-container">
      {isAuthenticated ? renderAccounts() : renderLander()}
    </div>
  );
}

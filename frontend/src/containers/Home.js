import React, { useEffect } from "react";
import { useAppContext } from "../lib/contextLib";
import { useSelector, useDispatch } from "react-redux";
import { fetchSpendingAccounts } from "../redux/spending/spendingAccountsSlice";
import { fetchSpendingTransactions } from "../redux/spending/spendingTransactionsSlice";
import { fetchCategories } from "../redux/spending/categoriesSlice";
import { fetchInvestingAccounts } from "../redux/investing/investingAccountsSlice";
import { fetchInvestingTransactions } from "../redux/investing/investingTransactionsSlice";
import { fetchSharesOrders } from "../redux/investing/sharesOrdersSlice";
import { fetchOptionsOrders } from "../redux/investing/optionsOrdersSlice";
import { fetchVerticalSpreadsOrders } from "../redux/investing/verticalSpreadsOrdersSlice";
import { fetchSignals } from "../redux/investing/investingSignalsSlice";
import { Link } from "react-router-dom";
import SpendingAccountsList from "./spending/accounts/SpendingAccountsList";
import InvestingAccountsList from "./investing/accounts/InvestingAccountsList";
import LoadingSpinner from "../components/LoadingSpinner";
import "./style.css";

export default function Home() {
  const dispatch = useDispatch();
  const spendingAccountsState = useSelector(
    (state) => state.spendingAccounts.status
  );
  const spendingTransactionsStatus = useSelector(
    (state) => state.spendingTransactions.status
  );
  const categoriesStatus = useSelector((state) => state.categories.status);

  const investingAccountsStatus = useSelector(
    (state) => state.investingAccounts.status
  );
  const investingTransactionsStatus = useSelector(
    (state) => state.investingTransactions.status
  );
  const sharesStatus = useSelector((state) => state.sharesOrders.status);
  const optionsStatus = useSelector((state) => state.optionsOrders.status);
  const vertSpreadsStatus = useSelector(
    (state) => state.verticalSpreadsOrders.status
  );
  const investingSignalsStatus = useSelector(
    (state) => state.investingSignals.status
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

      if (investingAccountsStatus === "idle") {
        dispatch(fetchInvestingAccounts());
      }

      if (investingTransactionsStatus === "idle") {
        dispatch(fetchInvestingTransactions());
      }

      if (sharesStatus === "idle") {
        dispatch(fetchSharesOrders());
      }

      if (optionsStatus === "idle") {
        dispatch(fetchOptionsOrders());
      }

      if (vertSpreadsStatus === "idle") {
        dispatch(fetchVerticalSpreadsOrders());
      }

      if (investingSignalsStatus === "idle") {
        dispatch(fetchSignals());
      }

			if (categoriesStatus === "idle") {
        dispatch(fetchCategories());
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
    sharesStatus,
    optionsStatus,
    vertSpreadsStatus,
    investingSignalsStatus,
    dispatch,
  ]);

  function renderLander() {
    return (
      <div className="page-wrapper">
        <div className="lander-wrapper">
          <h1>Smart Budget</h1>
          <p className="text-muted">Control your money habits</p>
        </div>
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
                {spendingAccountsState === "loading" ? (
                  <h5>Spending Accounts</h5>
                ) : (
                  <Link to="/spending">
                    <h5>Spending Accounts</h5>
                  </Link>
                )}
              </header>
              <div className="form-group">
                {spendingAccountsState === "loading" ? (
                  <button disabled={true} className="btn btn-secondary">
                    <LoadingSpinner />
                  </button>
                ) : (
                  <Link to="/spending/accounts/new" className="btn btn-primary">
                    Add
                  </Link>
                )}
              </div>
            </div>
            <div className="home-list-section">
              <SpendingAccountsList />
            </div>
          </div>
          <div className="page-list-wrapper">
            <div className="home-list-header-wrapper">
              <header className="home-list-header">
                {investingAccountsStatus === "loading" ? (
                  <h5>Investing Accounts</h5>
                ) : (
                  <Link to="/investing">
                    <h5>Investing Accounts</h5>
                  </Link>
                )}
              </header>
              <div className="form-group">
                {investingAccountsStatus === "loading" ? (
                  <button disabled={true} className="btn btn-secondary">
                    <LoadingSpinner />
                  </button>
                ) : (
                  <Link
                    to="/investing/accounts/new"
                    className="btn btn-primary"
                  >
                    Add
                  </Link>
                )}
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

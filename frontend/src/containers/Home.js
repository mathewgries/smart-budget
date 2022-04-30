import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useAppContext } from "../lib/contextLib";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllData } from "../redux/users/usersSlice";
import { selectAllSpendingAcounts } from "../redux/spending/spendingAccountsSlice";
import { selectAllInvestingAccounts } from "../redux/investing/investingAccountsSlice";
import { Link } from "react-router-dom";
import SpendingAccountsList from "./spending/accounts/SpendingAccountsList";
import InvestingAccountsList from "./investing/accounts/InvestingAccountsList";
import LoadingSpinner from "../components/LoadingSpinner";
import { onError } from "../lib/errorLib";
import "./home.css";

export default function Home() {
  const history = useHistory();
  const dispatch = useDispatch();
  const prevLocation = useSelector((state) => state.history.lastRoute);
  const usersStatus = useSelector((state) => state.users.status);
  const spendingAccountStatus = useSelector(
    (state) => state.spendingAccounts.status
  );
  const investingAccountStatus = useSelector(
    (state) => state.investingAccounts.status
  );
  const spendingAccounts = useSelector(selectAllSpendingAcounts);
  const investingAccounts = useSelector(selectAllInvestingAccounts);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAppContext();

  useEffect(() => {
    async function onLoad() {
      if (!isAuthenticated) {
        return;
      }

      function validateStatus() {
        return (
          usersStatus === "pending" ||
          spendingAccountStatus === "pending" ||
          investingAccountStatus === "pending"
        );
      }

      if (validateStatus() && !isLoading) {
        setIsLoading(true);
      } else if (!validateStatus() && isLoading) {
        setIsLoading(false);
      }

      if (usersStatus === "idle") {
        try {
          await dispatch(fetchAllData()).unwrap();
        } catch (e) {
          onError(e);
        }
      }
    }

    onLoad();
  }, [
    isAuthenticated,
    isLoading,
    usersStatus,
    spendingAccountStatus,
    investingAccountStatus,
    prevLocation,
    dispatch,
  ]);

  function handleRedirect(path) {
    history.push(path);
  }

  function renderLander() {
    return (
      <div className="page-wrapper">
        <div className="home-lander-wrapper">
          <div>
            <h1>Smart Budget</h1>
            <p style={{ color: "#ee6c4d" }}>Control your money habits</p>
          </div>

          <div className="lander-btn-wrapper">
            <div>
              <Link to={"/login"} className="btn btn-add-new">
                Login
              </Link>
            </div>
            <div>
              <Link to={"/signup"} className="btn btn-edit">
                Signup
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function renderAccounts() {
    return (
      <div className="page-wrapper">
        <section className="home-account-section">
          <div className="home-list-section">
            <div className="page-header-wrapper account-list-header">
              <header className="page-header">
                <Link to="/spending">
                  <h4>Spending Accounts</h4>
                </Link>
              </header>
              <div>
                <button
                  disabled={isLoading}
                  className="btn btn-add-new"
                  onClick={() => handleRedirect("/spending/accounts/new")}
                >
                  {isLoading ? <LoadingSpinner text={"loading"} /> : "Add"}
                </button>
              </div>
            </div>
            <div className="home-list-wrapper">
              <SpendingAccountsList
                status={spendingAccountStatus}
                accounts={spendingAccounts}
              />
            </div>
          </div>

          <div className="home-list-section">
            <div className="page-header-wrapper account-list-header">
              <header className="page-header">
                <Link to="/investing">
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
            </div>
            <div className="home-list-wrapper">
              <InvestingAccountsList
                status={investingAccountStatus}
                accounts={investingAccounts}
              />
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

import React, { useEffect } from "react";
import { useAppContext } from "../lib/contextLib";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllData, addNewUser } from "../redux/users/usersSlice";
import { lastRouteUpdated } from "../redux/history/historySlice";
import { getUserInfo } from "../api/users";
import { Link } from "react-router-dom";
import SpendingAccountsList from "./spending/accounts/SpendingAccountsList";
import InvestingAccountsList from "./investing/accounts/InvestingAccountsList";
import LoadingSpinner from "../components/LoadingSpinner";
import "./style.css";
import { onError } from "../lib/errorLib";

export default function Home() {
  const dispatch = useDispatch();
  const prevLocation = useSelector((state) => state.history.lastRoute);
  const status = useSelector((state) => state.users.status);
  const { isAuthenticated } = useAppContext();

  useEffect(() => {
    async function onLoad() {
      if (!isAuthenticated) {
        return;
      }

      if (prevLocation === "/signup") {
        dispatch(lastRouteUpdated("/"));
        const userInfo = await getUserInfo();
        await dispatch(addNewUser(userInfo)).unwrap();
      } else {
        try {
          await dispatch(fetchAllData()).unwrap();
        } catch (e) {
          onError(e);
        }
      }
    }

    onLoad();
  }, [isAuthenticated, dispatch]);

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
                {status === "pending" ? (
                  <h5>Spending Accounts</h5>
                ) : (
                  <Link to="/spending">
                    <h5>Spending Accounts</h5>
                  </Link>
                )}
              </header>
              <div className="form-group">
                {status === "pending" ? (
                  <button disabled={true} className="btn btn-secondary">
                    <LoadingSpinner text={"loading"} />
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
                {status === "pending" ? (
                  <h5>Investing Accounts</h5>
                ) : (
                  <Link to="/investing">
                    <h5>Investing Accounts</h5>
                  </Link>
                )}
              </header>
              <div className="form-group">
                {status === "pending" ? (
                  <button disabled={true} className="btn btn-secondary">
                    <LoadingSpinner text={"loading"} />
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

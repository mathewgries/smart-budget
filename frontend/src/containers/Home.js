import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAccounts } from "../redux/accountsSlice";
import { fetchCategories } from "../redux/categoriesSlice";
import { fetchTransactions } from "../redux/transactionsSlice";
import ListGroup from "react-bootstrap/ListGroup";
import AccountList from "../containers/accounts/AccountList";
import { BsPencilSquare } from "react-icons/bs";
import { Link } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { useAppContext } from "../lib/contextLib";
import "./style.css";

export default function Home() {
  const dispatch = useDispatch();
  const accountStatus = useSelector((state) => state.accounts.status);
  const categoriesStatus = useSelector((state) => state.categories.status);
  const transactionsStatus = useSelector((state) => state.transactions.status);
  const { isAuthenticated } = useAppContext();

  useEffect(() => {
    async function onLoad() {
      if (!isAuthenticated) {
        return;
      }

      if (accountStatus === "idle") {
        dispatch(fetchAccounts());
      }

      if (transactionsStatus === "idle") {
        dispatch(fetchTransactions());
      }

      if (categoriesStatus === "idle") {
        dispatch(fetchCategories());
      }
    }

    onLoad();
  }, [
    isAuthenticated,
    accountStatus,
    transactionsStatus,
    categoriesStatus,
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
      <div className="home-container">
        <div className="home-header border-bottom">
          <div>
            <h2>Your Accounts</h2>
          </div>
          <div>
            <Link to="/accounts/new" className="btn btn-primary">
              <BsPencilSquare size={17} />
              <span className="ml-2 font-weight-bold">
                New Account
              </span>
            </Link>
          </div>
        </div>
        <div>
          <AccountList />
        </div>
      </div>
    );
  }

  return (
    <div className="home-wrapper">
      {isAuthenticated ? renderAccounts() : renderLander()}
    </div>
  );
}

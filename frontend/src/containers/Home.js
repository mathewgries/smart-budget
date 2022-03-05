import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAccounts } from "../redux/accountsSlice";
import { fetchCategories } from "../redux/categoriesSlice";
import ListGroup from "react-bootstrap/ListGroup";
import AccountList from "../containers/accounts/AccountList";
import { BsPencilSquare } from "react-icons/bs";
import { LinkContainer } from "react-router-bootstrap";
import { useAppContext } from "../lib/contextLib";
import "./style.css";

export default function Home() {
  const dispatch = useDispatch();
  const accountStatus = useSelector((state) => state.accounts.status);
  const categoriesStatus = useSelector((state) => state.categories.status);
  const { isAuthenticated } = useAppContext();

  useEffect(() => {
    async function onLoad() {
      if (!isAuthenticated) {
        return;
      }

      if (accountStatus === "idle") {
        dispatch(fetchAccounts());
      }

      if (categoriesStatus === "idle") {
				dispatch(fetchCategories())
      }
    }

    onLoad();
  }, [isAuthenticated, accountStatus, categoriesStatus, dispatch]);

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
      <div className="accounts">
        <h2 className="pb-3 mt-4 mb-3 border-bottom">Your Accounts</h2>
        <LinkContainer to="/accounts/new">
          <ListGroup.Item action className="py-3 text-nowrap text-truncate">
            <BsPencilSquare size={17} />
            <span className="ml-2 font-weight-bold">Create a new account</span>
          </ListGroup.Item>
        </LinkContainer>
        <div>
          <AccountList />
        </div>
      </div>
    );
  }

  return (
    <div className="Home">
      {isAuthenticated ? renderAccounts() : renderLander()}
    </div>
  );
}

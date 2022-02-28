import React, { useEffect, useState } from "react";
import { API } from "aws-amplify";
import ListGroup from "react-bootstrap/ListGroup";
import AccountList from "../containers/accounts/AccountList";
import { BsPencilSquare } from "react-icons/bs";
import { LinkContainer } from "react-router-bootstrap";
import { useAppContext } from "../lib/contextLib";
import { onError } from "../lib/errorLib";
import "./style.css";

export default function Home() {
  const [accounts, setAccounts] = useState([]);
  const { isAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function onLoad() {
      if (!isAuthenticated) {
        return;
      }

      try {
        const accounts = await loadAccounts();
        setAccounts(accounts);
      } catch (e) {
        onError(e);
      }

      setIsLoading(false);
    }

    onLoad();
  }, [isAuthenticated]);

  function loadAccounts() {
    return API.get("smartbudget", "/accounts");
  }

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
          <AccountList isLoading={isLoading} accounts={accounts} />
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

import React from "react";
import { Link } from "react-router-dom";
import "./navigation.css";

export default function TopNavBar(props) {
  const { isAuthenticated, handleLogout } = props;
  return (
    <nav className="navbar navbar-expand-md">
      <Link className="navbar-brand" to="/">
        SmartBudget
      </Link>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span role="button">
          <i
            className="fa fa-bars"
            aria-hidden="true"
            style={{ color: "#293241" }}
          ></i>
        </span>
      </button>

      {isAuthenticated && (
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item dropdown">
              <button
                className="nav-link dropdown-toggle"
                id="navbarDropdown"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                Spending
              </button>
              <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                <Link className="dropdown-item" to="/spending">
                  Accounts
                </Link>
                <Link className="dropdown-item" to="/spending/categories">
                  Categories
                </Link>
                <Link className="dropdown-item" to="/graph-tesing">
                  Graph Tesing
                </Link>
              </div>
            </li>
            <li className="nav-item dropdown">
              <button
                className="nav-link dropdown-toggle"
                id="navbarDropdown"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                Investing
              </button>
              <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                <Link className="dropdown-item" to="/investing">
                  Accounts
                </Link>
                <Link className="dropdown-item" to="/investing/strategies">
                  Strategies
                </Link>
              </div>
            </li>
          </ul>
          <div>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      )}

      {!isAuthenticated && (
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <div className="auth-btn-wrapper ml-auto">
            <div>
              <Link to={"/login"} className="">
                Login
              </Link>
            </div>
            <span>|</span>
            <div>
              <Link to={"/signup"} className="">
                Signup
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

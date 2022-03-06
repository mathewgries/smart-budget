import React from "react";
import { Route, Switch } from "react-router-dom";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import UnauthenticatedRoute from "./components/UnauthenticatedRoute";
import Home from "./containers/Home";
import Signup from "./containers/auth/Signup";
import Login from "./containers/auth/Login";
import NewAccount from "./containers/accounts/NewAccount";
import Account from "./containers/accounts/Account";
import Transaction from "./containers/transactions/Transaction";
import Categories from "./containers/categories/Categories";
import NotFound from "./containers/NotFound";

export default function Routes() {
  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <UnauthenticatedRoute exact path="/login">
        <Login />
      </UnauthenticatedRoute>
      <UnauthenticatedRoute exact path="/signup">
        <Signup />
      </UnauthenticatedRoute>
      <AuthenticatedRoute exact path="/accounts/new">
        <NewAccount />
      </AuthenticatedRoute>
      <AuthenticatedRoute exact path="/accounts/:id">
        <Account />
      </AuthenticatedRoute>
			<AuthenticatedRoute exact path="/transactions/:id">
        <Transaction />
      </AuthenticatedRoute>
			<AuthenticatedRoute exact path="/categories">
        <Categories />
      </AuthenticatedRoute>
      {/* Finally, catch all unmatched routes */}
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

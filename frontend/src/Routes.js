import React from "react";
import { Route, Switch } from "react-router-dom";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import UnauthenticatedRoute from "./components/UnauthenticatedRoute";
import Signup from "./containers/auth/Signup";
import Login from "./containers/auth/Login";
import Home from "./containers/Home";
import SpendingAccounts from "./containers/spending/accounts/SpendingAccounts"
import SpendingAccountNew from "./containers/spending/accounts/SpendingAccountNew";
import SpendingAccount from "./containers/spending/accounts/SpendingAccount";
import SpendingTransaction from "./containers/spending/transactions/SpendingTransaction";
import Categories from "./containers/spending/categories/Categories";
import InvestingAccountsList from "./containers/investing/accounts/InvestingAccountsList";
import InvestingAccountNew from "./containers/investing/accounts/InvestingAccountNew";
import InvestingAccount from "./containers/investing/accounts/InvestingAccount";
import InvestingTransaction from "./containers/investing/transactions/InvestingTransaction";
import InvestingOrders from "./containers/investing/orders/InvestingOrders";
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
			<AuthenticatedRoute exact path="/spending"> 
				<SpendingAccounts />
			</AuthenticatedRoute>
      <AuthenticatedRoute exact path="/spending/accounts/new">
        <SpendingAccountNew />
      </AuthenticatedRoute>
      <AuthenticatedRoute exact path="/spending/accounts/:id">
        <SpendingAccount />
      </AuthenticatedRoute>
			<AuthenticatedRoute exact path="/spending/transactions/:id">
        <SpendingTransaction />
      </AuthenticatedRoute>
			<AuthenticatedRoute exact path="/spending/categories">
        <Categories />
      </AuthenticatedRoute>
			<AuthenticatedRoute exact path="/investing">
        <InvestingAccountsList />
      </AuthenticatedRoute>
			<AuthenticatedRoute exact path="/investing/accounts/new">
        <InvestingAccountNew />
      </AuthenticatedRoute>
			<AuthenticatedRoute exact path="/investing/accounts/:id">
        <InvestingAccount />
      </AuthenticatedRoute>
			<AuthenticatedRoute exact path="/investing/transactions/:id">
        <InvestingTransaction />
      </AuthenticatedRoute>
			<AuthenticatedRoute exact path="/investing/orders/:id">
        <InvestingOrders />
      </AuthenticatedRoute>
			
      {/* Finally, catch all unmatched routes */}
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

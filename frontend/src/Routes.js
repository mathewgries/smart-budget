import React from "react";
import { Route, Switch } from "react-router-dom";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import UnauthenticatedRoute from "./components/UnauthenticatedRoute";
import Signup from "./containers/auth/Signup";
import Login from "./containers/auth/Login";
import Home from "./containers/Home";

import SpendingAccounts from "./containers/spending/accounts/SpendingAccounts";
import SpendingAccount from "./containers/spending/accounts/SpendingAccount";
import SpendingAccountNew from "./containers/spending/accounts/SpendingAccountNew";
import SpendingAccountEdit from "./containers/spending/accounts/SpendingAccountEdit";
import SpendingTransaction from "./containers/spending/transactions/SpendingTransaction";
import SpendingTransactionNew from "./containers/spending/transactions/SpendingTransactionNew";
import SpendingTransactionEdit from "./containers/spending/transactions/SpendingTransactionEdit";
import Categories from "./containers/spending/categories/Categories";

import InvestingAccounts from "./containers/investing/accounts/InvestingAccounts";
import InvestingAccount from "./containers/investing/accounts/InvestingAccount";
import InvestingAccountsNew from "./containers/investing/accounts/InvestingAccountNew";
import InvestingAccountsEdit from "./containers/investing/accounts/InvestingAccountEdit";
import InvestingTransaction from "./containers/investing/transactions/InvestingTransaction";
import InvestingTransactionNew from "./containers/investing/transactions/InvestingTransactionNew";
import InvestingTransactionEdit from "./containers/investing/transactions/InvestingTransactionEdit";

import InvestingJournal from "./containers/investing/journal/InvestingJournal";

import OptionsOrder from "./containers/investing/orders/options/OptionsOrder";
import OptionsOrderNew from "./containers/investing/orders/options/OptionsOrderNew";
import OptionsOrderEdit from "./containers/investing/orders/options/OptionsOrderEdit";

import SharesOrder from "./containers/investing/orders/shares/SharesOrder";
import SharesOrderNew from "./containers/investing/orders/shares/SharesOrderNew";
import SharesOrderEdit from "./containers/investing/orders/shares/SharesOrderEdit";

import VerticalSpreadsOrder from "./containers/investing/orders/spreads/VerticalSpreadsOrder";
import VerticalSpreadsOrderNew from "./containers/investing/orders/spreads/VerticalSpreadsOrderNew";
import VerticalSpreadsOrderEdit from "./containers/investing/orders/spreads/VerticalSpreadsOrderEdit";

import Strategies from "./containers/investing/strategies/Strategies";

import NotFound from "./containers/NotFound";
import SeedData from "./seed/SeedData"

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

			<AuthenticatedRoute exact path="/seed-data">
        <SeedData />
      </AuthenticatedRoute>

      {/* SPENDING ACCOUNTS */}
      <AuthenticatedRoute exact path="/spending">
        <SpendingAccounts />
      </AuthenticatedRoute>

      <AuthenticatedRoute exact path="/spending/accounts/new">
        <SpendingAccountNew />
      </AuthenticatedRoute>

      <AuthenticatedRoute exact path="/spending/accounts/:id">
        <SpendingAccount />
      </AuthenticatedRoute>

      <AuthenticatedRoute exact path="/spending/accounts/edit/:id">
        <SpendingAccountEdit />
      </AuthenticatedRoute>

      <AuthenticatedRoute exact path="/spending/transactions/:id">
        <SpendingTransaction />
      </AuthenticatedRoute>

      <AuthenticatedRoute exact path="/spending/transactions/new/:id">
        <SpendingTransactionNew />
      </AuthenticatedRoute>

      <AuthenticatedRoute exact path="/spending/transactions/edit/:id">
        <SpendingTransactionEdit />
      </AuthenticatedRoute>

      <AuthenticatedRoute exact path="/spending/categories">
        <Categories />
      </AuthenticatedRoute>

      {/* INVESTING ACCOUNTS */}
      <AuthenticatedRoute exact path="/investing">
        <InvestingAccounts />
      </AuthenticatedRoute>

      <AuthenticatedRoute exact path="/investing/accounts/new">
        <InvestingAccountsNew />
      </AuthenticatedRoute>

      <AuthenticatedRoute exact path="/investing/accounts/:id">
        <InvestingAccount />
      </AuthenticatedRoute>

      <AuthenticatedRoute exact path="/investing/accounts/edit/:id">
        <InvestingAccountsEdit />
      </AuthenticatedRoute>

      <AuthenticatedRoute exact path="/investing/transactions/:id">
        <InvestingTransaction />
      </AuthenticatedRoute>

      <AuthenticatedRoute exact path="/investing/transactions/new/:id">
        <InvestingTransactionNew />
      </AuthenticatedRoute>

      <AuthenticatedRoute exact path="/investing/transactions/edit/:id">
        <InvestingTransactionEdit />
      </AuthenticatedRoute>

      {/* INVESTING ORDERS */}
      <AuthenticatedRoute exact path="/investing/orders/options/:id">
        <OptionsOrder />
      </AuthenticatedRoute>

      <AuthenticatedRoute exact path="/investing/orders/options/new/:id">
        <OptionsOrderNew />
      </AuthenticatedRoute>

      <AuthenticatedRoute exact path="/investing/orders/options/edit/:id">
        <OptionsOrderEdit />
      </AuthenticatedRoute>

      <AuthenticatedRoute exact path="/investing/orders/shares/:id">
        <SharesOrder />
      </AuthenticatedRoute>

      <AuthenticatedRoute exact path="/investing/orders/shares/new/:id">
        <SharesOrderNew />
      </AuthenticatedRoute>

      <AuthenticatedRoute exact path="/investing/orders/shares/edit/:id">
        <SharesOrderEdit />
      </AuthenticatedRoute>

      <AuthenticatedRoute exact path="/investing/orders/spreads/vertical/:id">
        <VerticalSpreadsOrder />
      </AuthenticatedRoute>

      <AuthenticatedRoute
        exact
        path="/investing/orders/spreads/vertical/new/:id"
      >
        <VerticalSpreadsOrderNew />
      </AuthenticatedRoute>

      <AuthenticatedRoute
        exact
        path="/investing/orders/spreads/vertical/edit/:id"
      >
        <VerticalSpreadsOrderEdit />
      </AuthenticatedRoute>

      <AuthenticatedRoute exact path="/investing/strategies">
        <Strategies />
      </AuthenticatedRoute>

      {/* INVESTING JOURNAL */}
      <AuthenticatedRoute exact path="/investing/journal/:id">
        <InvestingJournal />
      </AuthenticatedRoute>

      {/* Finally, catch all unmatched routes */}
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

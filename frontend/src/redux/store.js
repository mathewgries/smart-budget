import { configureStore } from "@reduxjs/toolkit";
import historyReducer from "./history/historySlice";
import appReducer from "./appSlice";
import usersReducer from "./users/usersSlice";
import spendingAccountsReducer from "./spending/spendingAccountsSlice";
import categoriesReducer from "./spending/categoriesSlice";
import spendingTransactionReducer from "./spending/spendingTransactionsSlice";
import investingAccountsReducer from "./investing/investingAccountsSlice";
import investingTransactionsReducer from "./investing/investingTransactionsSlice";
import optionsOrdersReducer from "./investing/optionsOrdersSlice";
import sharesOrdersReducer from "./investing/sharesOrdersSlice";
import verticalSpreadsOrdersReducer from "./investing/verticalSpreadsOrdersSlice";
import strategiesReducer from "./investing/strategiesSlice";
import signalsReducer from "./investing/signalsSlice";

export default configureStore({
  reducer: {
    history: historyReducer,
		app: appReducer,
    users: usersReducer,
    spendingAccounts: spendingAccountsReducer,
    spendingTransactions: spendingTransactionReducer,
    categories: categoriesReducer,
    investingAccounts: investingAccountsReducer,
    investingTransactions: investingTransactionsReducer,
    optionsOrders: optionsOrdersReducer,
    sharesOrders: sharesOrdersReducer,
    verticalSpreadsOrders: verticalSpreadsOrdersReducer,
    strategies: strategiesReducer,
    signals: signalsReducer,
  },
});

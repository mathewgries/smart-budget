import { configureStore } from "@reduxjs/toolkit";
import historyReducer from "./history/historySlice"
import usersReducer from "./users/usersSlice"
import spendingAccountsReducer from "./spending/spendingAccountsSlice";
import categoriesReducer from "./spending/categoriesSlice";
import spendingTransactionReducer from "./spending/spendingTransactionsSlice";
import investingAccountsReducer from "./investing/investingAccountsSlice";
import investingTransactionsReducer from "./investing/investingTransactionsSlice";
import optionsOrdersReducer from "./investing/optionsOrdersSlice";
import sharesOrdersReducer from "./investing/sharesOrdersSlice";
import verticalSpreadsOrdersReducer from "./investing/verticalSpreadsOrdersSlice";
import investingSignalsReducer from "./investing/investingSignalsSlice";

export default configureStore({
  reducer: {
		history: historyReducer,
		users: usersReducer,
    spendingAccounts: spendingAccountsReducer,
    spendingTransactions: spendingTransactionReducer,
    categories: categoriesReducer,
    investingAccounts: investingAccountsReducer,
    investingTransactions: investingTransactionsReducer,
    investingSignals: investingSignalsReducer,
    optionsOrders: optionsOrdersReducer,
    sharesOrders: sharesOrdersReducer,
    verticalSpreadsOrders: verticalSpreadsOrdersReducer,
  },
});

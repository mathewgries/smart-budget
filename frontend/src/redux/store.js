import { configureStore } from "@reduxjs/toolkit";
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

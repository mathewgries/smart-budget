import { configureStore } from "@reduxjs/toolkit";
import spendingAccountsReducer from "./spending/spendingAccountsSlice";
import categoriesReducer from "./spending/categoriesSlice";
import spendingTransactionReducer from "./spending/spendingTransactionsSlice";
import investingAccountsReducer from "./investing/investingAccountsSlice";
import investingTransactionsReducer from "./investing/investingTransactionsSlice";
import investingOrdersReducer from "./investing/investingOrdersSlice";
import investingSignalsReducer from "./investing/investingSignalsSlice";

export default configureStore({
  reducer: {
    spendingAccounts: spendingAccountsReducer,
    spendingTransactions: spendingTransactionReducer,
    categories: categoriesReducer,
    investingAccounts: investingAccountsReducer,
    investingTransactions: investingTransactionsReducer,
    investingOrders: investingOrdersReducer,
    investingSignals: investingSignalsReducer,
  },
});

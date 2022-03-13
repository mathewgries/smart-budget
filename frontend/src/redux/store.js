import { configureStore } from "@reduxjs/toolkit";
import spendingAccountsReducer from "./spending/spendingAccountsSlice"
import categoriesReducer from "./spending/categoriesSlice";
import spendingTransactionReducer from "./spending/spendingTransactionsSlice";
import investingCusomtFieldsReducer from "./investing/investingCustomFieldsSlice";
import investingAccountsReducer from "./investing/investingAccountsSlice";
import investingTransactionsReducer from "./investing/investingTransactionsSlice";
import investingOrdersReducer from "./investing/investingOrdersSlice";

export default configureStore({
  reducer: {
    spendingAccounts: spendingAccountsReducer,
		spendingTransactions: spendingTransactionReducer,
    categories: categoriesReducer,
    investingCustomFields: investingCusomtFieldsReducer,
    investingAccounts: investingAccountsReducer,
    investingTransactions: investingTransactionsReducer,
    investingOrders: investingOrdersReducer,
  },
});

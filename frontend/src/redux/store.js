import { configureStore } from "@reduxjs/toolkit";
import accountsReducer from "../redux/accountsSlice";
import categoriesReducer from "../redux/categoriesSlice";
import transactionReducer from "../redux/transactionsSlice";

export default configureStore({
  reducer: {
    accounts: accountsReducer,
    categories: categoriesReducer,
    transactions: transactionReducer,
  },
});

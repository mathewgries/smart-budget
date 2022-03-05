import { configureStore } from "@reduxjs/toolkit";
import accountsReducer from "../redux/accountsSlice";
import categoriesReducer from "../redux/categoriesSlice";

export default configureStore({
  reducer: {
    accounts: accountsReducer,
    categories: categoriesReducer,
  },
});

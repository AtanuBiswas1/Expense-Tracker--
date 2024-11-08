import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/loginuser/loginUser.Slice.js"
import apiCallReducer from "../features/apiDate/apiData.Slice.js"

export const store = configureStore({
  reducer: {
    auth:authReducer,
    ExpensesANDIncomeAPICallData:apiCallReducer
  },
});

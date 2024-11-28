import { createSlice } from "@reduxjs/toolkit";

const apiSlice = createSlice({
  name: "ExpensesANDIncomeAPICallData",
  initialState: {
    // apiData:null,
    ExpensesData: "",
    IncomeData: null,
    newIncomeUpdate: false,
    newExpenseUpdate: false,
  },
  reducers: {
    ExpensesAPIData: (state, action) => {
      state.ExpensesData = action.payload;
    },
    IncomeAPIData: (state, action) => {
      state.IncomeData = action.payload;
    },
    UpdateIncomeData: (state) => {
      state.newIncomeUpdate = true;
    },
    UpdateExpenseDate: (state) => {
      state.newExpenseUpdate = true;
    },
  },
});

export const {
  ExpensesAPIData,
  IncomeAPIData,
  UpdateExpenseDate,
  UpdateIncomeData,
} = apiSlice.actions;
export default apiSlice.reducer;

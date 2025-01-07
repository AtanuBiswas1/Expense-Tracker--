import { createSlice } from "@reduxjs/toolkit";

const apiSlice = createSlice({
  name: "ExpensesANDIncomeAPICallData",
  initialState: {
    ShowGraph_notList: true,
    ExpensesData: "",
    IncomeData: null,
    newIncomeUpdate: false,
    newExpenseUpdate: false,
    TotalIncome:null,
    TotalExpense:null
  },
  reducers: {
    Toggle_ShowGraph_notList: (state, action) => {
      state.ShowGraph_notList = !state.ShowGraph_notList;
    },
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
    setTotalIncome:(state,action)=>{
      state.TotalIncome=action.payload
    },
    setTotalExpense:(state,action)=>{
      state.TotalExpense=action.payload
    }
    
  },
});

export const {
  Toggle_ShowGraph_notList,
  ExpensesAPIData,
  IncomeAPIData,
  UpdateExpenseDate,
  UpdateIncomeData,
  setTotalExpense,
  setTotalIncome
} = apiSlice.actions;
export default apiSlice.reducer;

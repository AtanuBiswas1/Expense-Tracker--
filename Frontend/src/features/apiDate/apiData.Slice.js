import { createSlice } from "@reduxjs/toolkit";

const apiSlice = createSlice({
  name: "ExpensesANDIncomeAPICallData",
  initialState: {
    ShowGraph_notList: true,
    ExpensesData:[],
    IncomeData:[],
    newIncomeUpdate: false,
    newExpenseUpdate: false,
    TotalIncome:0,
    TotalExpense:0
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
      state.TotalIncome=action.payload || 0
    },
    setTotalExpense:(state,action)=>{
      state.TotalExpense=action.payload || 0
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

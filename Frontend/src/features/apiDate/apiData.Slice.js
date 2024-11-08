import { createSlice } from "@reduxjs/toolkit";

const apiSlice=createSlice({
    name:"ExpensesANDIncomeAPICallData",
    initialState:{
        apiData:null,
        ExpensesData:"",
        IncomeData:null,
    },
    reducers:{
     ExpensesAPIData : (state,action)=>{
       state.ExpensesData=action.payload;
     },
     IncomeAPIData:(state,action)=>{
       state.IncomeData=action.payload;
     }
    }
})

export const {ExpensesAPIData,IncomeAPIData}=apiSlice.actions;
export default apiSlice.reducer;
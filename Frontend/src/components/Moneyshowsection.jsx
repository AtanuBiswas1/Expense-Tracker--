import React, { useEffect, useState } from "react";
import MoneyCard from "./MoneyCard";
import PopupAddIncome from "./PopupAddIncome";
import PopupAddExpense from "./PopupAddExpence";
import { useSelector} from "react-redux";

function Moneyshowsection() {
  const [addIncome, setAddIncome] = useState(false);
  const [addExpense, setAddExpense] = useState(false);

  const { TotalIncome, TotalExpense } = useSelector(
    (state) => state.ExpensesANDIncomeAPICallData
  );
  
  console.log("Moneyshowsection-->",TotalIncome, TotalExpense);

  const ClickAddIncomeBtn = () => {
    setAddIncome(true);
    setAddExpense(false);
  };
  const ClickAddExpense = () => {
    setAddExpense(true);
    setAddIncome(false);
  };
  return (
    <>
      <div className="max-w-[1200px] mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Financial Overview</h2>
            <p className="text-sm text-slate-500">Monitor your cash flow, savings, and expenses</p>
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <button
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl shadow-lg shadow-teal-600/10 hover:shadow-teal-600/20 transition-all duration-300 transform hover:-translate-y-0.5"
              onClick={ClickAddIncomeBtn}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
              </svg>
              <span>Add Income</span>
            </button>
            <button
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-rose-50 hover:bg-rose-100 border border-rose-200/80 text-rose-600 font-semibold rounded-xl transition-all duration-300 transform hover:-translate-y-0.5"
              onClick={ClickAddExpense}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20 12H4" />
              </svg>
              <span>Add Expense</span>
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 justify-between">
          <MoneyCard
            titel="Total Balance"
            totalBal={TotalIncome - TotalExpense}
          />
          <MoneyCard
            titel="Total Income Balance"
            totalBal={TotalIncome}
          />
          <MoneyCard
            titel="Total Expense"
            totalBal={TotalExpense}
          />
        </div>
      </div>

      {addIncome ? (
        <div
          className="w-full h-full flex items-center justify-center p-4 fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm transition-all duration-300"
        >
          <div className="w-full max-w-md transform scale-100 opacity-100 transition-all duration-300">
            <PopupAddIncome setAddIncome={setAddIncome} />
          </div>
        </div>
      ) : null}

      {addExpense ? (
        <div
          className="w-full h-full flex items-center justify-center p-4 fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm transition-all duration-300"
        >
          <div className="w-full max-w-md transform scale-100 opacity-100 transition-all duration-300">
            <PopupAddExpense setAddExpense={setAddExpense} />
          </div>
        </div>
      ) : null}
    </>
  );
}

export default Moneyshowsection;

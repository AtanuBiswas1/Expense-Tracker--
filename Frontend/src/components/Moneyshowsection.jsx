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
      <div className="flex flex-wrap gap-6 justify-center">
        <MoneyCard
          titel="Total Balance"
          totalBal={TotalIncome + TotalExpense}
        />
        <MoneyCard
          titel="Total Income Balance"
          totalBal={TotalIncome}
          bgColor="bg-blue-900"
        />
        <MoneyCard
          titel="Total Expense"
          totalBal={TotalExpense}
          bgColor="bg-yellow-900"
        />
        <div className="flex flex-col sm:flex-row items-center">
          <button
            className="px-4 py-2 bg-green-500 text-white rounded-xl shadow-lg m-3 mt-8 transform transition-transform duration-300 hover:scale-110 hover:bg-green-700"
            onClick={ClickAddIncomeBtn}
          >
            Add Income
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded-xl shadow-lg m-3 mt-8 transform transition-transform duration-300 hover:scale-110 hover:bg-red-700"
            onClick={ClickAddExpense}
          >
            Add Expense
          </button>
        </div>
      </div>

      {/* {!addIncome ? null : (
        <div
          
          className={`w-full h-full flex items-center justify-center p-3 fixed inset-0 bg-black bg-opacity-70 transform transition-transform duration-500 ease-in-out`}
        >
          {addIncome && <PopupAddIncome setAddIncome={setAddIncome} />}
        </div>
      )} */}
      {!addIncome ? null : (
        <div
          className={`w-full h-full flex items-center justify-center p-3 fixed inset-0 bg-black bg-opacity-70 transform transition-all duration-500 ease-in-out ${
            addIncome ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
        >
          {addIncome && <PopupAddIncome setAddIncome={setAddIncome} />}
        </div>
      )}

      {/* //...................................................................... */}
      {/* {!addExpense ? null : (
        <div
          className={`w-full h-full flex items-center justify-center p-3 fixed inset-0 bg-black bg-opacity-70 transform transition-transform duration-500 ease-in-out`}
        >
          {addExpense && <PopupAddExpense setAddExpense={setAddExpense} />}
        </div>
      )} */}
      {!addExpense ? null : (
        <div
          className={`w-full h-full flex items-center justify-center p-3 fixed inset-0 bg-black bg-opacity-70 transform transition-all duration-500 ease-in-out ${
            addExpense ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
        >
          {addExpense && <PopupAddExpense setAddExpense={setAddExpense} />}
        </div>
      )}
    </>
  );
}

export default Moneyshowsection;

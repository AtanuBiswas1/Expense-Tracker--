import React, { useEffect, useState } from "react";
import MoneyCard from "./MoneyCard";
import PopupAddIncome from "./PopupAddIncome";
import PopupAddExpense from "./PopupAddExpence";
import { useSelector ,useDispatch} from "react-redux";

function Moneyshowsection() {
  const [addIncome, setAddIncome] = useState(false);
  const [addExpense, setAddExpense] = useState(false);

  const { TotalIncome,TotalExpense } = useSelector(
    (state) => state.ExpensesANDIncomeAPICallData
  );
  

 

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
      <div className="flex gap-3">
        <MoneyCard titel="Total Balence" totalBal={TotalIncome + TotalExpense} />
        <MoneyCard
          titel=" Total Income Balence"
          totalBal={TotalIncome}
          bgColor="bg-blue-900"
        />
        <MoneyCard
          titel="Total Expense"
          totalBal={TotalExpense}
          bgColor="bg-yellow-900"
        />
        <div>
          <button
            className="p-3 bg-green-500 m-3 mt-8 rounded-xl"
            onClick={ClickAddIncomeBtn}
          >
            Add Income
          </button>
          <button
            className="p-3 bg-red-500 m-3 mt-8 rounded-xl"
            onClick={ClickAddExpense}
          >
            Add Expense
          </button>
        </div>
      </div>
      {!addIncome ? (
        ""
      ) : (
        <div
          className={`w-full h-full items-center p-3 flex justify-around z-10 absolute top-0 bg-customBackgroundColorBlack }`}
        >
          {addIncome ? <PopupAddIncome setAddIncome={setAddIncome} /> : null}
        </div>
      )}
      {!addExpense ? (
        ""
      ) : (
        <div
          className={`w-full h-full p-3 flex justify-around z-10 absolute top-0 bg-customBackgroundColorBlack }`}
        >
          {addExpense ? (
            <PopupAddExpense setAddExpense={setAddExpense} />
          ) : null}
        </div>
      )}

      {/* <div className={`w-full p-3 m-2 flex justify-around bg-red-500 z-10 absolute top-0 }`} >
       {addIncome ? <PopupAddIncome setAddIncome={setAddIncome} /> : null}
       {addExpense ? <PopupAddExpense setAddExpense={setAddExpense}/>:null}
       </div> */}
    </>
  );
}

export default Moneyshowsection;

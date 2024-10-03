import React, { useState } from "react";
import MoneyCard from "./MoneyCard";
import PopupAddIncome from "./PopupAddIncome"
import PopupAddExpence from "./PopupAddExpence"

function Moneyshowsection() {
  const [addIncome, setAddIncome] = useState(false);
  const [addExpence, setAddExpence] = useState(false);
  
  return (
    <>
      <div className="flex gap-3">
        <MoneyCard titel="Total Balence" totalBal={100} />
        <MoneyCard
          titel="Income Balence"
          totalBal={300}
          bgColor="bg-blue-900"
        />
        <MoneyCard titel="Expence" totalBal={200} bgColor="bg-yellow-900" />
        <div>
          <button
            className="p-3 bg-green-500 m-3 mt-8 rounded-xl"
            onClick={() => setAddIncome(true)}
          >
            Add Income
          </button>
          <button
            className="p-3 bg-red-500 m-3 mt-8 rounded-xl"
            onClick={() => setAddExpence(true)}
          >
            Add Expence
          </button>
        </div>
      </div>
       <div className="p-3 m-2 flex justify-around">
       {addIncome ? <PopupAddIncome setAddIncome={setAddIncome} /> : null}
       {addExpence ? <PopupAddExpence setAddExpence={setAddExpence}/>:null}
       </div>
    </>
  );
}

export default Moneyshowsection;

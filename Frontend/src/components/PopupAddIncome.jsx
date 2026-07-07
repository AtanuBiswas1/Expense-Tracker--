import React from "react";
import AddExpenseForm from "./AddExpenseForm";

function PopupAddIncome({ setAddIncome }) {
  return (
    <AddExpenseForm setAddExpense={setAddIncome} defaultType="income" />
  );
}

export default PopupAddIncome;

import React from "react";
import AddExpenseForm from "./AddExpenseForm";

function PopupAddExpence({ setAddExpense }) {
  return (
    <AddExpenseForm setAddExpense={setAddExpense} defaultType="expense" />
  );
}

export default PopupAddExpence;

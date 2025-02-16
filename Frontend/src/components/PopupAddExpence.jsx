import React from "react";
import { useForm } from "react-hook-form";
import Input from "./Input";
import { addExpenceUrl } from "../constant.API_URL.js";
import { useDispatch } from "react-redux";
import { UpdateExpenseDate } from "../features/apiDate/apiData.Slice.js";

function PopupAddExpence({ setAddExpense }) {
  const { register, handleSubmit } = useForm();
  const dispatch = useDispatch();
  async function submitData(data) {
    const responce = await fetch(addExpenceUrl, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    data ? setAddExpense(false) : null;
    dispatch(UpdateExpenseDate());
  }
  return (
    <div className="shadow-2xl w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3 max-h-[90vh] overflow-y-auto rounded-xl p-6 bg-white transform transition-transform duration-500 ease-in-out hover:scale-105 hover:shadow-3xl">
      <h1 className="text-2xl text-center font-extrabold text-gray-700 mb-6">
        Add Expense
      </h1>
      <form onSubmit={handleSubmit(submitData)} className="space-y-6">
        <Input
          label="Expense Amount:"
          type="number"
          {...register("amount", { required: true })}
          className="w-full border-gray-300 rounded-lg"
        />
        <Input
          label="Category"
          placeholder="e.g., Food, Travel, Shopping"
          {...register("category", { required: true })}
          className="w-full border-gray-300 rounded-lg"
        />
        <Input
          label="Description"
          placeholder="Add details (optional)"
          {...register("description")}
          className="w-full border-gray-300 rounded-lg"
        />
        <Input
          label="Expense Date"
          type="date"
          {...register("date", { required: true })}
          className="w-full border-gray-300 rounded-lg"
        />
        <div className="flex justify-between mt-8">
          <button
            onClick={() => setAddExpense(false)}
            className="px-5 py-3 bg-red-500 text-white rounded-lg shadow-md transition-all duration-300 hover:bg-red-600 hover:shadow-lg transform hover:-translate-y-1"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-3 bg-green-500 text-white rounded-lg shadow-md transition-all duration-300 hover:bg-green-600 hover:shadow-lg transform hover:-translate-y-1"
          >
            Add
          </button>
        </div>
      </form>
    </div>
  );
}

export default PopupAddExpence;

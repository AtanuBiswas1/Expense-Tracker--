import React from "react";
import { useForm } from "react-hook-form";
import Input from "./Input.jsx";
import { addIncomeUrl } from "../constant.API_URL.js";
import { useDispatch } from "react-redux";
import {
  UpdateIncomeData,
} from "../features/apiDate/apiData.Slice.js";

function PopupAddIncome({ setAddIncome }) {
  const { register, handleSubmit } = useForm();
  const dispatch = useDispatch();
  async function submitData(data) {
    try {
      const responce = await fetch(addIncomeUrl, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const responceAfterAddIncome = await responce.json();
      console.log(responceAfterAddIncome);
    } catch (error) {
      console.log(error);
    }
    data ? setAddIncome(false) : null;
    dispatch(UpdateIncomeData())
  }

  
  return (
    // <div className="bg-slate-400 rounded-xl">
    //   <div className="shadow-2xl  w-[100%] rounded-xl p-3 font-bold ">
    //     <h1>Add Money</h1>
    //     <div>
    //       <form onSubmit={handleSubmit(submitData)}>
    //         <Input
    //           label="Total Amount"
    //           type="number"
    //           {...register("amount", { required: true })}
    //         />
    //         <Input
    //           label="Come where"
    //           {...register("category", { required: true })}
    //         />
    //         <div className="text-right">
    //           <button
    //             onClick={() => setAddIncome(false)}
    //             className="p-3 bg-red-500 m-3 mt-8 rounded-xl w-24 font-serif"
    //           >
    //             Cancle
    //           </button>
    //           <button
    //             type="submit"
    //             className="p-3 bg-green-500 m-3 mt-8 rounded-xl w-24 font-serif"
    //           >
    //             Add
    //           </button>
    //         </div>
    //       </form>
    //     </div>
    //   </div>
    // </div>
    <div
  className="shadow-2xl w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3 max-h-[90vh] overflow-y-auto rounded-xl p-6 bg-white transform transition-transform duration-500 ease-in-out hover:scale-105 hover:shadow-3xl"
>
  <h1 className="text-2xl text-center font-extrabold text-gray-700 mb-6">
    Add Income
  </h1>
  <form onSubmit={handleSubmit(submitData)} className="space-y-6">
    <Input
      label="Total Amount:"
      type="number"
      {...register("amount", { required: true })}
      className="w-full border-gray-300 rounded-lg"
    />
    <Input
      label="Income Source:"
      placeholder="e.g., Salary, Freelancing, Business"
      {...register("category", { required: true })}
      className="w-full border-gray-300 rounded-lg"
    />
    <div className="flex justify-between mt-8">
      <button
        onClick={() => setAddIncome(false)}
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

export default PopupAddIncome;

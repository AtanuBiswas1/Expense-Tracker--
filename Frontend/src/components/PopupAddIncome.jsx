import React from "react";
import { useForm } from "react-hook-form";
import Input from "./Input.jsx";
import { addIncomeUrl } from "../constant.API_URL.js";

function PopupAddIncome({ setAddIncome }) {
  const { register, handleSubmit } = useForm();
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
  }

  
  return (
    <div>
      <div className="shadow-2xl  w-[100%] rounded-xl p-3 font-bold ">
        <h1>Add Money</h1>
        <div>
          <form onSubmit={handleSubmit(submitData)}>
            <Input
              label="Total Amount"
              type="number"
              {...register("amount", { required: true })}
            />
            <Input
              label="Come where"
              {...register("category", { required: true })}
            />
            <div className="text-right">
              <button
                onClick={() => setAddIncome(false)}
                className="p-3 bg-red-500 m-3 mt-8 rounded-xl w-24 font-serif"
              >
                Cancle
              </button>
              <button
                type="submit"
                className="p-3 bg-green-500 m-3 mt-8 rounded-xl w-24 font-serif"
              >
                Add
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PopupAddIncome;

import React from "react";
import { useForm } from "react-hook-form";
import Input from "./Input";
import { addExpenceUrl } from "../constant.API_URL.js";
import { useDispatch } from "react-redux";
import {
  UpdateExpenseDate,
} from "../features/apiDate/apiData.Slice.js";

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
    <div>
      <div className=" shadow-2xl  w-[100%] rounded-xl p-3 font-bold bg-white ">
        <h1>Add Money</h1>
        <div>
          <form onSubmit={handleSubmit(submitData)}>
            <Input
              label="Expence Amount : "
              type="number"
              {...register("amount", { required: true })}
            />
            <Input
              label="Category"
              placeholder="Food/ tour / marker / gym / buy other "
              {...register("category", { required: true })}
            />
            <Input
              label="Description"
              placeholder=""
              {...register("description")}
            />
            <Input
              label="Expence Date"
              type="date"
              placeholder=""
              {...register("date", { required: true })}
            />
            <div className="text-right">
              <button
                onClick={() => setAddExpense(false)}
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

export default PopupAddExpence;

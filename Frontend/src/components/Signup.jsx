import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Input from "./Input.jsx";
import { Link } from "react-router-dom";
import {signupFunction} from "../API/apiCall.Function.js";

function Signup() {
  const [responceData, setResponceData] = useState("");
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset } = useForm();
  

  async function submitData(data) {
    setLoading(true);
    // try {
    //   let responce = await fetch(
    //     "http://localhost:8000/api/v1/users/register",
    //     {
    //       method: "POST",
    //       headers: {
    //         "content-Type": "application/json",
    //       },
    //       body: JSON.stringify(data),
    //       credentials: "include", // This ensures cookies are sent and stored
    //     }
    //   );
    //   responce = await responce.json();
    //   setResponceData(responce);
    //   console.log(responceData?.message);
    // } catch (error) {
    //   console.log(error);
    // }
    await signupFunction(data,setResponceData)
    reset();
    setLoading(false);
  }

  return (
    <div className=" flex flex-col items-center justify-center">
      <h1 className="p-4 m-3 text-blue-700 font-extrabold text-[40px]">
        Sign up on Finance Traker
      </h1>
      <h1 className="">{responceData ? responceData.message : ""}</h1>
      <div className="bg-slate-600 p-4 rounded-xl m-3 px-10 py-7 text-white ">
        <form onSubmit={handleSubmit(submitData)}>
          <Input
            label="Full Name: "
            placeholder="Enter your full name"
            {...register("userName", {
              required: true,
            })}
          />
          <Input
            label="Enter your email id : "
            type="email"
            placeholder="Enter your full name"
            {...register("email", {
              required: true,
              validate: {
                matchPatern: (value) =>
                  /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                  "Email address must be a valid address",
              },
            })}
          />
          <Input
            label="Password: "
            type="password"
            placeholder="Enter your password"
            {...register("password", {
              required: true,
            })}
          />
          <button
            type="submit"
            className="w-[200px] rounded-xl p-3 my-2 bg-green-700"
          >
            {!loading ? "Create Account" : "loading......"}
          </button>
        </form>
        <h1>
          Hvae account !!{" "}
          <Link to="/">
            <button className="bg-blue-600 px-2 py-1 rounded-xl">
              login Here
            </button>
          </Link>
        </h1>
      </div>
    </div>
  );
}

export default Signup;

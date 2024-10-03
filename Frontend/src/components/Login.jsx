import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import Input from "./Input";
import { loginUrl } from "../constant.API_URL.js";
import { useDispatch } from "react-redux";
import {
  setUserData,
  checkAuth,
} from "../features/loginuser/loginUser.Slice.js";

function Login() {
  const { register, handleSubmit, reset } = useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loginMessage, setLoginMessage] = useState("");
  const dispatch = useDispatch();

  //................................login functionality...................
  async function loginData(data) {
    setLoading(true);
    try {
      const responce = await fetch(loginUrl, {
        method: "POST",
        credentials: "include", // Send cookies in cross-origin requests
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const responceAfterLogin = await responce.json();
      setLoginMessage(responceAfterLogin.message);
      reset();
      if (responceAfterLogin.success) {
        localStorage.setItem(
          "afterLoginUserDataInLocalStore",
          JSON.stringify(responceAfterLogin)
        );
        dispatch(checkAuth());
      }
    } catch (error) {
      //setError(error)
      console.log("Login Error  ", error);
    }
    setLoading(false);
  }
 

  //..............................................................................

  return (
    <div className=" flex flex-col items-center justify-center ">
      <h1 className="p-4 m-3 text-blue-700 font-extrabold text-[40px]">
        Sign up on Finance Traker
      </h1>
      <h1>{loginMessage}</h1>
      <div className="bg-slate-600 p-4 rounded-xl m-3 px-10 py-7 text-white ">
        <form onSubmit={handleSubmit(loginData)}>
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
            {!loading ? "Login" : "loading....."}
          </button>
        </form>
        <h1>
          Hvae not account !!{" "}
          <Link to="/signup">
            <button className="bg-blue-600 p-3 rounded-xl">Sign up Here</button>
          </Link>
        </h1>
      </div>
    </div>
  );
}

export default Login;

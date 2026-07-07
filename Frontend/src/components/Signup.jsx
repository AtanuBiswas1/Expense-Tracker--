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
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-gradient-to-b from-[#0b0f19] to-[#111827]">
      <div className="w-full max-w-md space-y-8 bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="text-center relative z-10">
          <h2 className="mt-2 text-4xl font-extrabold tracking-tight bg-gradient-to-r from-teal-400 via-emerald-400 to-emerald-500 bg-clip-text text-transparent">
            Join COAB
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Create an account to start tracking your finances
          </p>
        </div>

        {responceData && (
          <div className="bg-teal-500/10 border border-teal-500/30 text-teal-200 text-sm rounded-xl p-3 text-center">
            {responceData.message}
          </div>
        )}

        <form className="mt-8 space-y-6 relative z-10" onSubmit={handleSubmit(submitData)}>
          <div className="space-y-4">
            <Input
              label="Full Name"
              placeholder="Alex Johnson"
              className="!bg-slate-950/60 !text-slate-200 !border-slate-800 focus:!border-teal-500 focus:!ring-1 focus:!ring-teal-500 focus:!bg-slate-950"
              {...register("userName", {
                required: true,
              })}
            />
            <Input
              label="Email Address"
              type="email"
              placeholder="name@example.com"
              className="!bg-slate-950/60 !text-slate-200 !border-slate-800 focus:!border-teal-500 focus:!ring-1 focus:!ring-teal-500 focus:!bg-slate-950"
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
              label="Password"
              type="password"
              placeholder="••••••••"
              className="!bg-slate-950/60 !text-slate-200 !border-slate-800 focus:!border-teal-500 focus:!ring-1 focus:!ring-teal-500 focus:!bg-slate-950"
              {...register("password", {
                required: true,
              })}
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-semibold rounded-xl text-slate-900 bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-500 hover:to-emerald-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-300 shadow-lg shadow-teal-500/10 hover:shadow-teal-500/20 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-slate-900" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Creating Account...</span>
                </div>
              ) : (
                "Create Account"
              )}
            </button>
          </div>
        </form>

        <div className="text-center text-sm text-slate-400 mt-4 relative z-10">
          Already have an account?{" "}
          <Link to="/" className="text-teal-400 hover:text-teal-300 font-medium transition-colors duration-200">
            Log in here
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Signup;

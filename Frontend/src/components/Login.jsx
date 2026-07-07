import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import Input from "./Input";
import { loginFunction } from "../API/apiCall.Function.js";
import { useDispatch } from "react-redux";
import { checkAuth } from "../features/loginuser/loginUser.Slice.js";

function Login() {
  const { register, handleSubmit, reset } = useForm();
  //const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loginMessage, setLoginMessage] = useState("");
  const dispatch = useDispatch();

  async function loginData(data) {
    setLoading(true);
    await loginFunction(data, setLoginMessage);
    dispatch(checkAuth());
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
            Welcome to COAB
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Log in to manage your budget & track your wealth
          </p>
        </div>

        {loginMessage && (
          <div className="bg-red-500/15 border border-red-500/30 text-red-200 text-sm rounded-xl p-3 text-center animate-pulse">
            {loginMessage}
          </div>
        )}

        <form className="mt-8 space-y-6 relative z-10" onSubmit={handleSubmit(loginData)}>
          <div className="space-y-4">
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
                  <span>Processing...</span>
                </div>
              ) : (
                "Log In"
              )}
            </button>
          </div>
        </form>

        <div className="text-center text-sm text-slate-400 mt-4 relative z-10">
          Don't have an account?{" "}
          <Link to="/signup" className="text-teal-400 hover:text-teal-300 font-medium transition-colors duration-200">
            Sign up here
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;

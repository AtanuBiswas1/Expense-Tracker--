import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import Input from "./Input";
import { loginFunction } from "../API/apiCall.Function.js";
import { useDispatch } from "react-redux";
import { checkAuth } from "../features/loginuser/loginUser.Slice.js";

function Login() {
  const { register, handleSubmit, reset, setValue } = useForm();
  const [loading, setLoading] = useState(false);
  const [loginMessage, setLoginMessage] = useState("");
  const dispatch = useDispatch();
  const loginButtonRef = useRef(null);

  const fillDemoCredentials = () => {
    setValue("email", "requiter@gmail.com");
    setValue("password", "1234567890@A");
    if (loginButtonRef.current) {
      loginButtonRef.current.focus();
    }
  };

  async function loginData(data) {
    setLoading(true);
    await loginFunction(data, setLoginMessage);
    dispatch(checkAuth());
    setLoading(false);
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#090d16] to-[#0f172a] text-slate-200 overflow-hidden">
      <div className="w-full max-w-md space-y-3 bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 p-5 rounded-2xl shadow-2xl relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="text-center relative z-10">
          <h2 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-teal-400 via-emerald-400 to-emerald-500 bg-clip-text text-transparent">
            Welcome to COAB
          </h2>
          <p className="mt-0.5 text-[11px] text-slate-400">
            Log in to manage your budget & track your wealth
          </p>
        </div>

        {loginMessage && (
          <div className="bg-red-500/15 border border-red-500/30 text-red-200 text-xs rounded-lg p-2 text-center animate-pulse">
            {loginMessage}
          </div>
        )}

        <form className="mt-2 space-y-3 relative z-10" onSubmit={handleSubmit(loginData)}>
          <div className="space-y-1">
            <Input
              label="Email Address"
              type="email"
              placeholder="name@example.com"
              containerClassName="py-0.5 px-3"
              className="!py-1.5 !px-2.5 !bg-slate-950/60 !text-slate-200 !border-slate-800 focus:!border-teal-500 focus:!ring-1 focus:!ring-teal-500 focus:!bg-slate-950 text-xs"
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
              containerClassName="py-0.5 px-3"
              className="!py-1.5 !px-2.5 !bg-slate-950/60 !text-slate-200 !border-slate-800 focus:!border-teal-500 focus:!ring-1 focus:!ring-teal-500 focus:!bg-slate-950 text-xs"
              {...register("password", {
                required: true,
              })}
            />
          </div>

          <div className="pt-1">
            <button
              ref={loginButtonRef}
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-xs font-semibold rounded-xl text-slate-900 bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-500 hover:to-emerald-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-300 shadow-lg shadow-teal-500/10 hover:shadow-teal-500/20 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading ? (
                <div className="flex items-center gap-1.5 justify-center">
                  <svg className="animate-spin h-4 w-4 text-slate-900" fill="none" viewBox="0 0 24 24">
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

          <div className="text-center pt-0.5">
            <button
              type="button"
              onClick={fillDemoCredentials}
              className="w-full flex justify-center py-2 px-4 border border-teal-500/30 text-[10px] font-semibold rounded-xl text-teal-400 bg-teal-500/5 hover:bg-teal-500/10 focus:outline-none focus:ring-1 focus:ring-teal-500 transition-all duration-300"
            >
              💼 Recruiters: Click here for Quick Demo Access
            </button>
          </div>
        </form>

        <div className="text-center text-xs text-slate-400 mt-2 relative z-10">
          Don't have an account?{" "}
          <Link to="/signup" className="text-teal-400 hover:text-teal-300 font-semibold transition-colors duration-200">
            Sign up here
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;

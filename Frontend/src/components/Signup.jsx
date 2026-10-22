import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Input from "./Input.jsx";
import { Link } from "react-router-dom";
import { signupFunction } from "../API/apiCall.Function.js";
import { Sun, Moon } from "lucide-react";

function Signup() {
  const [responceData, setResponceData] = useState("");
  const [loading, setLoading] = useState(false);
  const [isThemeDark, setIsThemeDark] = useState(true);
  const { register, handleSubmit, reset } = useForm();

  // Sync theme with localStorage & html class
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const isDark = savedTheme !== "light";
    setIsThemeDark(isDark);
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const htmlElement = document.documentElement;
    if (htmlElement.classList.contains("dark")) {
      htmlElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsThemeDark(false);
      window.dispatchEvent(new CustomEvent("theme-change", { detail: "light" }));
    } else {
      htmlElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsThemeDark(true);
      window.dispatchEvent(new CustomEvent("theme-change", { detail: "dark" }));
    }
  };

  async function submitData(data) {
    setLoading(true);
    await signupFunction(data, setResponceData);
    reset();
    setLoading(false);
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-8 bg-slate-50 dark:bg-black text-slate-900 dark:text-zinc-100 transition-colors duration-300 relative overflow-hidden">
      {/* Background ambient accents */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-slate-200/50 dark:bg-zinc-900/40 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-slate-200/50 dark:bg-zinc-900/40 rounded-full blur-3xl pointer-events-none"></div>

      {/* Theme toggle in top corner */}
      <button
        onClick={toggleTheme}
        className="absolute top-6 right-6 p-2.5 rounded-2xl bg-white dark:bg-[#0c0c0e] border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-400 hover:text-black dark:hover:text-white shadow-sm hover:shadow transition-all duration-200 active:scale-90 z-20"
        title={isThemeDark ? "Switch to Light Mode (Click Black)" : "Switch to Deep Black Mode"}
      >
        {isThemeDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-900" />}
      </button>

      {/* Main Signup Card */}
      <div className="w-full max-w-md space-y-4 bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-zinc-800/80 p-6 sm:p-7 rounded-3xl shadow-xl dark:shadow-2xl relative z-10 transition-colors duration-300">
        
        {/* Brand Icon & Heading */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-11 w-11 rounded-2xl bg-black dark:bg-[#121214] border border-black/10 dark:border-zinc-800 items-center justify-center shadow-lg shadow-black/10 dark:shadow-none mb-1">
            <svg className="w-6 h-6 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.4" d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              <circle cx="12" cy="12" r="9" strokeWidth="1.8" stroke="currentColor" opacity="0.25" />
            </svg>
          </div>
          <div className="flex items-center justify-center gap-2">
            <h2 className="text-2xl font-black tracking-tight text-black dark:text-white">
              Join COAB
            </h2>
            <span className="text-[9px] font-extrabold uppercase tracking-widest px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              EXPENSE
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-zinc-400">
            Create an account to start tracking your finances
          </p>
        </div>

        {responceData && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs rounded-xl p-2.5 text-center font-medium">
            {responceData.message}
          </div>
        )}

        <form className="space-y-3" onSubmit={handleSubmit(submitData)}>
          <div className="space-y-1">
            <Input
              label="Full Name"
              placeholder="Alex Johnson"
              containerClassName="py-0.5"
              className="!py-2 !px-3 !bg-slate-50 dark:!bg-[#050505] !text-black dark:!text-white !border-slate-200 dark:!border-zinc-800 focus:!border-black dark:focus:!border-zinc-600 focus:!bg-white dark:focus:!bg-black text-xs rounded-xl transition-all"
              {...register("userName", {
                required: true,
              })}
            />
            <Input
              label="Email Address"
              type="email"
              placeholder="name@example.com"
              containerClassName="py-0.5"
              className="!py-2 !px-3 !bg-slate-50 dark:!bg-[#050505] !text-black dark:!text-white !border-slate-200 dark:!border-zinc-800 focus:!border-black dark:focus:!border-zinc-600 focus:!bg-white dark:focus:!bg-black text-xs rounded-xl transition-all"
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
              containerClassName="py-0.5"
              className="!py-2 !px-3 !bg-slate-50 dark:!bg-[#050505] !text-black dark:!text-white !border-slate-200 dark:!border-zinc-800 focus:!border-black dark:focus:!border-zinc-600 focus:!bg-white dark:focus:!bg-black text-xs rounded-xl transition-all"
              {...register("password", {
                required: true,
              })}
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2.5 px-4 text-xs font-bold rounded-xl text-white bg-black hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 shadow-md shadow-black/15 transition-all duration-200 transform active:scale-98 disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading ? (
                <div className="flex items-center gap-2 justify-center">
                  <svg className="animate-spin h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
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

        <div className="text-center text-xs text-slate-500 dark:text-zinc-400 pt-2 border-t border-slate-100 dark:border-zinc-800/80">
          Already have an account?{" "}
          <Link to="/" className="text-black dark:text-white font-bold hover:underline transition-all">
            Log in here
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Signup;

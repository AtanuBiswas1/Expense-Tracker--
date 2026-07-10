import React, { useState } from "react";
import { useId } from "react";
import { Eye, EyeOff } from "lucide-react";

const Input = React.forwardRef(function Input({ label, type = "text", className = "", containerClassName = "p-3", ...Props }, ref) {
  const id = useId();
  const [showPassword, setShowPassword] = useState(false);
  
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className={containerClassName}>
      {label && (
        <label className="inline-block mb-1 pl-1" htmlFor={id}>
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type={inputType}
          className={`px-3 py-2 rounded-lg bg-white text-black outline-none
          focus:bg-gray-50 duration-200 border border-gray-200 w-full pr-10
          ${className}`}
          ref={ref}
          {...Props}
          id={id}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition focus:outline-none"
            tabIndex="-1"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
    </div>
  );
})

export default Input;

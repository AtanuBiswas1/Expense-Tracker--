import React from "react";

function MoneyCard({ totalBal = 0, titel }) {
  const currentData = {
    month: String(new Date().getMonth() + 1).padStart(2, "0"),
    year: new Date().getFullYear(),
    date: String(new Date().getDate()).padStart(2, "0"),
  };
  const currTime = {
    hour: String(new Date().getHours()).padStart(2, "0"),
    min: String(new Date().getMinutes()).padStart(2, "0"),
  };

  // Determine styles and icons based on card title
  let cardStyles = "from-white to-slate-50/50 border-slate-200 text-slate-800 hover:shadow-slate-200/50 hover:border-slate-350";
  let icon = null;
  let textGrad = "text-slate-900";

  if (titel.toLowerCase().includes("total balance")) {
    cardStyles = "from-teal-50/60 to-emerald-50/60 border-teal-200 hover:border-teal-350 text-slate-800 hover:shadow-teal-100/50";
    textGrad = "bg-gradient-to-r from-teal-650 to-emerald-650 bg-clip-text text-transparent";
    icon = (
      <div className="p-2.5 rounded-lg bg-teal-100 text-teal-600">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      </div>
    );
  } else if (titel.toLowerCase().includes("income")) {
    cardStyles = "from-blue-50/60 to-indigo-50/60 border-blue-200 hover:border-blue-350 text-slate-800 hover:shadow-blue-100/50";
    textGrad = "bg-gradient-to-r from-blue-650 to-indigo-650 bg-clip-text text-transparent";
    icon = (
      <div className="p-2.5 rounded-lg bg-blue-100 text-blue-600">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      </div>
    );
  } else if (titel.toLowerCase().includes("expense")) {
    cardStyles = "from-rose-50/60 to-orange-50/60 border-rose-200 hover:border-rose-350 text-slate-800 hover:shadow-rose-100/50";
    textGrad = "bg-gradient-to-r from-rose-650 to-orange-650 bg-clip-text text-transparent";
    icon = (
      <div className="p-2.5 rounded-lg bg-rose-100 text-rose-600">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" />
        </svg>
      </div>
    );
  }

  return (
    <div
      className={`w-full sm:w-[30%] lg:w-[28%] bg-gradient-to-br border backdrop-blur-xl rounded-2xl p-6 my-3 mx-3 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${cardStyles}`}
    >
      <div className="flex items-center justify-between">
        <span className="font-semibold text-sm tracking-wide text-slate-500 uppercase">{titel}</span>
        {icon}
      </div>
      
      <div className="mt-4">
        <span className={`text-3xl font-extrabold tracking-tight ${textGrad}`}>
          ${totalBal.toLocaleString()}
        </span>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500">
        <span>As of today</span>
        <span className="font-medium text-slate-650">{`${currentData.date}/${currentData.month}/${currentData.year} @ ${currTime.hour}:${currTime.min}`}</span>
      </div>
    </div>
  );
}

export default MoneyCard;

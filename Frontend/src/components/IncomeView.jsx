import React, { useState, useEffect } from "react";
import { format, subDays } from "date-fns";
import { ArrowUpRight, TrendingUp, DollarSign, Award, Briefcase, Laptop, CreditCard } from "lucide-react";
import { InitialTransactions, IncomeCategories } from "../utils/MockData";
import { Line, Bar } from "react-chartjs-2";
import { IncomeApiCall } from "../API/apiCall.Function.js";

function IncomeView() {
  const [incomes, setIncomes] = useState([]);
  const [currencySymbol, setCurrencySymbol] = useState("₹");
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      let dbIncomes = [];
      let offlineIncomes = [];

      try {
        offlineIncomes = JSON.parse(localStorage.getItem("offline_incomes") || "[]");
      } catch (e) {}

      try {
        const res = await IncomeApiCall("", "", "");
        if (res && res.data?.Income) {
          dbIncomes = res.data.Income;
        }
      } catch (e) {
        console.error(e);
      }
      
      const normalizedIncomes = [...dbIncomes, ...offlineIncomes].map(i => ({
        id: i._id || i.id,
        title: i.category || "Income Source",
        amount: Number(i.amount),
        category: i.category,
        type: "income",
        date: i.createdAt ? i.createdAt.split("T")[0] : new Date().toISOString().split("T")[0],
        merchant: i.merchant || "Deposit",
        paymentMethod: i.paymentMethod || "UPI",
        wallet: i.wallet || "wallet_upi",
        tags: i.tags || [],
        status: "completed"
      }));

      const combined = [...normalizedIncomes];
      
      // De-duplicate
      const uniqueMap = {};
      combined.forEach(t => {
        const key = `${t.date}-${t.amount}-${t.category}-${t.description || t.title}`;
        if (!uniqueMap[key]) {
          uniqueMap[key] = t;
        }
      });
      setIncomes(Object.values(uniqueMap).sort((a, b) => b.date.localeCompare(a.date)));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    window.addEventListener("local-data-update", loadData);
    const handleCurrency = (e) => {
      const symbols = { INR: "₹", USD: "$", EUR: "€", GBP: "£" };
      setCurrencySymbol(symbols[e.detail] || "₹");
    };
    window.addEventListener("currency-change", handleCurrency);
    return () => {
      window.removeEventListener("local-data-update", loadData);
      window.removeEventListener("currency-change", handleCurrency);
    };
  }, []);

  const totalIncome = incomes.reduce((acc, t) => acc + t.amount, 0);

  // Group by category
  const categoryTotals = IncomeCategories.map(cat => {
    const total = incomes.filter(t => t.category === cat.id).reduce((acc, t) => acc + t.amount, 0);
    return { ...cat, total };
  }).filter(c => c.total > 0).sort((a, b) => b.total - a.total);

  const getCatIcon = (iconName) => {
    switch (iconName) {
      case "Briefcase": return <Briefcase className="w-4 h-4 text-emerald-500" />;
      case "Laptop": return <Laptop className="w-4 h-4 text-indigo-500" />;
      case "BarChart2": return <TrendingUp className="w-4 h-4 text-amber-500" />;
      case "Award": return <Award className="w-4 h-4 text-pink-500" />;
      default: return <DollarSign className="w-4 h-4 text-sky-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        {/* Skeleton Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="flex justify-between items-start">
                <div className="h-3 w-28 bg-slate-200 dark:bg-slate-850 rounded-full"></div>
                <div className="w-7 h-7 bg-slate-100 dark:bg-slate-800 rounded-lg"></div>
              </div>
              <div className="h-6 w-24 bg-slate-300 dark:bg-slate-700 rounded-full"></div>
              <div className="h-2 w-36 bg-slate-200 dark:bg-slate-850 rounded-full"></div>
            </div>
          ))}
        </div>

        {/* Skeleton content layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 h-80 space-y-4">
            <div className="h-4 w-40 bg-slate-300 dark:bg-slate-700 rounded-full"></div>
            <div className="h-48 w-full bg-slate-150 dark:bg-slate-950 rounded-2xl flex items-end p-4 gap-2">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex-1 bg-slate-200 dark:bg-slate-800 rounded-t" style={{ height: `${30 + Math.random() * 50}%` }}></div>
              ))}
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 h-80 space-y-4">
            <div className="h-4 w-32 bg-slate-300 dark:bg-slate-700 rounded-full"></div>
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex justify-between items-center py-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-800"></div>
                    <div className="h-3 w-16 bg-slate-350 dark:bg-slate-700 rounded-full"></div>
                  </div>
                  <div className="h-3 w-12 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 group transition hover:shadow-lg">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Cumulative Income</span>
            <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">{currencySymbol}{totalIncome.toLocaleString()}</h3>
          <p className="text-[10px] text-slate-400 mt-1">Total revenue logged on client profile</p>
        </div>

        {/* Highest Income Category */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 group transition hover:shadow-lg">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Top Source</span>
            <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-slate-850 dark:text-slate-150">
            {categoryTotals.length > 0 ? categoryTotals[0].name : "None logged"}
          </h3>
          <p className="text-[10px] text-slate-400 mt-1">
            {categoryTotals.length > 0 ? `${currencySymbol}${categoryTotals[0].total.toLocaleString()} total logged` : "No deposits"}
          </p>
        </div>

        {/* Income Sources Count */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 group transition hover:shadow-lg">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Channels</span>
            <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">{categoryTotals.length} Sources</h3>
          <p className="text-[10px] text-slate-400 mt-1">Diversified income channels</p>
        </div>
      </div>

      {/* Main Analysis and logs grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Income Category Share */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
          <span className="text-sm font-bold text-slate-700 dark:text-slate-350 block">Income Share by Stream</span>
          <div className="space-y-4">
            {categoryTotals.map(c => {
              const pct = ((c.total / totalIncome) * 100) || 0;
              return (
                <div key={c.id} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2 font-semibold">
                      {getCatIcon(c.icon)}
                      <span className="text-slate-750 dark:text-slate-400">{c.name}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-bold text-slate-850 dark:text-slate-200">{currencySymbol}{c.total.toLocaleString()}</span>
                      <span className="text-slate-400">({pct.toFixed(0)}%)</span>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-slate-50 dark:bg-slate-950 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full transition-all duration-300" style={{ width: `${pct}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Income Log */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
          <span className="text-sm font-bold text-slate-700 dark:text-slate-350 block">Recent Deposits</span>
          <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1">
            {incomes.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-10">No income receipts logged.</p>
            ) : (
              incomes.map(item => (
                <div key={item.id || item._id} className="flex justify-between items-center text-xs pb-3 border-b border-slate-100 dark:border-slate-850">
                  <div className="space-y-0.5">
                    <p className="font-semibold text-slate-800 dark:text-slate-200">{item.description}</p>
                    <p className="text-[10px] text-slate-400">{item.merchant || "General Client"} • {format(new Date(item.date), "dd MMM yyyy")}</p>
                  </div>
                  <span className="font-extrabold text-emerald-500 text-sm">+{currencySymbol}{item.amount.toLocaleString()}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

    </div>
  );
}

export default IncomeView;

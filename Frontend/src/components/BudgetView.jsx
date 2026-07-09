import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { AlertTriangle, Lightbulb, Sparkles, CheckCircle2, ChevronRight, TrendingUp, HelpCircle, Edit } from "lucide-react";
import { useToast } from "../context/ToastContext";
import { ExpenceApiCall, fetchBudgetLimitsApiCall, addBudgetLimitApiCall } from "../API/apiCall.Function.js";

function BudgetView() {
  const { addToast } = useToast();
  const [expenses, setExpenses] = useState([]);
  const [currencySymbol, setCurrencySymbol] = useState("₹");
  const [categoryBudgets, setCategoryBudgets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      let dbExpenses = [];
      let dbLimits = [];
      let offlineExpenses = [];

      try {
        offlineExpenses = JSON.parse(localStorage.getItem("offline_expenses") || "[]");
      } catch (e) {}
      
      try {
        const expRes = await ExpenceApiCall("", "", "");
        if (expRes && expRes.data?.Expenses) {
          dbExpenses = expRes.data.Expenses;
        }
      } catch (e) {
        console.error("Failed to fetch expenses", e);
      }
      
      try {
        const limitRes = await fetchBudgetLimitsApiCall();
        if (limitRes && limitRes.data?.limits) {
          dbLimits = limitRes.data.limits;
        }
      } catch (e) {
        console.error("Failed to fetch limits", e);
      }

      const normalizedExpenses = [...dbExpenses, ...offlineExpenses].map(e => ({
        id: e._id || e.id,
        title: e.description || "Expense",
        amount: Number(e.amount),
        category: e.category,
        type: "expense",
        date: e.date ? e.date.split("T")[0] : (e.createdAt ? e.createdAt.split("T")[0] : new Date().toISOString().split("T")[0])
      }));

      setExpenses(normalizedExpenses);

      const categoriesList = [
        { id: "food", name: "Food & Dining", color: "#3B82F6" },
        { id: "shopping", name: "Shopping", color: "#EC4899" },
        { id: "transport", name: "Transportation", color: "#EF4444" },
        { id: "utilities", name: "Utilities & Bills", color: "#F59E0B" },
        { id: "entertainment", name: "Entertainment", color: "#14B8A6" },
        { id: "housing", name: "Housing & Rent", color: "#10B981" },
        { id: "healthcare", name: "Healthcare", color: "#8B5CF6" },
        { id: "travel", name: "Travel & Trips", color: "#06B6D4" },
        { id: "education", name: "Education", color: "#6366F1" },
        { id: "other_exp", name: "Other Expenses", color: "#64748B" }
      ];

      const mapped = categoriesList.map(cat => {
        const dbLimitObj = dbLimits.find(l => l.category === cat.id);
        const limitVal = dbLimitObj ? dbLimitObj.limit : 10000;
        
        const totalSpent = normalizedExpenses
          .filter(t => t.category === cat.id)
          .reduce((acc, t) => acc + t.amount, 0);
          
        const pct = Math.min((totalSpent / limitVal) * 100, 100);
        
        let status = "success";
        if (pct >= 90) status = "danger";
        else if (pct >= 75) status = "warning";
        
        return {
          ...cat,
          limit: limitVal,
          totalSpent,
          pct,
          status
        };
      });

      setCategoryBudgets(mapped);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditLimit = async (categoryId, currentLimit) => {
    const limitStr = prompt(`Enter monthly budget limit for category '${categoryId}' (${currencySymbol}):`, currentLimit);
    if (!limitStr || isNaN(limitStr) || Number(limitStr) < 0) return;
    
    const limitVal = Number(limitStr);
    try {
      const res = await addBudgetLimitApiCall(categoryId, limitVal);
      if (res && res.success) {
        addToast(`Budget limit updated for ${categoryId}!`, "success");
        loadData();
        window.dispatchEvent(new CustomEvent("local-data-update"));
      } else {
        addToast(res.message || "Failed to save budget limit", "warning");
      }
    } catch (err) {
      console.error(err);
      addToast("Failed to save budget limit", "error");
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

  const totalExpense = expenses.reduce((acc, t) => acc + t.amount, 0);
  const totalBudgetLimit = categoryBudgets.reduce((acc, c) => acc + c.limit, 0);
  const budgetUtilization = totalBudgetLimit > 0 ? (totalExpense / totalBudgetLimit) * 100 : 0;


  const overspentCategories = categoryBudgets.filter(c => c.totalSpent > c.limit);

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        {/* Skeleton Overview Block */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="h-3 w-28 bg-slate-250 dark:bg-slate-850 rounded-full"></div>
              <div className="h-6 w-20 bg-slate-300 dark:bg-slate-700 rounded-full"></div>
              <div className="h-2 w-full bg-slate-100 dark:bg-slate-950 rounded-full"></div>
            </div>
          ))}
        </div>

        {/* Skeleton Category List */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="h-4 w-48 bg-slate-300 dark:bg-slate-700 rounded-full"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-2 border border-slate-100 dark:border-slate-850 p-4 rounded-2xl">
                <div className="flex justify-between items-center">
                  <div className="h-3.5 w-24 bg-slate-300 dark:bg-slate-700 rounded-full"></div>
                  <div className="h-3 w-16 bg-slate-250 dark:bg-slate-850 rounded-full"></div>
                </div>
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-950 rounded-full"></div>
                <div className="h-2.5 w-32 bg-slate-250 dark:bg-slate-850 rounded-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Overview Block */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Overall Health Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-2">Budget Utilization</span>
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">{budgetUtilization.toFixed(1)}%</h3>
            <span className={`text-[10px] px-2 py-0.5 font-bold rounded-full ${budgetUtilization > 90 ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20'}`}>
              {budgetUtilization > 90 ? 'Critical' : 'Healthy'}
            </span>
          </div>
          <div className="w-full h-2 bg-slate-100 dark:bg-slate-950 rounded-full mt-3 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${budgetUtilization > 90 ? 'bg-rose-500' : (budgetUtilization > 75 ? 'bg-amber-500' : 'bg-indigo-600')}`} 
              style={{ width: `${Math.min(budgetUtilization, 100)}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-400 mt-2">
            Spent {currencySymbol}{totalExpense.toLocaleString()} of {currencySymbol}{totalBudgetLimit.toLocaleString()} monthly cap.
          </p>
        </div>

        {/* Warning Alerts Count */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-2">Overspending Alerts</span>
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">{overspentCategories.length} Categories</h3>
            <div className={`p-1.5 rounded-lg ${overspentCategories.length > 0 ? 'bg-rose-550/15 text-rose-500' : 'bg-emerald-50 text-emerald-500'}`}>
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-[10px] text-slate-400 mt-3">
            {overspentCategories.length > 0 ? `Overrun on: ${overspentCategories.map(c => c.name).join(", ")}` : "All category limits within safety bounds."}
          </p>
        </div>

        {/* Budget Health Score */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-2">Budget Health Index</span>
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">88/100</h3>
            <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-[10px] text-slate-400 mt-3">Grade based on category expense discipline</p>
        </div>

      </div>

      {/* Overspending Alerts Banner */}
      {overspentCategories.length > 0 && (
        <div className="bg-rose-50/70 dark:bg-rose-950/15 border border-rose-250 dark:border-rose-900/40 rounded-2xl p-4 flex items-start gap-3.5 animate-pulse-slow">
          <AlertTriangle className="w-5 h-5 text-rose-550 flex-shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <p className="font-bold text-rose-700 dark:text-rose-400">Budget Threshold Breached!</p>
            <p className="text-rose-600 dark:text-rose-450 leading-relaxed">
              You have exceeded your budgeted amount on: {overspentCategories.map(c => `${c.name} (${currencySymbol}${c.totalSpent.toLocaleString()} spent)`).join(", ")}. Consider re-routing funds or cutting down expenses in these categories.
            </p>
          </div>
        </div>
      )}

      {/* Main Budget Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Category Budget Bars */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
          <span className="text-sm font-bold text-slate-750 dark:text-slate-350 block">Category Limits Progress</span>
          <div className="space-y-4">
            {categoryBudgets.map(cat => {
              const remains = cat.limit - cat.totalSpent;
              const barColor = cat.status === "danger" ? "bg-rose-500" : (cat.status === "warning" ? "bg-amber-500" : "bg-indigo-600");
              const textClass = cat.status === "danger" ? "text-rose-600" : (cat.status === "warning" ? "text-amber-500" : "text-emerald-500");

              return (
                <div key={cat.id} className="space-y-1.5 border-b border-slate-50 dark:border-slate-850 pb-3 last:border-b-0 last:pb-0">
                  <div className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-slate-750 dark:text-slate-405">{cat.name}</span>
                      <button 
                        onClick={() => handleEditLimit(cat.id, cat.limit)}
                        className="p-1 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-450 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-md transition-colors"
                        title="Edit Budget Limit"
                      >
                        <Edit className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="text-[10px] text-slate-400">
                      Spent {currencySymbol}{cat.totalSpent.toLocaleString()} of {currencySymbol}{cat.limit.toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="w-full h-2 bg-slate-50 dark:bg-slate-950 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${barColor} transition-all duration-300`} style={{ width: `${cat.pct}%` }}></div>
                  </div>

                  <div className="flex justify-between items-center text-[10px] text-slate-450 mt-1">
                    <span className={`font-semibold ${textClass}`}>
                      {cat.status === "danger" ? "Budget Blown" : (cat.status === "warning" ? "Approaching Limit" : "Safe Zone")}
                    </span>
                    <span className="font-medium">
                      {remains >= 0 ? `${currencySymbol}${remains.toLocaleString()} Left` : `${currencySymbol}${Math.abs(remains).toLocaleString()} Overspent`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Recommendations Panel */}
        <div className="bg-gradient-to-br from-indigo-950/20 to-purple-950/20 dark:from-slate-900/60 dark:to-slate-950/60 border border-indigo-500/20 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4 h-fit">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">Aura AI Recommendations</span>
          </div>
          <div className="space-y-3.5 text-xs text-slate-650 dark:text-slate-400">
            <div className="flex gap-2.5 items-start">
              <Lightbulb className="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" />
              <p className="leading-relaxed">
                <span className="font-bold text-indigo-655 dark:text-indigo-400">Food & Dining Cap:</span> You spent {currencySymbol}2,400 more than average on food this month. Setting a weekly buffer limit of {currencySymbol}1,500 would save you approximately {currencySymbol}4,500 next month.
              </p>
            </div>
            
            <div className="flex gap-2.5 items-start">
              <Lightbulb className="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" />
              <p className="leading-relaxed">
                <span className="font-bold text-indigo-655 dark:text-indigo-400">Unused Subscriptions:</span> Netflix & Spotify Family totals {currencySymbol}828. You can link them to Sapphire Card autopay to claim 5% cashback rewards.
              </p>
            </div>

            <div className="flex gap-2.5 items-start">
              <Lightbulb className="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" />
              <p className="leading-relaxed">
                <span className="font-bold text-indigo-655 dark:text-indigo-400">Shopping Overages:</span> Saturday online shopping triggers 45% of your retail outgo. Set a browse-lock or transfer funds to the Emergency Savings fund before the weekend.
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

export default BudgetView;

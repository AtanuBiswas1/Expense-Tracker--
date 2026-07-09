import React, { useState, useEffect } from "react";
import { 
  format, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek, 
  isSameMonth, isSameDay, addMonths, subMonths
} from "date-fns";
import { InitialTransactions } from "../utils/MockData";
import { ArrowUpRight, ArrowDownRight, Info, ChevronLeft, ChevronRight, Bell, Zap, Calendar as CalendarIcon } from "lucide-react";
import { ExpenceApiCall, IncomeApiCall } from "../API/apiCall.Function.js";

function CalendarView() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [transactions, setTransactions] = useState([]);
  const [currencySymbol, setCurrencySymbol] = useState("₹");
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      let dbExpenses = [];
      let dbIncomes = [];
      let offlineExpenses = [];
      let offlineIncomes = [];

      try {
        offlineExpenses = JSON.parse(localStorage.getItem("offline_expenses") || "[]");
      } catch (e) {}
      try {
        offlineIncomes = JSON.parse(localStorage.getItem("offline_incomes") || "[]");
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
        const incRes = await IncomeApiCall("", "", "");
        if (incRes && incRes.data?.Income) {
          dbIncomes = incRes.data.Income;
        }
      } catch (e) {
        console.error("Failed to fetch incomes", e);
      }

      const normalizedExpenses = [...dbExpenses, ...offlineExpenses].map(e => ({
        id: e._id || e.id,
        title: e.description || "Expense",
        amount: Number(e.amount),
        category: e.category,
        type: "expense",
        date: e.date ? e.date.split("T")[0] : (e.createdAt ? e.createdAt.split("T")[0] : new Date().toISOString().split("T")[0]),
        merchant: e.merchant || "General",
        paymentMethod: e.paymentMethod || "Cash",
        wallet: e.wallet || "wallet_cash",
        tags: e.tags || [],
        status: "completed"
      }));

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

      const combined = [...normalizedExpenses, ...normalizedIncomes];
      
      // De-duplicate
      const uniqueMap = {};
      combined.forEach(t => {
        const key = `${t.date}-${t.amount}-${t.category}-${t.description || t.title}`;
        if (!uniqueMap[key]) {
          uniqueMap[key] = t;
        }
      });
      setTransactions(Object.values(uniqueMap));
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

  // Calendar dates generation
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const dateInterval = eachDayOfInterval({ start: startDate, end: endDate });

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const subscriptions = transactions.filter(t => 
    t.type === "expense" && 
    (t.category === "utilities" || 
     t.category === "rent" ||
     t.description?.toLowerCase().includes("netflix") || 
     t.description?.toLowerCase().includes("spotify") ||
     t.description?.toLowerCase().includes("youtube") ||
     t.description?.toLowerCase().includes("icloud") ||
     t.description?.toLowerCase().includes("bill") ||
     t.description?.toLowerCase().includes("subscription"))
  ).map(s => ({
    id: s.id,
    title: s.title || s.description || "Recurring Bill",
    amount: s.amount,
    nextBillingDate: s.date,
    status: "active"
  }));

  const selectedDateStr = format(selectedDate, "yyyy-MM-dd");
  const selectedTransactions = transactions.filter(t => t.date === selectedDateStr);

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-3xl p-5 shadow-sm space-y-5 animate-pulse">
        {/* Calendar Header skeleton */}
        <div className="flex justify-between items-center">
          <div className="h-4 w-32 bg-slate-350 dark:bg-slate-700 rounded-full"></div>
          <div className="flex gap-2">
            <div className="h-7 w-12 bg-slate-100 dark:bg-slate-855 rounded-lg"></div>
            <div className="h-7 w-12 bg-slate-100 dark:bg-slate-855 rounded-lg"></div>
          </div>
        </div>

        {/* Calendar Grid skeleton */}
        <div className="grid grid-cols-7 gap-2">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="h-3 bg-slate-200 dark:bg-slate-850 rounded-full w-8 mx-auto"></div>
          ))}
          {[...Array(35)].map((_, i) => (
            <div key={i} className="aspect-square bg-slate-100 dark:bg-slate-950/80 border border-slate-50 dark:border-slate-850 rounded-2xl flex flex-col p-2 space-y-2">
              <div className="h-3 w-4 bg-slate-255 dark:bg-slate-850 rounded"></div>
              <div className="h-2 w-10 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-3xl p-5 shadow-sm space-y-5">
      
      {/* Calendar header controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-2.5">
          <CalendarIcon className="w-5 h-5 text-indigo-500" />
          <h2 className="text-base font-bold text-slate-850 dark:text-slate-100 uppercase tracking-wide">
            {format(currentMonth, "MMMM yyyy")}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={prevMonth} className="p-1.5 border border-slate-250 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-950 rounded-lg text-slate-500">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={nextMonth} className="p-1.5 border border-slate-250 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-950 rounded-lg text-slate-500">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Calendar grid */}
        <div className="lg:col-span-2 space-y-2">
          {/* Weekday headers */}
          <div className="grid grid-cols-7 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest pb-2 border-b border-slate-100 dark:border-slate-850">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>

          {/* Grid Cells */}
          <div className="grid grid-cols-7 gap-1">
            {dateInterval.map((day, idx) => {
              const dayStr = format(day, "yyyy-MM-dd");
              const isSelected = isSameDay(day, selectedDate);
              const isCurrentMonth = isSameMonth(day, currentMonth);

              // Daily tallies
              const dayExpenses = transactions.filter(t => t.type === "expense" && t.date === dayStr).reduce((acc, t) => acc + t.amount, 0);
              const dayIncomes = transactions.filter(t => t.type === "income" && t.date === dayStr).reduce((acc, t) => acc + t.amount, 0);

              // Bills alerts check
              const subscriptionDue = subscriptions.some(s => s.nextBillingDate === dayStr && s.status === "active");

              return (
                <div
                  key={idx}
                  onClick={() => setSelectedDate(day)}
                  className={`h-16 border border-slate-100 dark:border-slate-850/60 rounded-xl p-1.5 flex flex-col justify-between cursor-pointer transition-all duration-200 select-none relative ${
                    isCurrentMonth ? "bg-white dark:bg-slate-900" : "bg-slate-50/50 dark:bg-slate-950/20 opacity-40"
                  } ${isSelected ? "ring-2 ring-indigo-500 border-transparent z-10" : "hover:border-slate-350"}`}
                >
                  {/* Subscription Indicator Dot */}
                  {subscriptionDue && (
                    <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                  )}

                  <span className={`text-[10px] font-bold ${isSelected ? 'text-indigo-500' : 'text-slate-500'}`}>
                    {format(day, "d")}
                  </span>
                  
                  {/* Mini-stats bar inside cells */}
                  <div className="space-y-0.5 text-[8px] font-bold text-right overflow-hidden">
                    {dayIncomes > 0 && (
                      <div className="text-emerald-500">+{currencySymbol}{dayIncomes > 999 ? `${(dayIncomes/1000).toFixed(0)}k` : dayIncomes}</div>
                    )}
                    {dayExpenses > 0 && (
                      <div className="text-rose-500">-{currencySymbol}{dayExpenses > 999 ? `${(dayExpenses/1000).toFixed(0)}k` : dayExpenses}</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected date transactions list panel */}
        <div className="bg-slate-50/50 dark:bg-slate-950/30 border border-slate-200 dark:border-slate-850 rounded-2xl p-4 flex flex-col justify-between min-h-[300px]">
          
          <div className="space-y-4">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-2">
              <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest block">Date Focus</span>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                {format(selectedDate, "dd MMMM yyyy")}
              </h4>
            </div>

            <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
              {selectedTransactions.length === 0 ? (
                <div className="text-center py-10 text-xs text-slate-400">
                  No logged items on this date.
                </div>
              ) : (
                selectedTransactions.map(item => (
                  <div key={item.id} className="flex justify-between items-start text-xs bg-white dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-850">
                    <div>
                      <p className="font-bold text-slate-805 dark:text-slate-300">{item.description}</p>
                      <span className="text-[9px] text-slate-400 block mt-0.5">{item.category} • {item.paymentMethod}</span>
                    </div>
                    <span className={`font-extrabold whitespace-nowrap ${item.type === 'expense' ? 'text-rose-500' : 'text-emerald-500'}`}>
                      {item.type === 'expense' ? '-' : '+'}{currencySymbol}{item.amount}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Subscriptions Alert Panel footer */}
          <div className="border-t border-slate-200 dark:border-slate-800 pt-3 text-[10px] text-slate-400 space-y-1.5">
            <span className="font-semibold text-slate-500 flex items-center gap-1">
              <Bell className="w-3.5 h-3.5 text-amber-500" />
              <span>Upcoming Bills Deadlines</span>
            </span>
            <div className="space-y-1">
              {subscriptions.length === 0 ? (
                <div className="text-[9px] text-slate-400">No recurring billing events found in transaction database.</div>
              ) : (
                subscriptions.slice(0, 2).map(sub => (
                  <div key={sub.id} className="flex justify-between font-medium">
                    <span>{sub.title}</span>
                    <span className="text-slate-500 font-bold">{currencySymbol}{sub.amount} (Due: {sub.nextBillingDate})</span>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

export default CalendarView;

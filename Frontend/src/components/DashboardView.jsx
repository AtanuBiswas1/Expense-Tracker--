import React, { useState, useEffect } from "react";
import { format, subDays, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import {
  Building, CreditCard, DollarSign, Smartphone, ArrowUpRight, ArrowDownRight,
  Percent, TrendingUp, Wallet, ShieldAlert, CheckCircle2, AlertTriangle, Info,
  TrendingDown, Calendar, ShoppingBag, ListCollapse, UserCheck, Flame, PieChart, Activity
} from "lucide-react";
import { InitialTransactions, ExpenseCategories, IncomeCategories, Wallets, FinancialHealthReport } from "../utils/MockData";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import { ExpenceApiCall, IncomeApiCall, fetchBudgetLimitsApiCall } from "../API/apiCall.Function.js";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

// Clean up ChartJS instances on Vite HMR module reload
if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    try {
      Object.values(ChartJS.instances).forEach(c => c.destroy());
    } catch (e) {
      // ignore
    }
  });
}

function DashboardView({ searchFilter = "" }) {
  // Synchronously destroy any existing chart instances bound to our canvas IDs before each render cycle
  const cleanupCharts = () => {
    const chartIds = [
      "monthly-expense-trend-chart",
      "income-vs-expense-chart",
      "category-distribution-chart",
      "weekly-spending-chart",
      "daily-spending-chart",
      "savings-growth-chart",
      "yearly-expense-trend-chart",
      "payment-method-chart",
      "monthly-comparison-chart",
      "cash-flow-trend-chart"
    ];
    chartIds.forEach(id => {
      try {
        const chart = ChartJS.getChart(id);
        if (chart) {
          chart.destroy();
        }
      } catch (e) {
        // ignore
      }
    });
  };

  const [transactions, setTransactions] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [currencySymbol, setCurrencySymbol] = useState("₹");
  const [totalBudgetLimit, setTotalBudgetLimit] = useState(200000);

  // Reload local state
  const loadLocalData = async () => {
    let dbExpenses = [];
    let dbIncomes = [];
    let dbLimits = [];

    try {
      const expRes = await ExpenceApiCall("", "", "");
      if (expRes && expRes.data?.Expenses) {
        dbExpenses = expRes.data.Expenses;
      }
    } catch (e) {
      console.error("Failed to fetch expenses from backend", e);
    }

    try {
      const incRes = await IncomeApiCall("", "", "");
      if (incRes && incRes.data?.Income) {
        dbIncomes = incRes.data.Income;
      }
    } catch (e) {
      console.error("Failed to fetch incomes from backend", e);
    }

    try {
      const limitRes = await fetchBudgetLimitsApiCall();
      if (limitRes && limitRes.data?.limits) {
        dbLimits = limitRes.data.limits;
      }
    } catch (e) {
      console.error("Failed to fetch limits from backend", e);
    }

    const limitSum = dbLimits.reduce((sum, l) => sum + l.limit, 0) || 80000;
    setTotalBudgetLimit(limitSum);

    const normalizedExpenses = dbExpenses.map(e => ({
      id: e._id,
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

    const normalizedIncomes = dbIncomes.map(i => ({
      id: i._id,
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
    // De-duplicate mock items and local updates by date/time
    const uniqueMap = {};
    combined.forEach(t => {
      const key = `${t.date}-${t.amount}-${t.category}-${t.description}`;
      if (!uniqueMap[key]) {
        uniqueMap[key] = t;
      }
    });

    const dedupedList = Object.values(uniqueMap).sort((a, b) => b.date.localeCompare(a.date));
    setTransactions(dedupedList);

    setExpenses(dedupedList.filter(t => t.type === "expense"));
    setIncomes(dedupedList.filter(t => t.type === "income"));
  };

  useEffect(() => {
    loadLocalData();
    window.addEventListener("local-data-update", loadLocalData);

    // Listen for currency change
    const handleCurrency = (e) => {
      const symbols = { INR: "₹", USD: "$", EUR: "€", GBP: "£" };
      setCurrencySymbol(symbols[e.detail] || "₹");
    };
    window.addEventListener("currency-change", handleCurrency);

    return () => {
      window.removeEventListener("local-data-update", loadLocalData);
      window.removeEventListener("currency-change", handleCurrency);
      cleanupCharts();
    };
  }, []);

  // Filter transactions based on search
  const filteredTransactions = transactions.filter(t => {
    if (!searchFilter) return true;
    const query = searchFilter.toLowerCase();
    return (
      t.description?.toLowerCase().includes(query) ||
      t.merchant?.toLowerCase().includes(query) ||
      t.category?.toLowerCase().includes(query) ||
      t.paymentMethod?.toLowerCase().includes(query)
    );
  });

  const filteredExpenses = filteredTransactions.filter(t => t.type === "expense");
  const filteredIncomes = filteredTransactions.filter(t => t.type === "income");

  // Sums calculations
  const totalIncome = filteredIncomes.reduce((acc, t) => acc + t.amount, 0);
  const totalExpense = filteredExpenses.reduce((acc, t) => acc + t.amount, 0);
  const totalBalance = totalIncome - totalExpense;

  // Today's expense
  const todayStr = format(new Date(), "yyyy-MM-dd");
  const todayExpense = filteredExpenses.filter(t => t.date === todayStr).reduce((acc, t) => acc + t.amount, 0);

  // Weekly Expense (last 7 days)
  const sevenDaysAgo = format(subDays(new Date(), 7), "yyyy-MM-dd");
  const weeklyExpense = filteredExpenses.filter(t => t.date >= sevenDaysAgo).reduce((acc, t) => acc + t.amount, 0);

  // Monthly Expense (last 30 days)
  const thirtyDaysAgo = format(subDays(new Date(), 30), "yyyy-MM-dd");
  const monthlyExpense = filteredExpenses.filter(t => t.date >= thirtyDaysAgo).reduce((acc, t) => acc + t.amount, 0);

  // Yearly Expense (last 365 days)
  const yearlyExpense = filteredExpenses.filter(t => t.date >= format(subDays(new Date(), 365), "yyyy-MM-dd")).reduce((acc, t) => acc + t.amount, 0);

  const totalSavings = Math.max(totalIncome - totalExpense, 0);
  const remainingBudget = totalBudgetLimit - totalExpense;
  const netWorth = totalBalance;

  // Calculate budget safety rating dynamically
  const budgetSafetyPct = totalBudgetLimit > 0 ? ((remainingBudget / totalBudgetLimit) * 100) : 100;

  // Sparkline SVG Path Generative Helpers
  const generateSparkline = (dataArray) => {
    if (dataArray.length < 2) return "M 0 15 L 100 15";
    const maxVal = Math.max(...dataArray);
    const minVal = Math.min(...dataArray);
    const range = maxVal - minVal || 1;

    return dataArray.map((val, index) => {
      const x = (index / (dataArray.length - 1)) * 90 + 5;
      const y = 30 - ((val - minVal) / range) * 20 - 5;
      return `${index === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    }).join(" ");
  };

  // 1. Group data by last 7 days dynamically
  const getLast7DaysData = (type) => {
    const list = [];
    for (let i = 6; i >= 0; i--) {
      const dateStr = format(subDays(new Date(), i), "yyyy-MM-dd");
      const daySum = transactions
        .filter(t => t.type === type && t.date === dateStr)
        .reduce((sum, t) => sum + t.amount, 0);
      list.push(daySum);
    }
    return list;
  };

  const getBalanceSparkline = () => {
    const list = [];
    for (let i = 6; i >= 0; i--) {
      const dateStr = format(subDays(new Date(), i), "yyyy-MM-dd");
      const dayIncome = transactions
        .filter(t => t.type === "income" && t.date <= dateStr)
        .reduce((sum, t) => sum + t.amount, 0);
      const dayExpense = transactions
        .filter(t => t.type === "expense" && t.date <= dateStr)
        .reduce((sum, t) => sum + t.amount, 0);
      list.push(dayIncome - dayExpense);
    }
    return list;
  };

  const getRemainingBudgetSparkline = () => {
    const list = [];
    for (let i = 6; i >= 0; i--) {
      const dateStr = format(subDays(new Date(), i), "yyyy-MM-dd");
      const dayExpenseSoFar = transactions
        .filter(t => t.type === "expense" && t.date <= dateStr)
        .reduce((sum, t) => sum + t.amount, 0);
      list.push(Math.max(totalBudgetLimit - dayExpenseSoFar, 0));
    }
    return list;
  };

  const getSavingsSparkline = () => {
    const list = [];
    for (let i = 6; i >= 0; i--) {
      const dateStr = format(subDays(new Date(), i), "yyyy-MM-dd");
      const dayIncomeSoFar = transactions
        .filter(t => t.type === "income" && t.date <= dateStr)
        .reduce((sum, t) => sum + t.amount, 0);
      const dayExpenseSoFar = transactions
        .filter(t => t.type === "expense" && t.date <= dateStr)
        .reduce((sum, t) => sum + t.amount, 0);
      list.push(Math.max(dayIncomeSoFar - dayExpenseSoFar, 0));
    }
    return list;
  };

  // Sparkline arrays
  const balanceSparkline = getBalanceSparkline();
  const incomeSparkline = getLast7DaysData("income");
  const expenseSparkline = getLast7DaysData("expense");
  const todaySparkline = [0, 0, 0, 0, 0, 0, todayExpense];
  const weeklySparkline = getLast7DaysData("expense");
  const monthlySparkline = [0, 0, 0, 0, 0, 0, monthlyExpense];
  const yearlySparkline = [0, 0, 0, 0, 0, 0, yearlyExpense];
  const savingsSparkline = getSavingsSparkline();
  const budgetSparkline = getRemainingBudgetSparkline();
  const netWorthSparkline = balanceSparkline;

  // 2. Weekly Spending Chart (last 4 weeks)
  const getWeeklySpendingData = () => {
    const data = [];
    for (let i = 3; i >= 0; i--) {
      const start = format(subDays(new Date(), (i + 1) * 7 - 1), "yyyy-MM-dd");
      const end = format(subDays(new Date(), i * 7), "yyyy-MM-dd");
      const weekSum = filteredExpenses
        .filter(t => t.date >= start && t.date <= end)
        .reduce((sum, t) => sum + t.amount, 0);
      data.push(weekSum);
    }
    return data;
  };
  const weeklySpendingData = getWeeklySpendingData();

  // 3. Savings Growth Chart (last 6 months cumulative)
  const getSavingsGrowthData = () => {
    const labels = [];
    const data = [];
    let runningSavings = 0;

    for (let i = 5; i >= 0; i--) {
      const date = subDays(new Date(), i * 30);
      const mLabel = format(date, "MMM");
      labels.push(mLabel);

      const start = format(startOfMonth(date), "yyyy-MM-dd");
      const end = format(endOfMonth(date), "yyyy-MM-dd");

      const mIncome = filteredIncomes
        .filter(t => t.date >= start && t.date <= end)
        .reduce((sum, t) => sum + t.amount, 0);

      const mExpense = filteredExpenses
        .filter(t => t.date >= start && t.date <= end)
        .reduce((sum, t) => sum + t.amount, 0);

      runningSavings += (mIncome - mExpense);
      data.push(runningSavings > 0 ? runningSavings : 0);
    }
    return { labels, data };
  };
  const savingsGrowth = getSavingsGrowthData();

  // 4. Yearly Spending Chart (last 5 years)
  const getYearlySpendingData = () => {
    const labels = [];
    const data = [];
    const currentYear = new Date().getFullYear();
    for (let i = 4; i >= 0; i--) {
      const yr = currentYear - i;
      labels.push(yr.toString());
      const yrStart = `${yr}-01-01`;
      const yrEnd = `${yr}-12-31`;
      const yrSum = filteredExpenses
        .filter(t => t.date >= yrStart && t.date <= yrEnd)
        .reduce((sum, t) => sum + t.amount, 0);
      data.push(yrSum);
    }
    return { labels, data };
  };
  const yearlySpending = getYearlySpendingData();

  // 5. Monthly Comparison Chart (last 3 months)
  const getMonthlyComparisonData = () => {
    const labels = [];
    const incomesData = [];
    const expensesData = [];

    for (let i = 2; i >= 0; i--) {
      const date = subDays(new Date(), i * 30);
      const mLabel = format(date, "MMM");
      labels.push(mLabel);

      const start = format(startOfMonth(date), "yyyy-MM-dd");
      const end = format(endOfMonth(date), "yyyy-MM-dd");

      const mIncome = filteredIncomes
        .filter(t => t.date >= start && t.date <= end)
        .reduce((sum, t) => sum + t.amount, 0);

      const mExpense = filteredExpenses
        .filter(t => t.date >= start && t.date <= end)
        .reduce((sum, t) => sum + t.amount, 0);

      incomesData.push(mIncome);
      expensesData.push(mExpense);
    }
    return { labels, incomesData, expensesData };
  };
  const monthlyComparison = getMonthlyComparisonData();

  // Git Heatmap Generative helper
  const renderGitHeatmap = () => {
    const days = 28;
    const cells = [];
    const today = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = subDays(today, i);
      const dateStr = format(date, "yyyy-MM-dd");
      const dayExpense = filteredExpenses.filter(t => t.date === dateStr).reduce((acc, t) => acc + t.amount, 0);

      let colorClass = "bg-slate-100 dark:bg-slate-800/60";
      if (dayExpense > 0 && dayExpense < 500) colorClass = "bg-indigo-100 dark:bg-indigo-950/40 text-indigo-400";
      else if (dayExpense >= 500 && dayExpense < 1500) colorClass = "bg-indigo-300 dark:bg-indigo-800/70 text-indigo-200";
      else if (dayExpense >= 1500 && dayExpense < 4000) colorClass = "bg-indigo-500 text-white";
      else if (dayExpense >= 4000) colorClass = "bg-indigo-700 text-white";

      cells.push(
        <div
          key={i}
          className={`h-5 w-5 rounded-[4px] ${colorClass} flex items-center justify-center text-[8px] font-medium cursor-pointer transition-all duration-200 hover:scale-110`}
          title={`${format(date, "dd MMM")}: ${currencySymbol}${dayExpense.toLocaleString()}`}
        >
          {dayExpense > 0 ? format(date, "d") : ""}
        </div>
      );
    }
    return cells;
  };

  // Top spending categories list calculations
  const categoryTotals = ExpenseCategories.map(cat => {
    const total = filteredExpenses.filter(t => t.category === cat.id).reduce((acc, t) => acc + t.amount, 0);
    return { ...cat, total };
  }).filter(c => c.total > 0).sort((a, b) => b.total - a.total);

  // Top merchants calculation
  const merchantMap = {};
  filteredExpenses.forEach(t => {
    if (t.merchant) {
      merchantMap[t.merchant] = (merchantMap[t.merchant] || 0) + t.amount;
    }
  });
  const topMerchants = Object.entries(merchantMap)
    .map(([name, total]) => ({ name, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  const maxMerchantTotal = topMerchants.length > 0 ? topMerchants[0].total : 1;

  // Chart aggregation datasets for Line & Area
  const aggregateByDate = () => {
    const last12Days = Array.from({ length: 12 }, (_, i) => {
      const date = subDays(new Date(), 11 - i);
      const dateStr = format(date, "yyyy-MM-dd");
      const label = format(date, "dd MMM");
      const expAmt = filteredExpenses.filter(t => t.date === dateStr).reduce((acc, t) => acc + t.amount, 0);
      const incAmt = filteredIncomes.filter(t => t.date === dateStr).reduce((acc, t) => acc + t.amount, 0);
      return { label, dateStr, expenses: expAmt, income: incAmt };
    });
    return last12Days;
  };

  const dayAggregated = aggregateByDate();

  // Chart datasets configuration
  const lineChartData = {
    labels: dayAggregated.map(d => d.label),
    datasets: [
      {
        label: "Daily Spend",
        data: dayAggregated.map(d => d.expenses),
        borderColor: "#4F46E5",
        backgroundColor: "rgba(79, 70, 229, 0.05)",
        tension: 0.4,
        fill: true,
        borderWidth: 2,
        pointRadius: 2
      }
    ]
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false }, ticks: { font: { size: 9 }, color: "#94a3b8" } },
      y: { grid: { color: "rgba(148, 163, 184, 0.08)" }, ticks: { font: { size: 9 }, color: "#94a3b8" } }
    }
  };

  const donutChartData = {
    labels: categoryTotals.slice(0, 5).map(c => c.name),
    datasets: [
      {
        data: categoryTotals.slice(0, 5).map(c => c.total),
        backgroundColor: categoryTotals.slice(0, 5).map(c => c.color),
        borderWidth: 0
      }
    ]
  };

  const donutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: "right", labels: { font: { size: 10 }, color: "#94a3b8" } } },
    cutout: "70%"
  };

  return (
    <div className="space-y-6">

      {/* 10 Summary Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">

        {/* Card 1: Total Balance */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5.5 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/5 hover:-translate-y-0.5 group p-2.5">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Total Balance</span>
            <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
              <Wallet className="w-3.5 h-3.5" />
            </div>
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{currencySymbol}{totalBalance.toLocaleString()}</h3>
          <div className="flex items-center gap-1 mt-2 text-[10px] text-emerald-500">
            <ArrowUpRight className="w-3 h-3" />
            <span>+4.2% vs last month</span>
          </div>
          <div className="mt-3.5 h-6">
            <svg className="w-full h-full text-indigo-500 dark:text-indigo-400" viewBox="0 0 100 30" preserveAspectRatio="none">
              <path d={generateSparkline(balanceSparkline)} fill="none" stroke="currentColor" strokeWidth="1.5" className="sparkline-path" />
            </svg>
          </div>
        </div>

        {/* Card 2: Total Income */}
        <div className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5.5 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/5 hover:-translate-y-0.5 group">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Total Income</span>
            <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{currencySymbol}{totalIncome.toLocaleString()}</h3>
          <div className="flex items-center gap-1 mt-2 text-[10px] text-emerald-500">
            <ArrowUpRight className="w-3 h-3" />
            <span>+12.8% this month</span>
          </div>
          <div className="mt-3.5 h-6">
            <svg className="w-full h-full text-emerald-500 dark:text-emerald-400" viewBox="0 0 100 30" preserveAspectRatio="none">
              <path d={generateSparkline(incomeSparkline)} fill="none" stroke="currentColor" strokeWidth="1.5" className="sparkline-path" />
            </svg>
          </div>
        </div>

        {/* Card 3: Total Expense */}
        <div className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5.5 transition-all duration-300 hover:shadow-lg hover:shadow-rose-500/5 hover:-translate-y-0.5 group">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Total Expense</span>
            <div className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-450 group-hover:scale-110 transition-transform">
              <ArrowDownRight className="w-3.5 h-3.5" />
            </div>
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{currencySymbol}{totalExpense.toLocaleString()}</h3>
          <div className="flex items-center gap-1 mt-2 text-[10px] text-rose-500">
            <ArrowDownRight className="w-3 h-3" />
            <span>+8.4% this month</span>
          </div>
          <div className="mt-3.5 h-6">
            <svg className="w-full h-full text-rose-500 dark:text-rose-400" viewBox="0 0 100 30" preserveAspectRatio="none">
              <path d={generateSparkline(expenseSparkline)} fill="none" stroke="currentColor" strokeWidth="1.5" className="sparkline-path" />
            </svg>
          </div>
        </div>

        {/* Card 4: Today's Expense */}
        <div className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5.5 transition-all duration-300 hover:shadow-lg hover:shadow-rose-500/5 hover:-translate-y-0.5 group">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Today's Expense</span>
            <div className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-455 group-hover:scale-110 transition-transform">
              <Flame className="w-3.5 h-3.5" />
            </div>
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{currencySymbol}{todayExpense.toLocaleString()}</h3>
          <div className="flex items-center gap-1 mt-2 text-[10px] text-emerald-500">
            <span>Daily cap limit safe</span>
          </div>
          <div className="mt-3.5 h-6">
            <svg className="w-full h-full text-amber-500" viewBox="0 0 100 30" preserveAspectRatio="none">
              <path d={generateSparkline(todaySparkline)} fill="none" stroke="currentColor" strokeWidth="1.5" className="sparkline-path" />
            </svg>
          </div>
        </div>

        {/* Card 5: Weekly Expense */}
        <div className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5.5 transition-all duration-300 hover:shadow-lg hover:shadow-rose-500/5 hover:-translate-y-0.5 group">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Weekly Expense</span>
            <div className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-450 group-hover:scale-110 transition-transform">
              <TrendingDown className="w-3.5 h-3.5" />
            </div>
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{currencySymbol}{weeklyExpense.toLocaleString()}</h3>
          <div className="flex items-center gap-1 mt-2 text-[10px] text-rose-500">
            <ArrowUpRight className="w-3 h-3" />
            <span>+15.2% vs last week</span>
          </div>
          <div className="mt-3.5 h-6">
            <svg className="w-full h-full text-indigo-400" viewBox="0 0 100 30" preserveAspectRatio="none">
              <path d={generateSparkline(weeklySparkline)} fill="none" stroke="currentColor" strokeWidth="1.5" className="sparkline-path" />
            </svg>
          </div>
        </div>

        {/* Card 6: Monthly Expense */}
        <div className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5.5 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 group">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Monthly Expense</span>
            <div className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-450 group-hover:scale-110 transition-transform">
              <Calendar className="w-3.5 h-3.5" />
            </div>
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{currencySymbol}{monthlyExpense.toLocaleString()}</h3>
          <div className="flex items-center gap-1 mt-2 text-[10px] text-emerald-500">
            <span>-2.4% vs target limit</span>
          </div>
          <div className="mt-3.5 h-6">
            <svg className="w-full h-full text-purple-400" viewBox="0 0 100 30" preserveAspectRatio="none">
              <path d={generateSparkline(monthlySparkline)} fill="none" stroke="currentColor" strokeWidth="1.5" className="sparkline-path" />
            </svg>
          </div>
        </div>

        {/* Card 7: Yearly Expense */}
        <div className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5.5 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 group">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Yearly Expense</span>
            <div className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-450 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{currencySymbol}{yearlyExpense.toLocaleString()}</h3>
          <div className="flex items-center gap-1 mt-2 text-[10px] text-emerald-500">
            <span>Annual curve optimal</span>
          </div>
          <div className="mt-3.5 h-6">
            <svg className="w-full h-full text-teal-400" viewBox="0 0 100 30" preserveAspectRatio="none">
              <path d={generateSparkline(yearlySparkline)} fill="none" stroke="currentColor" strokeWidth="1.5" className="sparkline-path" />
            </svg>
          </div>
        </div>

        {/* Card 8: Savings */}
        <div className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5.5 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 group">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Total Savings</span>
            <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
              <Percent className="w-3.5 h-3.5" />
            </div>
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{currencySymbol}{totalSavings.toLocaleString()}</h3>
          <div className="flex items-center gap-1 mt-2 text-[10px] text-emerald-500">
            <ArrowUpRight className="w-3 h-3" />
            <span>+15.2% target rate</span>
          </div>
          <div className="mt-3.5 h-6">
            <svg className="w-full h-full text-emerald-500" viewBox="0 0 100 30" preserveAspectRatio="none">
              <path d={generateSparkline(savingsSparkline)} fill="none" stroke="currentColor" strokeWidth="1.5" className="sparkline-path" />
            </svg>
          </div>
        </div>

        {/* Card 9: Remaining Budget */}
        <div className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5.5 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 group">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Remaining Budget</span>
            <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
              <Activity className="w-3.5 h-3.5" />
            </div>
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{currencySymbol}{remainingBudget.toLocaleString()}</h3>
          <div className="flex items-center gap-1 mt-2 text-[10px] text-emerald-500">
            <span>{budgetSafetyPct.toFixed(1)}% budget safety</span>
          </div>
          <div className="mt-3.5 h-6">
            <svg className="w-full h-full text-indigo-650" viewBox="0 0 100 30" preserveAspectRatio="none">
              <path d={generateSparkline(budgetSparkline)} fill="none" stroke="currentColor" strokeWidth="1.5" className="sparkline-path" />
            </svg>
          </div>
        </div>

        {/* Card 10: Net Worth */}
        <div className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 group">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Net Worth</span>
            <div className="p-1.5 rounded-lg bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{currencySymbol}{netWorth.toLocaleString()}</h3>
          <div className="flex items-center gap-1 mt-2 text-[10px] text-emerald-500">
            <ArrowUpRight className="w-3 h-3" />
            <span>+6.8% portfolio gains</span>
          </div>
          <div className="mt-3.5 h-6">
            <svg className="w-full h-full text-sky-400" viewBox="0 0 100 30" preserveAspectRatio="none">
              <path d={generateSparkline(netWorthSparkline)} fill="none" stroke="currentColor" strokeWidth="1.5" className="sparkline-path" />
            </svg>
          </div>
        </div>

      </div>

      {/* 15 Charts & Component Widgets Layout Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* Widget 1: Monthly Expense Trend */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-3xl p-5 shadow-sm space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-350">1. Monthly Expense Trend</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/50 text-indigo-650 dark:text-indigo-400 font-semibold">Line</span>
          </div>
          <div className="h-44">
            <Line id="monthly-expense-trend-chart" key="monthly-expense-trend-chart" data={lineChartData} options={lineChartOptions} />
          </div>
        </div>

        {/* Widget 2: Income vs Expense Area Chart */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-3xl p-5 shadow-sm space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-350">2. Income vs Expense</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/50 text-emerald-650 dark:text-emerald-450 font-semibold">Area</span>
          </div>
          <div className="h-44">
            <Line
              id="income-vs-expense-chart"
              key="income-vs-expense-chart"
              data={{
                labels: dayAggregated.map(d => d.label),
                datasets: [
                  {
                    label: "Income",
                    data: dayAggregated.map(d => d.income),
                    borderColor: "#10B981",
                    backgroundColor: "rgba(16, 185, 129, 0.08)",
                    tension: 0.45,
                    fill: true,
                    borderWidth: 2
                  },
                  {
                    label: "Expense",
                    data: dayAggregated.map(d => d.expenses),
                    borderColor: "#EF4444",
                    backgroundColor: "rgba(239, 68, 68, 0.08)",
                    tension: 0.45,
                    fill: true,
                    borderWidth: 2
                  }
                ]
              }}
              options={lineChartOptions}
            />
          </div>
        </div>

        {/* Widget 3: Expense Category Distribution */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-3xl p-5 shadow-sm space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-350">3. Category Distribution</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/50 text-amber-650 dark:text-amber-400 font-semibold">Donut</span>
          </div>
          <div className="h-44">
            {categoryTotals.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">No data found</div>
            ) : (
              <Doughnut id="category-distribution-chart" key="category-distribution-chart" data={donutChartData} options={donutChartOptions} />
            )}
          </div>
        </div>

        {/* Widget 4: Weekly Spending Bar */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-3xl p-5 shadow-sm space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-350">4. Weekly Spending</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/50 text-indigo-650 dark:text-indigo-400 font-semibold">Bar</span>
          </div>
          <div className="h-44">
            <Bar
              id="weekly-spending-chart"
              key="weekly-spending-chart"
              data={{
                labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
                datasets: [{
                  data: weeklySpendingData,
                  backgroundColor: "#4F46E5",
                  borderRadius: 6
                }]
              }}
              options={lineChartOptions}
            />
          </div>
        </div>

        {/* Widget 5: Daily Spending Line */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-3xl p-5 shadow-sm space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-350">5. Daily Spending</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-950/50 text-purple-650 dark:text-purple-400 font-semibold">Line</span>
          </div>
          <div className="h-44">
            <Line
              id="daily-spending-chart"
              key="daily-spending-chart"
              data={{
                labels: dayAggregated.map(d => d.label),
                datasets: [{
                  label: "Daily",
                  data: dayAggregated.map(d => d.expenses),
                  borderColor: "#8B5CF6",
                  tension: 0.35,
                  borderWidth: 2,
                  pointRadius: 1
                }]
              }}
              options={lineChartOptions}
            />
          </div>
        </div>

        {/* Widget 6: Budget vs Actual Spending Progress Chart */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-3xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-350 block">6. Budget vs Actual</span>
          <div className="space-y-3 flex-1 overflow-y-auto">
            {categoryTotals.slice(0, 4).map(c => {
              const cap = c.limit || 5000;
              const pct = Math.min((c.total / cap) * 100, 100);
              const colorClass = pct > 90 ? "bg-rose-500" : (pct > 75 ? "bg-amber-500" : "bg-emerald-500");
              return (
                <div key={c.id} className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-600 dark:text-slate-400">{c.name}</span>
                    <span className="text-slate-400">{currencySymbol}{c.total.toLocaleString()} / {currencySymbol}{cap.toLocaleString()}</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-950 overflow-hidden">
                    <div className={`h-full ${colorClass} rounded-full transition-all duration-500`} style={{ width: `${pct}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Widget 7: Savings Growth Area Chart */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-3xl p-5 shadow-sm space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-350">7. Savings Growth</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/50 text-emerald-650 dark:text-emerald-450 font-semibold">Area</span>
          </div>
          <div className="h-44">
            <Line
              id="savings-growth-chart"
              key="savings-growth-chart"
              data={{
                labels: savingsGrowth.labels,
                datasets: [{
                  label: "Growth",
                  data: savingsGrowth.data,
                  borderColor: "#10B981",
                  backgroundColor: "rgba(16, 185, 129, 0.06)",
                  fill: true,
                  tension: 0.4
                }]
              }}
              options={lineChartOptions}
            />
          </div>
        </div>

        {/* Widget 8: Yearly Expense Trend Line Graph */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-3xl p-5 shadow-sm space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-350">8. Yearly Expense Trend</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/50 text-indigo-650 dark:text-indigo-400 font-semibold">Line</span>
          </div>
          <div className="h-44">
            <Line
              id="yearly-expense-trend-chart"
              key="yearly-expense-trend-chart"
              data={{
                labels: yearlySpending.labels,
                datasets: [{
                  label: "Yearly Outgo",
                  data: yearlySpending.data,
                  borderColor: "#6366F1",
                  tension: 0.35
                }]
              }}
              options={lineChartOptions}
            />
          </div>
        </div>

        {/* Widget 9: Top Spending Categories (Horizontal Bar) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-3xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-350 block">9. Top Spending Categories</span>
          <div className="space-y-3 flex-1 overflow-y-auto">
            {categoryTotals.slice(0, 4).map(c => {
              const maxVal = categoryTotals.length > 0 ? categoryTotals[0].total : 1;
              const pct = (c.total / maxVal) * 100;
              return (
                <div key={c.id} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-650 dark:text-slate-400">{c.name}</span>
                    <span className="text-slate-800 dark:text-slate-200">{currencySymbol}{c.total.toLocaleString()}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-300" style={{ width: `${pct}%`, backgroundColor: c.color }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Widget 10: Payment Method Distribution Pie Chart */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-3xl p-5 shadow-sm space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-350">10. Payment Method Distribution</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 font-semibold">Pie</span>
          </div>
          <div className="h-44">
            <Doughnut
              id="payment-method-chart"
              key="payment-method-chart"
              data={{
                labels: ["UPI", "Credit Card", "Debit Card", "Cash", "Bank Transfer"],
                datasets: [{
                  data: [
                    filteredExpenses.filter(t => t.paymentMethod === "UPI").length,
                    filteredExpenses.filter(t => t.paymentMethod === "Credit Card").length,
                    filteredExpenses.filter(t => t.paymentMethod === "Debit Card").length,
                    filteredExpenses.filter(t => t.paymentMethod === "Cash").length,
                    filteredExpenses.filter(t => t.paymentMethod === "Bank Transfer").length
                  ],
                  backgroundColor: ["#3B82F6", "#475569", "#EC4899", "#10B981", "#8B5CF6"]
                }]
              }}
              options={{ cutout: "60%", plugins: { legend: { position: "right", labels: { font: { size: 9 }, color: "#94a3b8" } } } }}
            />
          </div>
        </div>

        {/* Widget 11: Monthly Comparison Grouped Bar */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-3xl p-5 shadow-sm space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-350">11. Monthly Comparison</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/50 text-indigo-650 dark:text-indigo-400 font-semibold">Grouped Bar</span>
          </div>
          <div className="h-44">
            <Bar
              id="monthly-comparison-chart"
              key="monthly-comparison-chart"
              data={{
                labels: monthlyComparison.labels,
                datasets: [
                  { label: "Income", data: monthlyComparison.incomesData, backgroundColor: "#10B981", borderRadius: 4 },
                  { label: "Expense", data: monthlyComparison.expensesData, backgroundColor: "#EF4444", borderRadius: 4 }
                ]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                  x: { grid: { display: false }, ticks: { font: { size: 9 }, color: "#94a3b8" } },
                  y: { grid: { color: "rgba(148, 163, 184, 0.08)" }, ticks: { font: { size: 9 }, color: "#94a3b8" } }
                }
              }}
            />
          </div>
        </div>

        {/* Widget 12: Expense Calendar Heatmap */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-3xl p-5 shadow-sm space-y-3.5">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-350 block">12. Spend Heatmap (Last 28 Days)</span>
          <div className="flex flex-wrap gap-1.5 justify-center py-2">
            {renderGitHeatmap()}
          </div>
          <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-850">
            <span>Less Spend</span>
            <div className="flex gap-1">
              <div className="h-2 w-2 rounded-sm bg-slate-100 dark:bg-slate-800"></div>
              <div className="h-2 w-2 rounded-sm bg-indigo-100 dark:bg-indigo-900"></div>
              <div className="h-2 w-2 rounded-sm bg-indigo-300 dark:bg-indigo-700"></div>
              <div className="h-2 w-2 rounded-sm bg-indigo-500"></div>
              <div className="h-2 w-2 rounded-sm bg-indigo-700"></div>
            </div>
            <span>More Spend</span>
          </div>
        </div>

        {/* Widget 13: Expense Timeline */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-3xl p-5 shadow-sm space-y-3.5 flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-350 block">13. Expense Timeline</span>
          <div className="space-y-3.5 flex-1 overflow-y-auto max-h-44 pr-1">
            {filteredExpenses.slice(0, 3).map((item, index) => (
              <div key={item.id} className="relative pl-5 border-l border-slate-200 dark:border-slate-800 text-xs">
                <span className="absolute -left-1.5 top-1.5 h-3 w-3 rounded-full bg-indigo-500 border-2 border-white dark:border-slate-900" />
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-750 dark:text-slate-200">{item.title}</span>
                  <span className="text-rose-500 font-bold">-{currencySymbol}{item.amount}</span>
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                  <span>{item.merchant || "Merchant"} • {item.paymentMethod}</span>
                  <span>{format(new Date(item.date), "dd MMM")}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Widget 14: Top Merchants Horizontal Ranking */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-3xl p-5 shadow-sm space-y-3.5 flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-350 block">14. Top Merchants</span>
          <div className="space-y-3 flex-1 overflow-y-auto pr-1">
            {topMerchants.map((m, idx) => {
              const pct = (m.total / maxMerchantTotal) * 100;
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-650 dark:text-slate-400">{m.name}</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{currencySymbol}{m.total.toLocaleString()}</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-50 dark:bg-slate-950 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" style={{ width: `${pct}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Widget 15: Cash Flow Stacked Area */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-3xl p-5 shadow-sm space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-350">15. Cash Flow Trend</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/50 text-indigo-650 dark:text-indigo-400 font-semibold">Stacked Area</span>
          </div>
          <div className="h-44">
            <Line
              id="cash-flow-trend-chart"
              key="cash-flow-trend-chart"
              data={{
                labels: dayAggregated.map(d => d.label),
                datasets: [{
                  label: "Surplus",
                  data: dayAggregated.map(d => d.income - d.expenses),
                  borderColor: "#4F46E5",
                  backgroundColor: "rgba(79, 70, 229, 0.08)",
                  fill: true,
                  tension: 0.4
                }]
              }}
              options={lineChartOptions}
            />
          </div>
        </div>

      </div>

    </div>
  );
}

export default DashboardView;

import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { FileText, Printer, Download, Sparkles, CheckCircle2, TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { InitialTransactions } from "../utils/MockData";
import { useToast } from "../context/ToastContext";
import { ExpenceApiCall, IncomeApiCall, fetchBudgetLimitsApiCall } from "../API/apiCall.Function.js";

function ReportsView() {
  const { addToast } = useToast();
  const [transactions, setTransactions] = useState([]);
  const [currencySymbol, setCurrencySymbol] = useState("₹");
  const [reportPeriod, setReportPeriod] = useState("current_month");
  const [dbLimits, setDbLimits] = useState([]);

  const loadData = async () => {
    let dbExpenses = [];
    let dbIncomes = [];
    let limitsList = [];
    
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

    try {
      const limitRes = await fetchBudgetLimitsApiCall();
      if (limitRes && limitRes.data?.limits) {
        limitsList = limitRes.data.limits;
      }
    } catch (e) {
      console.error("Failed to fetch limits", e);
    }
    setDbLimits(limitsList);

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
    
    // De-duplicate
    const uniqueMap = {};
    combined.forEach(t => {
      const key = `${t.date}-${t.amount}-${t.category}-${t.description}`;
      if (!uniqueMap[key]) {
        uniqueMap[key] = t;
      }
    });
    setTransactions(Object.values(uniqueMap));
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

  const expenses = transactions.filter(t => t.type === "expense");
  const incomes = transactions.filter(t => t.type === "income");

  const totalExpense = expenses.reduce((acc, t) => acc + t.amount, 0);
  const totalIncome = incomes.reduce((acc, t) => acc + t.amount, 0);
  const netSavings = totalIncome - totalExpense;

  const categoriesList = [
    { id: "food", name: "Food & Dining" },
    { id: "commute", name: "Transportation" },
    { id: "rent", name: "Rent & Bills" },
    { id: "utilities", name: "Utilities" },
    { id: "shopping", name: "Shopping" },
    { id: "medical", name: "Healthcare" },
    { id: "entertainment", name: "Entertainment" },
    { id: "miscellaneous", name: "Other Expenses" }
  ];

  // Category summary tables
  const expenseBreakdown = categoriesList.map(cat => {
    const total = expenses.filter(t => t.category === cat.id).reduce((acc, t) => acc + t.amount, 0);
    const dbLimitObj = dbLimits.find(l => l.category === cat.id);
    const limit = dbLimitObj ? dbLimitObj.limit : 10000;
    return { ...cat, total, limit };
  }).filter(c => c.total > 0).sort((a, b) => b.total - a.total);

  const handlePrint = () => {
    window.print();
  };

  const handleExcelExport = () => {
    let html = `<table><thead><tr><th>Category</th><th>Total Spent (${currencySymbol})</th></tr></thead><tbody>`;
    expenseBreakdown.forEach(e => {
      html += `<tr><td>${e.name}</td><td>${e.total}</td></tr>`;
    });
    html += `</tbody></table>`;
    
    const blob = new Blob([html], { type: "application/vnd.ms-excel" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `COAB_Financial_Report_${format(new Date(), "yyyy-MM-dd")}.xls`;
    a.click();
    addToast("Excel Report exported.", "success");
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm space-y-6 print:border-none print:shadow-none">
      
      {/* Print media page-break formatting style */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body {
            background-color: white !important;
            color: black !important;
          }
          nav, sidebar, button, select, .no-print {
            display: none !important;
          }
          .print-header {
            display: block !important;
            border-bottom: 2px solid #000;
            padding-bottom: 10px;
            margin-bottom: 20px;
          }
          .print-container {
            max-width: 100% !important;
            width: 100% !important;
            padding: 0 !important;
          }
        }
      `}} />

      {/* Report controls toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 no-print">
        <div>
          <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-500" />
            <span>Financial Statements</span>
          </h2>
          <p className="text-xs text-slate-400">Generate, review, and print audits of your monthly account entries.</p>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-750 text-white text-xs font-semibold rounded-xl transition"
          >
            <Printer className="w-4 h-4" />
            <span>Print / PDF</span>
          </button>
          
          <button 
            onClick={handleExcelExport}
            className="flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 dark:border-slate-800 text-slate-650 dark:text-slate-350 text-xs font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-950 transition"
          >
            <Download className="w-4 h-4" />
            <span>Excel sheet</span>
          </button>
        </div>
      </div>

      {/* Print-only layout header */}
      <div className="hidden print-header text-slate-900">
        <h1 className="text-xl font-bold">COAB Account Statement Report</h1>
        <p className="text-xs">Generated on: {format(new Date(), "dd MMMM yyyy, hh:mm a")}</p>
      </div>

      {/* High-level cards audit */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="border border-slate-100 dark:border-slate-800/80 rounded-2xl p-4 flex items-center gap-4 bg-slate-50/50 dark:bg-slate-950/20">
          <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Income Deposited</span>
            <span className="text-base font-bold text-slate-850 dark:text-slate-100">{currencySymbol}{totalIncome.toLocaleString()}</span>
          </div>
        </div>

        <div className="border border-slate-100 dark:border-slate-800/80 rounded-2xl p-4 flex items-center gap-4 bg-slate-50/50 dark:bg-slate-950/20">
          <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600">
            <TrendingDown className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Expenses Logged</span>
            <span className="text-base font-bold text-slate-850 dark:text-slate-100">{currencySymbol}{totalExpense.toLocaleString()}</span>
          </div>
        </div>

        <div className="border border-slate-100 dark:border-slate-800/80 rounded-2xl p-4 flex items-center gap-4 bg-slate-50/50 dark:bg-slate-950/20">
          <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600">
            <Wallet className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Net Savings Margin</span>
            <span className="text-base font-bold text-slate-850 dark:text-slate-100">{currencySymbol}{netSavings.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Detailed breakdown report grids */}
      <div className="space-y-4 pt-2">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 pb-1.5 border-b border-slate-100 dark:border-slate-850">
          Detailed Category Audits
        </h3>

        <div className="w-full overflow-x-auto rounded-2xl border border-slate-100 dark:border-slate-800">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-950 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="py-2.5 px-4">Category</th>
                <th className="py-2.5 px-4 text-right">Total Expense</th>
                <th className="py-2.5 px-4 text-right">Allotment Threshold</th>
                <th className="py-2.5 px-4 text-center">Discipline Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-350">
              {expenseBreakdown.map(e => {
                const pct = (e.total / e.limit) * 100;
                let rating = "Disciplined";
                let ratingColor = "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20";
                
                if (pct >= 100) {
                  rating = "Budget Breached";
                  ratingColor = "text-rose-500 bg-rose-50 dark:bg-rose-950/20";
                } else if (pct >= 80) {
                  rating = "Border Warning";
                  ratingColor = "text-amber-500 bg-amber-50 dark:bg-amber-950/20";
                }

                return (
                  <tr key={e.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20">
                    <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200 capitalize">{e.name}</td>
                    <td className="py-3 px-4 text-right font-bold text-rose-500">{currencySymbol}{e.total.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right font-medium text-slate-400">{currencySymbol}{e.limit.toLocaleString()}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-0.5 text-[9px] rounded-full font-bold uppercase tracking-wide ${ratingColor}`}>
                        {rating}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

export default ReportsView;

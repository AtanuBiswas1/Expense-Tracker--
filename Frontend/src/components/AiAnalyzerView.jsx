import React, { useState, useEffect } from "react";
import { Sparkles, Send, Mic, HelpCircle, Activity, ShieldCheck, Zap, AlertTriangle } from "lucide-react";
import { FinancialHealthReport, InitialTransactions } from "../utils/MockData";
import { useToast } from "../context/ToastContext";
import { aiAnalyzeApiCall } from "../API/apiCall.Function.js";

function AiAnalyzerView() {
  const { addToast } = useToast();
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Hello! I am Aura, your personal AI financial advisor. Ask me anything about your cash flow, savings, or spending patterns!"
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [currencySymbol, setCurrencySymbol] = useState("₹");
  const [healthReport, setHealthReport] = useState({
    score: 84,
    summary: "Retrieving financial diagnostic metrics from backend database...",
    recommendations: [
      "Try to increase your savings rate to 20% by cutting small subscription costs.",
      "Excellent work! You are saving a healthy portion of your earnings. Consider investing the surplus.",
      "Build a 3-6 month emergency fund with your monthly savings buffer."
    ],
    topCategory: "General",
    savingsAlert: ""
  });

  const loadData = async () => {
    let dbExpenses = [];
    let dbIncomes = [];
    
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

  const fetchHealthReport = async () => {
    try {
      const res = await aiAnalyzeApiCall("");
      if (res && res.data) {
        setHealthReport({
          score: res.data.score || 70,
          summary: res.data.summary || "Your overall financial health diagnostic profile.",
          recommendations: res.data.recommendations || [],
          topCategory: res.data.topCategory || "General",
          savingsAlert: res.data.savingsAlert || ""
        });
      }
    } catch (e) {
      console.error("AI diagnostics fetch failed", e);
    }
  };

  useEffect(() => {
    loadData();
    fetchHealthReport();
    window.addEventListener("local-data-update", () => {
      loadData();
      fetchHealthReport();
    });
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

  const totalIncome = transactions.filter(t => t.type === "income").reduce((acc, t) => acc + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === "expense").reduce((acc, t) => acc + t.amount, 0);
  const savingsRate = totalIncome > 0 ? Math.max(((totalIncome - totalExpense) / totalIncome) * 100, 0) : 0;

  const predictions = [
    { type: "Forecast", value: `${currencySymbol}${Math.round(totalExpense * 1.05).toLocaleString()}`, label: "Next month outgo estimate" },
    { type: "Savings rate", value: `${savingsRate.toFixed(1)}%`, label: "Current income saved" },
    { type: "Cash Buffer", value: `${currencySymbol}${Math.round(totalIncome * 0.25).toLocaleString()}`, label: "Estimated emergency fund" },
    { type: "Risk Grade", value: totalExpense > totalIncome ? "High Risk" : (totalExpense > totalIncome * 0.85 ? "Medium Risk" : "Optimized"), label: "Cash flow stability grading" }
  ];

  const handleSendChat = async (text) => {
    const messageText = text || inputText;
    if (!messageText.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { sender: "user", text: messageText }]);
    setInputText("");
    setIsTyping(true);

    try {
      const res = await aiAnalyzeApiCall(messageText);
      let reply = "";
      if (res && res.data?.chatResponse) {
        reply = res.data.chatResponse;
      } else {
        reply = `Hi! I received your query, but could not get a direct reply from the server. Based on local logs, you have spent a total of ${currencySymbol}${totalExpense.toLocaleString()} this cycle.`;
      }
      setMessages(prev => [...prev, { sender: "ai", text: reply }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { sender: "ai", text: "Apologies, I encountered a connection error communicating with the financial analyzer." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const presetQuestions = [
    "How much did I spend on food?",
    "Where am I wasting money?",
    "Compare this month with last month.",
    "How can I save more?",
    "Predict next month's expenses."
  ];

  return (
    <div className="space-y-6">
      
      {/* Top AI health score card */}
      <div className="bg-gradient-to-br from-indigo-900/40 via-purple-950/20 to-slate-900 border border-indigo-500/20 dark:border-slate-800 rounded-3xl p-5 shadow-lg relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Glow */}
        <div className="absolute -top-10 -right-10 w-44 h-44 bg-indigo-550/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="space-y-3.5 max-w-lg">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
            <span className="text-sm font-bold text-slate-200">Aura Smart Diagnostic Report</span>
          </div>
          
          {/* Summary Alert banner if AI triggers warnings */}
          {healthReport.savingsAlert && (
            <div className="flex gap-2 p-3 bg-rose-500/10 border border-rose-500/25 text-rose-200 rounded-2xl text-xs">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{healthReport.savingsAlert}</span>
            </div>
          )}

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
              <span>Risk Status:</span>
              <span className={`font-bold flex items-center gap-1 ${
                healthReport.score >= 75 ? "text-emerald-450" : (healthReport.score >= 50 ? "text-amber-450" : "text-rose-400")
              }`}>
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>
                  {healthReport.score >= 75 ? "Low Risk Level" : (healthReport.score >= 50 ? "Medium Risk Level" : "High Risk Level")}
                </span>
              </span>
            </div>
            <p className="text-xs text-slate-350 leading-relaxed">
              {healthReport.summary}
            </p>
          </div>
        </div>

        {/* Score Dial */}
        <div className="flex-shrink-0 flex flex-col items-center justify-center p-3 relative">
          <div className="relative h-28 w-28 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="56" cy="56" r="48" className="stroke-slate-800" strokeWidth="6" fill="transparent" />
              <circle cx="56" cy="56" r="48" className="stroke-indigo-500" strokeWidth="6" fill="transparent"
                strokeDasharray="301.6" strokeDashoffset={301.6 - (301.6 * healthReport.score) / 100} strokeLinecap="round" />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-2xl font-black text-white">{healthReport.score}</span>
              <span className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">Health Index</span>
            </div>
          </div>
        </div>

      </div>

      {/* Main analyzer blocks split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Insights list */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Insights Grid */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
            <span className="text-xs font-bold text-slate-750 dark:text-slate-350 uppercase tracking-wider block">Diagnostics Audit Recommendations</span>
            
            <div className="space-y-3">
              {healthReport.recommendations.map((rec, idx) => (
                <div key={idx} className="border border-slate-100 dark:border-slate-850 p-3 rounded-2xl flex gap-3.5 items-start bg-slate-50/50 dark:bg-slate-950/10">
                  <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 mt-0.5 shrink-0">
                    <Zap className="w-3.5 h-3.5" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-slate-400 block font-bold">Recommendation #{idx + 1}</span>
                    <p className="text-xs text-slate-750 dark:text-slate-300 leading-relaxed font-medium">{rec}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Predictions Grid */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
            <span className="text-xs font-bold text-slate-750 dark:text-slate-350 uppercase tracking-wider block">Smart ML Predictions</span>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              {predictions.map((p, idx) => (
                <div key={idx} className="border border-slate-100 dark:border-slate-850 p-3 rounded-xl bg-slate-50/50 dark:bg-slate-950/10 space-y-1">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block leading-none">{p.type}</span>
                  <p className="text-sm font-black text-indigo-600 dark:text-indigo-400">{p.value}</p>
                  <span className="text-[8px] text-slate-400 block">{p.label}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Side: AI chat assistant */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4.5 shadow-sm flex flex-col justify-between h-[450px]">
          
          <div className="space-y-4 flex flex-col flex-1">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Aura Advisor Chatbot</span>
            </div>

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 text-xs">
              {messages.map((m, idx) => (
                <div key={idx} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 leading-relaxed shadow-sm ${
                    m.sender === 'user' 
                      ? 'bg-indigo-600 text-white rounded-tr-none' 
                      : 'bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-300 rounded-tl-none border border-slate-200/50 dark:border-slate-850'
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-slate-100 dark:bg-slate-950 rounded-2xl rounded-tl-none px-3.5 py-2.5 text-slate-400 flex gap-1 items-center animate-pulse">
                    <span className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                    <span className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                    <span className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick chips suggestion */}
            <div className="flex gap-1.5 flex-wrap py-1">
              {presetQuestions.slice(0, 3).map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendChat(q)}
                  className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-900 border border-slate-200/80 dark:border-slate-850 text-slate-500 dark:text-slate-400 rounded-full text-[9px] font-semibold transition"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Input box */}
          <div className="flex gap-2 border-t border-slate-100 dark:border-slate-800 pt-3.5">
            <input
              type="text"
              placeholder="Ask Aura something..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
              className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500"
            />
            <button
              onClick={() => handleSendChat()}
              className="p-2 bg-indigo-600 hover:bg-indigo-755 text-white rounded-xl transition active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}

export default AiAnalyzerView;

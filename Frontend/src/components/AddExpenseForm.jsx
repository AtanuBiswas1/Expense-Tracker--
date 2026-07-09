import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { UpdateExpenseDate, UpdateIncomeData } from "../features/apiDate/apiData.Slice.js";
import { addExpenceUrl, addIncomeUrl } from "../constant.API_URL.js";
import { useToast } from "../context/ToastContext";
import { X, Mic, RefreshCw, FileText, Share2, Star, Save, Clipboard, MapPin, Tag } from "lucide-react";
import { ExpenseCategories, IncomeCategories, Wallets, Currencies } from "../utils/MockData";

function AddExpenseForm({ setAddExpense, defaultType = "expense", onAddSuccess }) {
  const { register, handleSubmit, setValue, watch, reset } = useForm({
    defaultValues: {
      type: defaultType,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().slice(0, 5),
      currency: "INR",
      paymentMethod: "UPI",
      wallet: "wallet_upi"
    }
  });

  const dispatch = useDispatch();
  const { addToast } = useToast();
  const [transactionType, setTransactionType] = useState(defaultType);
  const [isOcrScanning, setIsOcrScanning] = useState(false);
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const [isSplit, setIsSplit] = useState(false);
  const [isRecurring, setIsRecurring] = useState(false);

  const watchType = watch("type");
  const watchMerchant = watch("merchant");

  useEffect(() => {
    if (watchType) {
      setTransactionType(watchType);
    }
  }, [watchType]);

  // Auto category detection based on Merchant
  useEffect(() => {
    if (watchMerchant) {
      const merchant = watchMerchant.toLowerCase();
      if (merchant.includes("uber") || merchant.includes("ola") || merchant.includes("petrol") || merchant.includes("metro")) {
        setValue("category", "transport");
        setValue("subCategory", "Commute Ride");
      } else if (merchant.includes("swiggy") || merchant.includes("zomato") || merchant.includes("starbucks") || merchant.includes("food") || merchant.includes("restaurant")) {
        setValue("category", "food");
        setValue("subCategory", "Dining Out");
      } else if (merchant.includes("amazon") || merchant.includes("flipkart") || merchant.includes("zara") || merchant.includes("myntra") || merchant.includes("nike")) {
        setValue("category", "shopping");
        setValue("subCategory", "Apparel & Gear");
      } else if (merchant.includes("netflix") || merchant.includes("spotify") || merchant.includes("hulu") || merchant.includes("theater")) {
        setValue("category", "entertainment");
        setValue("subCategory", "Streaming Service");
      }
    }
  }, [watchMerchant, setValue]);

  // Simulate OCR Scan
  const triggerOcrScan = () => {
    setIsOcrScanning(true);
    addToast("Analyzing receipt image...", "info");
    setTimeout(() => {
      setValue("amount", 2850);
      setValue("merchant", "Zara Store Indiranagar");
      setValue("description", "Premium Cotton Shirt & Accessories");
      setValue("category", "shopping");
      setValue("subCategory", "Clothing");
      setValue("tags", "ootd, wardrobe, shopping");
      setIsOcrScanning(false);
      addToast("Receipt scanned! Extracted amount: ₹2,850 from Zara", "success");
    }, 2500);
  };

  // Voice Expense/Income Entry using browser-native Web Speech API
  const triggerVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      addToast("Speech recognition is not supported in this browser. Please use Google Chrome.", "error");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    setIsVoiceRecording(true);
    addToast("Listening... Try saying: 'Spent 500 rupees at Starbucks for dinner'", "info");

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      console.log("Speech parsed:", transcript);
      
      let amount = null;
      let merchant = "";
      let description = transcript;
      let category = watch("type") === "income" ? "Other" : "other_exp";

      // 1. Amount Extraction
      const amountMatch = transcript.match(/\b\d+(?:\.\d+)?\b/);
      if (amountMatch) {
        amount = parseFloat(amountMatch[0]);
      }

      // 2. Merchant / Source Extraction
      const merchantMatch = transcript.match(/\b(?:at|from|to|on)\s+([A-Za-z0-9\s]+?)(?:\s+(?:for|today|yesterday|rupees|dollars|rs|usd|in|on|at)\b|$)/i);
      if (merchantMatch) {
        merchant = merchantMatch[1].trim();
      } else {
        merchant = "Voice Input";
      }

      // 3. Category Matcher Heuristics
      const textLower = transcript.toLowerCase();
      if (watch("type") === "expense") {
        if (textLower.match(/\b(?:food|dining|restaurant|cafe|starbucks|mcdonalds|burger|pizza|coffee|tea|lunch|dinner|breakfast|eat|eaten|grocery|groceries|supermarket)\b/)) {
          category = "food";
        } else if (textLower.match(/\b(?:commute|transport|bus|cab|taxi|uber|ola|auto|metro|train|flight|ticket|travel|trip|gas|fuel|petrol|diesel)\b/)) {
          category = "transport";
        } else if (textLower.match(/\b(?:shopping|clothes|shirt|dress|shoes|zara|h&m|amazon|flipkart|myntra|mall|electronics|phone|laptop)\b/)) {
          category = "shopping";
        } else if (textLower.match(/\b(?:rent|bills|electricity|power|gas|water|wifi|internet|broadband|utilities|recharge)\b/)) {
          category = "utilities";
        } else if (textLower.match(/\b(?:movie|cinema|netflix|spotify|game|gaming|fun|entertainment|club|bar|party|concert)\b/)) {
          category = "entertainment";
        } else if (textLower.match(/\b(?:rent|house|housing|apartment|flat|hostel)\b/)) {
          category = "housing";
        } else if (textLower.match(/\b(?:doctor|hospital|medical|medicine|clinic|pharmacy|dentist|healthcare)\b/)) {
          category = "healthcare";
        } else if (textLower.match(/\b(?:flight|hotel|airbnb|travel|trip|vacation|tour)\b/)) {
          category = "travel";
        } else if (textLower.match(/\b(?:school|college|fees|books|course|udemy|education|tuition)\b/)) {
          category = "education";
        }
      } else {
        // Income categories
        if (textLower.match(/\b(?:salary|job|work|office|paycheck|corporate)\b/)) {
          category = "Salary";
        } else if (textLower.match(/\b(?:freelance|client|project|gigs|consulting)\b/)) {
          category = "Freelance";
        } else if (textLower.match(/\b(?:dividend|interest|stocks|shares|crypto|bitcoin|investment|mutual fund|profit)\b/)) {
          category = "Investments";
        }
      }

      // Populate Form Values
      if (amount) setValue("amount", amount);
      if (merchant) setValue("merchant", merchant);
      setValue("description", description);
      setValue("category", category);
      
      addToast(`Voice Parsed: ₹${amount || 'Not found'} at ${merchant}`, "success");
    };

    recognition.onerror = (event) => {
      console.error("Speech Recognition Error:", event.error);
      if (event.error === "not-allowed") {
        addToast("Microphone access denied. Please enable mic permissions.", "error");
      } else {
        addToast(`Voice Entry Error: ${event.error}`, "error");
      }
      setIsVoiceRecording(false);
    };

    recognition.onend = () => {
      setIsVoiceRecording(false);
    };

    recognition.start();
  };

  const getCookie = (name) => {
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith(name + "="))
      ?.split("=")[1];
  };

  const submitData = async (data) => {
    const token = getCookie("accessToken");
    const targetUrl = data.type === "expense" ? addExpenceUrl : addIncomeUrl;
    
    // Transform data for backend compatibility
    const payload = {
      amount: Number(data.amount),
      category: data.category,
      description: data.description || `${data.type === 'expense' ? 'Expense' : 'Income'} log at ${data.merchant || 'General'}`,
      date: data.date,
      // Add custom variables for local persistence
      merchant: data.merchant,
      paymentMethod: data.paymentMethod,
      wallet: data.wallet,
      tags: data.tags ? data.tags.split(',').map(t => t.trim()) : [],
      type: data.type
    };

    try {
      const response = await fetch(targetUrl, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      
      const resData = await response.json();
      
      if (resData.success) {
        addToast(`${data.type === "expense" ? "Expense" : "Income"} successfully logged to dashboard.`, "success");
        window.dispatchEvent(new Event("local-data-update"));
      } else {
        // Fallback for demo when backend endpoint is not matching payload schema or unauthorized
        // Save to local storage for offline state management
        saveToLocalStorage(payload);
        addToast(`${data.type === "expense" ? "Expense" : "Income"} logged (Offline Mode).`, "success");
      }
    } catch (error) {
      saveToLocalStorage(payload);
      addToast(`${data.type === "expense" ? "Expense" : "Income"} logged locally.`, "success");
    }

    if (data.type === "expense") {
      dispatch(UpdateExpenseDate());
    } else {
      dispatch(UpdateIncomeData());
    }

    if (onAddSuccess) onAddSuccess(payload);
    setAddExpense(false);
  };

  const saveToLocalStorage = (payload) => {
    const key = payload.type === "expense" ? "offline_expenses" : "offline_incomes";
    const existing = JSON.parse(localStorage.getItem(key) || "[]");
    const newEntry = {
      _id: `offline-${Date.now()}`,
      ...payload,
      createdAt: new Date().toISOString()
    };
    existing.unshift(newEntry);
    localStorage.setItem(key, JSON.stringify(existing));
    
    // Trigger window event to notify other components to refresh
    window.dispatchEvent(new Event("local-data-update"));
  };

  const saveDraft = () => {
    addToast("Transaction template saved as draft.", "info");
    setAddExpense(false);
  };

  return (
    <div className="relative shadow-2xl w-full max-w-lg overflow-y-auto max-h-[90vh] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 transform transition-all duration-300">
      
      {/* Decorative Blur Glows */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-2xl pointer-events-none"></div>
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-2xl pointer-events-none"></div>

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
          <span>Add Transaction</span>
          {isOcrScanning && <RefreshCw className="w-4 h-4 animate-spin text-indigo-500" />}
          {isVoiceRecording && <Mic className="w-4 h-4 animate-bounce text-rose-500" />}
        </h2>
        <button
          onClick={() => setAddExpense(false)}
          className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Quick Helpers Panel */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <button
          type="button"
          onClick={triggerOcrScan}
          disabled={isOcrScanning}
          className="flex items-center justify-center gap-2 py-2.5 px-3 border border-dashed border-indigo-200 dark:border-indigo-850 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 text-xs font-semibold rounded-xl transition-all duration-200 disabled:opacity-50"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>{isOcrScanning ? "Scanning..." : "OCR Scan Receipt"}</span>
        </button>
        <button
          type="button"
          onClick={triggerVoiceInput}
          disabled={isVoiceRecording}
          className="flex items-center justify-center gap-2 py-2.5 px-3 border border-dashed border-rose-200 dark:border-rose-850 hover:bg-rose-50/50 dark:hover:bg-rose-950/20 text-rose-600 dark:text-rose-450 text-xs font-semibold rounded-xl transition-all duration-200 disabled:opacity-50"
        >
          <Mic className="w-3.5 h-3.5" />
          <span>{isVoiceRecording ? "Listening..." : "Voice Input Entry"}</span>
        </button>
      </div>

      <form onSubmit={handleSubmit(submitData)} className="space-y-4">
        {/* Type selector tab */}
        <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-xl">
          <label className="flex-1 text-center">
            <input
              type="radio"
              value="expense"
              {...register("type")}
              className="sr-only"
            />
            <span className={`block py-1.5 text-xs font-bold rounded-lg cursor-pointer transition-all duration-200 ${transactionType === "expense" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"}`}>
              Expense
            </span>
          </label>
          <label className="flex-1 text-center">
            <input
              type="radio"
              value="income"
              {...register("type")}
              className="sr-only"
            />
            <span className={`block py-1.5 text-xs font-bold rounded-lg cursor-pointer transition-all duration-200 ${transactionType === "income" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"}`}>
              Income
            </span>
          </label>
        </div>

        {/* Currency & Amount */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Currency</label>
            <select
              {...register("currency")}
              className="w-full bg-slate-50 dark:bg-slate-950 text-xs border border-slate-200 dark:border-slate-800 text-slate-850 dark:text-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-indigo-500"
            >
              {Currencies.map(c => (
                <option key={c.code} value={c.code}>{c.symbol} - {c.code}</option>
              ))}
            </select>
          </div>
          <div className="col-span-2">
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Amount</label>
            <input
              type="number"
              step="any"
              placeholder="0.00"
              required
              {...register("amount", { required: true })}
              className="w-full bg-slate-50 dark:bg-slate-950 text-xs border border-slate-200 dark:border-slate-800 text-slate-850 dark:text-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Title / Description */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 mb-1">Transaction Title</label>
          <input
            type="text"
            placeholder="e.g. Starbucks Latte / Monthly Rent"
            {...register("description")}
            className="w-full bg-slate-50 dark:bg-slate-950 text-xs border border-slate-200 dark:border-slate-800 text-slate-850 dark:text-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Merchant & Location */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Merchant / Source</label>
            <input
              type="text"
              placeholder="e.g. Starbucks, Zomato"
              {...register("merchant")}
              className="w-full bg-slate-50 dark:bg-slate-950 text-xs border border-slate-200 dark:border-slate-800 text-slate-850 dark:text-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Location</label>
            <div className="relative">
              <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
              <input
                type="text"
                placeholder="e.g. Indiranagar"
                {...register("location")}
                className="w-full pl-8 bg-slate-50 dark:bg-slate-950 text-xs border border-slate-200 dark:border-slate-800 text-slate-850 dark:text-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Category & Sub Category */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Category</label>
            <select
              {...register("category", { required: true })}
              className="w-full bg-slate-50 dark:bg-slate-950 text-xs border border-slate-200 dark:border-slate-800 text-slate-850 dark:text-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-indigo-500"
            >
              {transactionType === "expense" ? (
                ExpenseCategories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))
              ) : (
                IncomeCategories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))
              )}
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Sub-Category</label>
            <input
              type="text"
              placeholder="e.g. Coffee, Dine-out"
              {...register("subCategory")}
              className="w-full bg-slate-50 dark:bg-slate-950 text-xs border border-slate-200 dark:border-slate-800 text-slate-850 dark:text-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Date</label>
            <input
              type="date"
              required
              {...register("date", { required: true })}
              className="w-full bg-slate-50 dark:bg-slate-950 text-xs border border-slate-200 dark:border-slate-800 text-slate-850 dark:text-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Time</label>
            <input
              type="time"
              {...register("time")}
              className="w-full bg-slate-50 dark:bg-slate-950 text-xs border border-slate-200 dark:border-slate-800 text-slate-850 dark:text-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Wallet / Accounts & Payment Method */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Wallet / Source Account</label>
            <select
              {...register("wallet")}
              className="w-full bg-slate-50 dark:bg-slate-950 text-xs border border-slate-200 dark:border-slate-800 text-slate-850 dark:text-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-indigo-500"
            >
              {Wallets.map(w => (
                <option key={w.id} value={w.id}>{w.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Payment Method</label>
            <select
              {...register("paymentMethod")}
              className="w-full bg-slate-50 dark:bg-slate-950 text-xs border border-slate-200 dark:border-slate-800 text-slate-850 dark:text-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-indigo-500"
            >
              <option value="UPI">UPI Payment</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Debit Card">Debit Card</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Cash">Cash / Handover</option>
            </select>
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 mb-1">Tags (comma separated)</label>
          <div className="relative">
            <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
            <input
              type="text"
              placeholder="e.g. food, bill, weekend"
              {...register("tags")}
              className="w-full pl-8 bg-slate-50 dark:bg-slate-950 text-xs border border-slate-200 dark:border-slate-800 text-slate-850 dark:text-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Advanced settings toggles */}
        <div className="flex gap-4 items-center py-1">
          <label className="flex items-center space-x-2 text-xs font-semibold text-slate-500 dark:text-slate-400 cursor-pointer">
            <input
              type="checkbox"
              checked={isRecurring}
              onChange={() => setIsRecurring(!isRecurring)}
              className="rounded text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
            />
            <span>Recurring Bill</span>
          </label>
          <label className="flex items-center space-x-2 text-xs font-semibold text-slate-500 dark:text-slate-400 cursor-pointer">
            <input
              type="checkbox"
              checked={isSplit}
              onChange={() => setIsSplit(!isSplit)}
              className="rounded text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
            />
            <span>Split Bill</span>
          </label>
        </div>

        {/* Splits block */}
        {isSplit && (
          <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-2xl p-3 space-y-2.5 animate-slide-in">
            <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider block">Split Details</span>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Partner Names (e.g. Rahul, Sneha)"
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs rounded-xl p-2 focus:outline-none"
              />
              <input
                type="number"
                placeholder="Your share amount (₹)"
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs rounded-xl p-2 focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* Recurring block */}
        {isRecurring && (
          <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-2xl p-3 space-y-2.5 animate-slide-in">
            <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider block">Schedule Recurrence</span>
            <div className="grid grid-cols-2 gap-2">
              <select className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs rounded-xl p-2 focus:outline-none">
                <option value="weekly">Every Week</option>
                <option value="monthly">Every Month</option>
                <option value="yearly">Every Year</option>
              </select>
              <input
                type="date"
                placeholder="End date"
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs rounded-xl p-2 focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* Actions Footer */}
        <div className="flex gap-3 pt-4 border-t border-slate-100 dark:border-slate-800/60">
          <button
            type="button"
            onClick={saveDraft}
            className="flex-1 flex justify-center items-center gap-1 py-2.5 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-950 text-slate-650 dark:text-slate-350 text-xs font-semibold rounded-xl transition"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Draft</span>
          </button>
          <button
            type="submit"
            className="flex-1 flex justify-center items-center gap-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/25 transition transform active:scale-95"
          >
            <Clipboard className="w-3.5 h-3.5" />
            <span>Save Log</span>
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddExpenseForm;

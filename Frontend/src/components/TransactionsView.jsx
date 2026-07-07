import React, { useState, useEffect } from "react";
import { format, subDays } from "date-fns";
import { 
  Search, SlidersHorizontal, ArrowUpDown, ChevronLeft, ChevronRight, Download, Upload,
  Trash2, Edit, CheckSquare, Square, Eye, Columns, Calendar, Tag, DollarSign, RefreshCw
} from "lucide-react";
import { InitialTransactions, ExpenseCategories, IncomeCategories } from "../utils/MockData";
import { useToast } from "../context/ToastContext";
import { ExpenceApiCall, IncomeApiCall } from "../API/apiCall.Function.js";

function TransactionsView() {
  const { addToast } = useToast();
  
  // States
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortField, setSortField] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  
  // Filter Fields
  const [filterType, setFilterType] = useState("all"); // all, income, expense
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterPayment, setFilterPayment] = useState("all");
  const [filterDateRange, setFilterDateRange] = useState("all"); // all, today, 7days, 30days
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  
  // Selection & Columns
  const [selectedIds, setSelectedIds] = useState([]);
  const [visibleColumns, setVisibleColumns] = useState({
    date: true,
    description: true,
    category: true,
    merchant: true,
    paymentMethod: true,
    amount: true,
    status: true
  });
  const [showColumnChooser, setShowColumnChooser] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [currencySymbol, setCurrencySymbol] = useState("₹");

  const loadData = async () => {
    let dbExpenses = [];
    let dbIncomes = [];
    
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
    
    // De-duplicating by unique fields
    const uniqueMap = {};
    combined.forEach(t => {
      const key = `${t.date}-${t.amount}-${t.category}-${t.description}`;
      if (!uniqueMap[key]) {
        uniqueMap[key] = t;
      }
    });

    const sortedList = Object.values(uniqueMap).sort((a, b) => b.date.localeCompare(a.date));
    setTransactions(sortedList);
  };

  useEffect(() => {
    loadData();
    window.addEventListener("local-data-update", loadData);
    
    // Listen for currency change
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

  // Filter application
  const filteredData = transactions.filter(t => {
    // Search filter
    const query = searchTerm.toLowerCase();
    const matchesSearch = 
      t.description?.toLowerCase().includes(query) ||
      t.merchant?.toLowerCase().includes(query) ||
      t.category?.toLowerCase().includes(query) ||
      t.tags?.some(tag => tag.toLowerCase().includes(query));

    // Type filter
    const matchesType = filterType === "all" ? true : t.type === filterType;

    // Category filter
    const matchesCategory = filterCategory === "all" ? true : t.category === filterCategory;

    // Payment Method filter
    const matchesPayment = filterPayment === "all" ? true : t.paymentMethod === filterPayment;

    // Date Range filter
    let matchesDate = true;
    const todayStr = format(new Date(), "yyyy-MM-dd");
    if (filterDateRange === "today") {
      matchesDate = t.date === todayStr;
    } else if (filterDateRange === "7days") {
      const sevenDaysAgo = format(subDays(new Date(), 7), "yyyy-MM-dd");
      matchesDate = t.date >= sevenDaysAgo;
    } else if (filterDateRange === "30days") {
      const thirtyDaysAgo = format(subDays(new Date(), 30), "yyyy-MM-dd");
      matchesDate = t.date >= thirtyDaysAgo;
    }

    // Amount range filter
    const matchesMin = minAmount === "" ? true : t.amount >= Number(minAmount);
    const matchesMax = maxAmount === "" ? true : t.amount <= Number(maxAmount);

    return matchesSearch && matchesType && matchesCategory && matchesPayment && matchesDate && matchesMin && matchesMax;
  });

  // Sorting application
  const sortedData = [...filteredData].sort((a, b) => {
    let fieldA = a[sortField];
    let fieldB = b[sortField];

    if (sortField === "amount") {
      return sortOrder === "asc" ? fieldA - fieldB : fieldB - fieldA;
    }

    fieldA = (fieldA || "").toString().toLowerCase();
    fieldB = (fieldB || "").toString().toLowerCase();

    if (fieldA < fieldB) return sortOrder === "asc" ? -1 : 1;
    if (fieldA > fieldB) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  // Paginated chunk
  const totalPages = Math.ceil(sortedData.length / itemsPerPage) || 1;
  const paginatedData = sortedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.length === paginatedData.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedData.map(d => d.id));
    }
  };

  const handleSelectRow = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Bulk Delete
  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    
    // Mock delete by removing from local lists
    const localExpenses = JSON.parse(localStorage.getItem("offline_expenses") || "[]");
    const localIncomes = JSON.parse(localStorage.getItem("offline_incomes") || "[]");
    
    const newExpenses = localExpenses.filter(e => !selectedIds.includes(e._id) && !selectedIds.includes(e.id));
    const newIncomes = localIncomes.filter(i => !selectedIds.includes(i._id) && !selectedIds.includes(i.id));
    
    localStorage.setItem("offline_expenses", JSON.stringify(newExpenses));
    localStorage.setItem("offline_incomes", JSON.stringify(newIncomes));

    // For MockData.js static items, we filter them locally in dashboard state
    const remainingMock = transactions.filter(t => !selectedIds.includes(t.id));
    setTransactions(remainingMock);

    // Toast with Undo Delete simulation
    addToast(`Bulk deleted ${selectedIds.length} items.`, "warning", 5000);
    setSelectedIds([]);
    window.dispatchEvent(new Event("local-data-update"));
  };

  // Bulk Edit mock
  const handleBulkEdit = () => {
    if (selectedIds.length === 0) return;
    addToast(`Bulk updated status to 'Completed' for ${selectedIds.length} items.`, "success");
    setSelectedIds([]);
  };

  // Exporters
  const exportToCSV = () => {
    const headers = "Date,Description,Category,Merchant,Method,Amount,Type\n";
    const rows = sortedData.map(t => `"${t.date}","${t.description || ''}","${t.category}","${t.merchant || ''}","${t.paymentMethod}",${t.amount},"${t.type}"`).join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `COAB_Statement_${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    addToast("CSV statement downloaded successfully.", "success");
  };

  const exportToExcel = () => {
    // Generate clean styled HTML spreadsheet
    let table = `<table><thead><tr><th>Date</th><th>Description</th><th>Category</th><th>Merchant</th><th>Payment Method</th><th>Amount</th><th>Type</th></tr></thead><tbody>`;
    sortedData.forEach(t => {
      table += `<tr><td>${t.date}</td><td>${t.description}</td><td>${t.category}</td><td>${t.merchant}</td><td>${t.paymentMethod}</td><td>${t.amount}</td><td>${t.type}</td></tr>`;
    });
    table += `</tbody></table>`;
    const blob = new Blob([table], { type: "application/vnd.ms-excel" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `COAB_Statement_${format(new Date(), "yyyy-MM-dd")}.xls`;
    a.click();
    addToast("Excel Statement exported.", "success");
  };

  const exportToPDF = () => {
    window.print(); // Prompt printer utility formatted for statement
  };

  // CSV Importer simulator
  const handleCsvImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    addToast("Reading and verifying CSV contents...", "info");
    
    setTimeout(() => {
      const offlineExpenses = JSON.parse(localStorage.getItem("offline_expenses") || "[]");
      const mockRecord = {
        _id: `imported-${Date.now()}`,
        amount: 850,
        category: "food",
        description: "Imported Dining Record from CSV",
        date: format(new Date(), "yyyy-MM-dd"),
        merchant: "Dominos Pizza",
        paymentMethod: "UPI",
        tags: ["imported", "csv"],
        type: "expense",
        createdAt: new Date().toISOString()
      };
      
      offlineExpenses.unshift(mockRecord);
      localStorage.setItem("offline_expenses", JSON.stringify(offlineExpenses));
      addToast("CSV Data successfully imported: 1 new record added.", "success");
      
      window.dispatchEvent(new Event("local-data-update"));
    }, 1800);
  };

  const getCategoryColor = (catId) => {
    const expenseCat = ExpenseCategories.find(c => c.id === catId);
    if (expenseCat) return expenseCat.color;
    const incomeCat = IncomeCategories.find(c => c.id === catId);
    if (incomeCat) return incomeCat.color;
    return "#64748B";
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-3xl p-5 shadow-sm space-y-4">
      {/* Top controls section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <span>Transactions Register</span>
          <span className="text-xs font-normal text-slate-400">({sortedData.length} records)</span>
        </h2>
        
        {/* Quick Filter actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <button 
            onClick={exportToCSV}
            className="flex items-center gap-1 px-3 py-1.5 border border-slate-200 dark:border-slate-800 text-slate-650 dark:text-slate-350 text-xs font-medium rounded-xl hover:bg-slate-50 dark:hover:bg-slate-950 transition"
            title="Download CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
          
          <button 
            onClick={exportToExcel}
            className="flex items-center gap-1 px-3 py-1.5 border border-slate-200 dark:border-slate-800 text-slate-650 dark:text-slate-350 text-xs font-medium rounded-xl hover:bg-slate-50 dark:hover:bg-slate-950 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export Excel</span>
          </button>

          <label className="flex items-center gap-1 px-3 py-1.5 border border-dashed border-indigo-200 dark:border-indigo-850 text-indigo-650 dark:text-indigo-400 text-xs font-semibold rounded-xl hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 cursor-pointer transition">
            <Upload className="w-3.5 h-3.5" />
            <span>Import CSV</span>
            <input type="file" accept=".csv" onChange={handleCsvImport} className="hidden" />
          </label>
        </div>
      </div>

      {/* Search & filters panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="md:col-span-2 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search records by merchant, description, category or tag..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border text-xs font-semibold transition ${showFilters ? 'bg-indigo-50 border-indigo-200 text-indigo-600 dark:bg-indigo-950/40' : 'border-slate-200 dark:border-slate-800 text-slate-650 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-950'}`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters</span>
          </button>
          
          <div className="relative">
            <button
              onClick={() => setShowColumnChooser(!showColumnChooser)}
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-950 text-xs font-semibold flex items-center justify-center"
              title="Choose Columns"
            >
              <Columns className="w-4 h-4" />
            </button>
            {showColumnChooser && (
              <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-50 p-3 space-y-2 text-xs">
                <span className="font-bold text-slate-400 block mb-1 text-[10px] uppercase">Visible Columns</span>
                {Object.keys(visibleColumns).map(col => (
                  <label key={col} className="flex items-center space-x-2 cursor-pointer text-slate-650 dark:text-slate-400">
                    <input
                      type="checkbox"
                      checked={visibleColumns[col]}
                      onChange={() => setVisibleColumns({ ...visibleColumns, [col]: !visibleColumns[col] })}
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="capitalize">{col}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Advanced filters dropdown box */}
      {showFilters && (
        <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-2xl p-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs animate-slide-in">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Type</label>
            <select
              value={filterType}
              onChange={(e) => { setFilterType(e.target.value); setCurrentPage(1); }}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2 focus:outline-none"
            >
              <option value="all">All Transactions</option>
              <option value="expense">Expenses</option>
              <option value="income">Income</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Payment Method</label>
            <select
              value={filterPayment}
              onChange={(e) => { setFilterPayment(e.target.value); setCurrentPage(1); }}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2 focus:outline-none"
            >
              <option value="all">All Methods</option>
              <option value="UPI">UPI Link</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Debit Card">Debit Card</option>
              <option value="Cash">Cash Account</option>
              <option value="Bank Transfer">Bank Transfer</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Date Period</label>
            <select
              value={filterDateRange}
              onChange={(e) => { setFilterDateRange(e.target.value); setCurrentPage(1); }}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2 focus:outline-none"
            >
              <option value="all">Lifetime</option>
              <option value="today">Today</option>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Amount Range</label>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                placeholder="Min"
                value={minAmount}
                onChange={(e) => { setMinAmount(e.target.value); setCurrentPage(1); }}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2 focus:outline-none"
              />
              <span className="text-slate-400">-</span>
              <input
                type="number"
                placeholder="Max"
                value={maxAmount}
                onChange={(e) => { setMaxAmount(e.target.value); setCurrentPage(1); }}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2 focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Bulk actions strip */}
      {selectedIds.length > 0 && (
        <div className="bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-850/60 rounded-2xl p-3 flex justify-between items-center text-xs animate-slide-in">
          <span className="font-semibold text-indigo-750 dark:text-indigo-400">
            {selectedIds.length} items selected from list
          </span>
          <div className="flex gap-2">
            <button 
              onClick={handleBulkEdit}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-800 rounded-xl hover:bg-slate-50 font-semibold"
            >
              <Edit className="w-3.5 h-3.5 text-slate-600 dark:text-slate-350" />
              <span>Bulk Complete</span>
            </button>
            <button 
              onClick={handleBulkDelete}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 text-rose-600 rounded-xl hover:bg-rose-100 font-semibold"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Bulk Delete</span>
            </button>
          </div>
        </div>
      )}

      {/* Modern Data Table */}
      <div className="w-full overflow-x-auto rounded-2xl border border-slate-100 dark:border-slate-800">
        <table className="w-full text-left text-xs border-collapse">
          {/* Sticky Header */}
          <thead className="sticky top-0 bg-slate-50 dark:bg-slate-950 text-slate-400 uppercase tracking-wider text-[10px] font-bold border-b border-slate-100 dark:border-slate-800">
            <tr>
              <th className="py-3 px-4 w-10">
                <button onClick={handleSelectAll} className="p-0.5 text-slate-400 hover:text-slate-650">
                  {selectedIds.length === paginatedData.length && paginatedData.length > 0 ? (
                    <CheckSquare className="w-4 h-4 text-indigo-650" />
                  ) : (
                    <Square className="w-4 h-4" />
                  )}
                </button>
              </th>
              {visibleColumns.date && (
                <th className="py-3 px-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-900/60 transition" onClick={() => toggleSort("date")}>
                  <div className="flex items-center gap-1.5">
                    <span>Date</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </div>
                </th>
              )}
              {visibleColumns.description && (
                <th className="py-3 px-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-900/60 transition" onClick={() => toggleSort("description")}>
                  <div className="flex items-center gap-1.5">
                    <span>Description</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </div>
                </th>
              )}
              {visibleColumns.category && <th className="py-3 px-4">Category</th>}
              {visibleColumns.merchant && <th className="py-3 px-4">Merchant</th>}
              {visibleColumns.paymentMethod && <th className="py-3 px-4">Method</th>}
              {visibleColumns.amount && (
                <th className="py-3 px-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-900/60 transition text-right" onClick={() => toggleSort("amount")}>
                  <div className="flex items-center gap-1.5 justify-end">
                    <span>Amount</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </div>
                </th>
              )}
              {visibleColumns.status && <th className="py-3 px-4 text-center">Status</th>}
            </tr>
          </thead>
          
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-350">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-10 text-center text-slate-400">
                  No matching transaction records found. Add some above!
                </td>
              </tr>
            ) : (
              paginatedData.map((item) => (
                <tr 
                  key={item.id || item._id} 
                  className={`hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition-all ${selectedIds.includes(item.id) ? 'bg-indigo-50/30 dark:bg-indigo-950/10' : ''}`}
                >
                  <td className="py-3 px-4">
                    <button onClick={() => handleSelectRow(item.id)} className="p-0.5 text-slate-400 hover:text-slate-600">
                      {selectedIds.includes(item.id) ? (
                        <CheckSquare className="w-4 h-4 text-indigo-600" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>
                  </td>
                  {visibleColumns.date && (
                    <td className="py-3 px-4 whitespace-nowrap text-[11px] font-medium text-slate-500">
                      {format(new Date(item.date), "dd MMM yyyy")} <span className="text-[10px] text-slate-400 ml-1">{item.time || ""}</span>
                    </td>
                  )}
                  {visibleColumns.description && (
                    <td className="py-3 px-4 max-w-xs font-semibold text-slate-850 dark:text-slate-200 truncate">
                      {item.description || item.title || "Transaction"}
                      {item.tags && item.tags.length > 0 && (
                        <div className="flex gap-1 mt-1 flex-wrap">
                          {item.tags.map(t => (
                            <span key={t} className="text-[8px] bg-slate-100 dark:bg-slate-950 px-1 py-0.5 rounded text-slate-400">#{t}</span>
                          ))}
                        </div>
                      )}
                    </td>
                  )}
                  {visibleColumns.category && (
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: getCategoryColor(item.category) }} />
                        <span className="capitalize">{item.category?.replace('_', ' ')}</span>
                      </div>
                    </td>
                  )}
                  {visibleColumns.merchant && <td className="py-3 px-4 text-slate-500 font-medium">{item.merchant || "General"}</td>}
                  {visibleColumns.paymentMethod && <td className="py-3 px-4 text-slate-400">{item.paymentMethod}</td>}
                  {visibleColumns.amount && (
                    <td className={`py-3 px-4 text-right font-extrabold whitespace-nowrap ${item.type === "expense" ? "text-rose-500" : "text-emerald-500"}`}>
                      {item.type === "expense" ? "-" : "+"}{currencySymbol}{item.amount.toLocaleString()}
                    </td>
                  )}
                  {visibleColumns.status && (
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-0.5 text-[9px] rounded-full font-bold ${item.status === 'completed' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20' : 'bg-amber-50 text-amber-600 dark:bg-amber-950/20'}`}>
                        {item.status || "Completed"}
                      </span>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      <div className="flex justify-between items-center pt-2">
        <span className="text-[11px] text-slate-400 font-medium">
          Showing Page {currentPage} of {totalPages}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-1.5 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-950 disabled:opacity-40 disabled:pointer-events-none transition"
          >
            <ChevronLeft className="w-4 h-4 text-slate-650" />
          </button>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-1.5 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-950 disabled:opacity-40 disabled:pointer-events-none transition"
          >
            <ChevronRight className="w-4 h-4 text-slate-650" />
          </button>
        </div>
      </div>

    </div>
  );
}

export default TransactionsView;

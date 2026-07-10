import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { 
  LayoutDashboard, TableProperties, TrendingDown, TrendingUp, Landmark, 
  Target, BarChart3, Calendar, FilePieChart, Bot, Settings, Menu, X, Plus
} from "lucide-react";

// Views
import DashboardView from "../components/DashboardView";
import TransactionsView from "../components/TransactionsView";
import IncomeView from "../components/IncomeView";
import BudgetView from "../components/BudgetView";
import SavingsGoalsView from "../components/SavingsGoalsView";
import CalendarView from "../components/CalendarView";
import ReportsView from "../components/ReportsView";
import AiAnalyzerView from "../components/AiAnalyzerView";
import SettingsView from "../components/SettingsView";

// Popups
import PopupAddExpense from "../components/PopupAddExpence";
import PopupAddIncome from "../components/PopupAddIncome";

function Dashbord() {
  const { userData } = useSelector((state) => state.auth);
  
  // Navigation Tabs state
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState("");

  // Quick Add Popup trigger states
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showAddIncome, setShowAddIncome] = useState(false);

  useEffect(() => {
    // Listen for Quick Add broadcast from Header.jsx
    const handleQuickAdd = () => {
      setShowAddExpense(true);
    };
    window.addEventListener("open-add-expense-modal", handleQuickAdd);

    // Listen for tab routing trigger (e.g. settings link)
    const handleTabRoute = (e) => {
      setActiveTab(e.detail);
    };
    window.addEventListener("navigate-to-tab", handleTabRoute);

    // Listen for global search key updates
    const handleSearch = (e) => {
      setSearchFilter(e.detail);
    };
    window.addEventListener("global-search", handleSearch);

    return () => {
      window.removeEventListener("open-add-expense-modal", handleQuickAdd);
      window.removeEventListener("navigate-to-tab", handleTabRoute);
      window.removeEventListener("global-search", handleSearch);
    };
  }, []);

  const menuItems = [
    { name: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
    { name: "Transactions", icon: <TableProperties className="w-4 h-4" /> },
    { name: "Expenses", icon: <TrendingDown className="w-4 h-4" /> },
    { name: "Income", icon: <TrendingUp className="w-4 h-4" /> },
    { name: "Budget", icon: <Landmark className="w-4 h-4" /> },
    { name: "Savings Goals", icon: <Target className="w-4 h-4" /> },
    { name: "Analytics", icon: <BarChart3 className="w-4 h-4" /> },
    { name: "Calendar", icon: <Calendar className="w-4 h-4" /> },
    { name: "Reports", icon: <FilePieChart className="w-4 h-4" /> },
    { name: "AI Analyzer", icon: <Bot className="w-4 h-4" /> },
    { name: "Settings", icon: <Settings className="w-4 h-4" /> }
  ];

  const renderActiveView = () => {
    switch (activeTab) {
      case "Dashboard":
      case "Analytics":
        return <DashboardView searchFilter={searchFilter} />;
      case "Transactions":
        return <TransactionsView defaultFilterType="all" />;
      case "Expenses":
        return <TransactionsView defaultFilterType="expense" />;
      case "Income":
        return <IncomeView />;
      case "Budget":
        return <BudgetView />;
      case "Savings Goals":
        return <SavingsGoalsView />;
      case "Calendar":
        return <CalendarView />;
      case "Reports":
        return <ReportsView />;
      case "AI Analyzer":
        return <AiAnalyzerView />;
      case "Settings":
        return <SettingsView />;
      default:
        return <DashboardView searchFilter={searchFilter} />;
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col md:flex-row bg-slate-50 dark:bg-[#090d16] text-slate-800 dark:text-slate-100 transition-colors duration-300">
      
      {/* Mobile Drawer Trigger Bar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
        >
          {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
        <span className="text-sm font-extrabold text-indigo-600 tracking-wider">COAB PLATFORM</span>
        <button
          onClick={() => setShowAddExpense(true)}
          className="p-1.5 bg-indigo-600 text-white rounded-lg"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Left Sidebar Layout */}
      <aside 
        className={`w-64 flex-shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800/80 p-4 space-y-4 md:block fixed md:static inset-y-16 left-0 z-40 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center px-2 py-1 md:hidden">
          <span className="text-xs font-bold text-slate-400 uppercase">Navigation Menu</span>
          <button onClick={() => setIsSidebarOpen(false)} className="text-slate-400">
            <X className="w-4 h-4" />
          </button>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => {
            const isTabActive = activeTab === item.name;
            return (
              <button
                key={item.name}
                onClick={() => {
                  setActiveTab(item.name);
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 ${
                  isTabActive 
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10" 
                    : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-950"
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>
        
        {/* Floating Quick Action Panel inside sidebar */}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-850 space-y-2">
          <button
            onClick={() => setShowAddExpense(true)}
            className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-rose-50 hover:bg-rose-100 border border-rose-200/60 dark:border-none dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 text-xs font-bold rounded-2xl transition active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Expense</span>
          </button>
          <button
            onClick={() => setShowAddIncome(true)}
            className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/60 dark:border-none dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-450 text-xs font-bold rounded-2xl transition active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Income</span>
          </button>
        </div>
      </aside>
 
      {/* Main Content Area */}
      <main className="flex-1 p-6 overflow-y-auto max-w-full">
        <div className="max-w-6xl mx-auto space-y-6">
          
          {/* Welcome Dashboard banner */}
          <div className="flex justify-between items-start no-print">
            <div>
              <h2 className="text-xl font-black text-slate-800 dark:text-slate-100">
                Welcome back, {userData?.data?.user?.userName || "User"}
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                Overview statement tracking active session for {activeTab} view.
              </p>
            </div>
            
            <div className="text-[10px] text-slate-400 font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 shadow-sm">
              Live Status: Connected
            </div>
          </div>

          {/* Dynamic Active view render */}
          <div className="animate-fade-in">
            {renderActiveView()}
          </div>

        </div>
      </main>

      {/* Modals Popup Add Expense */}
      {showAddExpense && (
        <div className="w-full h-full flex items-center justify-center p-4 fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm transition-all duration-300">
          <div className="w-full max-w-md transform scale-100 opacity-100 transition-all duration-300">
            <PopupAddExpense setAddExpense={setShowAddExpense} />
          </div>
        </div>
      )}

      {/* Modals Popup Add Income */}
      {showAddIncome && (
        <div className="w-full h-full flex items-center justify-center p-4 fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm transition-all duration-300">
          <div className="w-full max-w-md transform scale-100 opacity-100 transition-all duration-300">
            <PopupAddIncome setAddIncome={setShowAddIncome} />
          </div>
        </div>
      )}

    </div>
  );
}

export default Dashbord;

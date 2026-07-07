import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/loginuser/loginUser.Slice";
import { logoutUrl } from "../constant.API_URL.js";
import { Search, Plus, Bell, Sun, Moon, LogOut, User, CheckCircle2, AlertTriangle, Info, ShieldAlert } from "lucide-react";
import { InitialNotifications } from "../utils/MockData";

function Header() {
  const { userData, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [isThemeDark, setIsThemeDark] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(InitialNotifications);
  const [searchTerm, setSearchTerm] = useState("");

  // Handle Theme Initialisation
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const htmlElement = document.documentElement;
    if (savedTheme === "light") {
      htmlElement.classList.remove("dark");
      setIsThemeDark(false);
    } else {
      htmlElement.classList.add("dark");
      setIsThemeDark(true);
    }
  }, []);

  // Theme Toggler
  const toggleTheme = () => {
    const htmlElement = document.documentElement;
    if (htmlElement.classList.contains("dark")) {
      htmlElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsThemeDark(false);
      window.dispatchEvent(new CustomEvent("theme-change", { detail: "light" }));
    } else {
      htmlElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsThemeDark(true);
      window.dispatchEvent(new CustomEvent("theme-change", { detail: "dark" }));
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(logoutUrl, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      dispatch(logout());
    } catch (error) {
      console.log("Server Error", error);
    }
  };

  const handleQuickAdd = () => {
    // Custom window event to open expense modal from dashboard coordinator
    const event = new CustomEvent("open-add-expense-modal");
    window.dispatchEvent(event);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    // Broadcast search queries to dashboard components
    window.dispatchEvent(new CustomEvent("global-search", { detail: e.target.value }));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotifIcon = (type) => {
    switch (type) {
      case "warning": return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case "danger": return <ShieldAlert className="w-4 h-4 text-rose-500" />;
      case "success": return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      default: return <Info className="w-4 h-4 text-sky-500" />;
    }
  };

  if (!isAuthenticated) return null;

  return (
    <nav className="h-16 sticky top-0 z-50 flex items-center justify-between px-6 bg-white/80 dark:bg-[#0b0f19]/80 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 transition-colors duration-300">
      {/* Brand Logo */}
      <div className="flex items-center space-x-3">
        <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-500 via-purple-600 to-indigo-650 bg-clip-text text-transparent">
          COAB
        </span>
      </div>

      {/* Global Search Bar */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-8 relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
        <input
          type="text"
          placeholder="Search transactions, budgets, insights..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full pl-10 pr-4 py-1.5 text-sm rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 text-slate-700 dark:text-slate-200 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:focus:ring-indigo-500 transition-all duration-200"
        />
      </div>

      {/* Right Actions */}
      <div className="flex items-center space-x-4">
        {/* Quick Add Expense */}
        <button
          onClick={handleQuickAdd}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/25 transition-all duration-300 transform active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Quick Add</span>
        </button>

        {/* Theme Switcher */}
        <button
          onClick={toggleTheme}
          className="p-2 text-slate-500 hover:text-slate-850 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl transition-all duration-200"
          title="Toggle Dark/Light Mode"
        >
          {isThemeDark ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
        </button>

        {/* Notification Center */}
        <div className="relative">
          <button
            onClick={() => { setShowNotifications(!showNotifications); setShowProfileMenu(false); }}
            className="p-2 text-slate-500 hover:text-slate-850 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl transition-all duration-200 relative"
          >
            <Bell className="w-4.5 h-4.5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 animate-ping-slow"></span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">Notifications</span>
                {unreadCount > 0 && (
                  <button onClick={markAllAsRead} className="text-xs text-indigo-500 hover:underline">
                    Mark read
                  </button>
                )}
              </div>
              <div className="max-h-72 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-400">All clear! No alerts.</div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-start gap-3 transition-colors duration-200 ${notif.read ? 'opacity-70' : 'bg-slate-50/50 dark:bg-slate-950/20'}`}
                    >
                      <div className="mt-0.5">{getNotifIcon(notif.type)}</div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-slate-700 dark:text-slate-350">{notif.title}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">{notif.message}</p>
                        <span className="text-[10px] text-slate-400 mt-1 block">{notif.time}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => { setShowProfileMenu(!showProfileMenu); setShowNotifications(false); }}
            className="flex items-center space-x-2.5 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 transition-all duration-200"
          >
            <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white uppercase">
              {userData?.data?.user?.userName?.charAt(0) || "U"}
            </div>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-350 hidden sm:block">
              {userData?.data?.user?.userName || "User"}
            </span>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-3 w-52 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-50 py-1.5 overflow-hidden">
              <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                <p className="text-xs text-slate-400">Signed in as</p>
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-350 truncate">{userData?.data?.user?.email || "user@coab.com"}</p>
              </div>
              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  window.dispatchEvent(new CustomEvent("navigate-to-tab", { detail: "Settings" }));
                }}
                className="w-full px-4 py-2 text-left text-xs text-slate-650 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-950 flex items-center gap-2 transition-colors duration-200"
              >
                <User className="w-3.5 h-3.5" />
                <span>Profile Settings</span>
              </button>
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 text-left text-xs text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 flex items-center gap-2 border-t border-slate-100 dark:border-slate-800 transition-colors duration-200"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Header;

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
    <nav className="h-16 sticky top-0 z-50 flex items-center justify-between px-6 bg-white/80 dark:bg-black/90 backdrop-blur-xl border-b border-slate-200/80 dark:border-zinc-900 transition-colors duration-300">
      {/* Brand Logo & Title */}
      <div 
        className="flex items-center space-x-3 cursor-pointer group select-none"
        onClick={() => window.dispatchEvent(new CustomEvent("navigate-to-tab", { detail: "Dashboard" }))}
      >
        <div className="h-9 w-9 rounded-xl bg-black dark:bg-[#121214] border border-black/10 dark:border-zinc-800 flex items-center justify-center shadow-lg shadow-black/10 dark:shadow-none transition-transform duration-300 group-hover:scale-105">
          <svg className="w-5 h-5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.4" d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            <circle cx="12" cy="12" r="9" strokeWidth="1.8" stroke="currentColor" opacity="0.25" />
          </svg>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xl font-black tracking-tight text-black dark:text-white transition-colors">
            COAB
          </span>
          <span className="text-[9px] font-extrabold uppercase tracking-widest px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            FINANCE
          </span>
        </div>
      </div>

      {/* Global Search Bar */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-8 relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
        <input
          type="text"
          placeholder="Search transactions, budgets, insights..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full pl-10 pr-4 py-1.5 text-sm rounded-full bg-slate-100 dark:bg-[#0c0c0c] border border-slate-200/80 dark:border-zinc-800 text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-black dark:focus:border-zinc-700 focus:ring-1 focus:ring-black dark:focus:ring-zinc-700 transition-all duration-200"
        />
      </div>

      {/* Right Actions */}
      <div className="flex items-center space-x-4">
        {/* Quick Add Expense */}
        <button
          onClick={handleQuickAdd}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-black hover:bg-neutral-800 text-white text-xs font-semibold rounded-xl shadow-md shadow-black/15 transition-all duration-300 transform active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Quick Add</span>
        </button>

        {/* Theme Switcher */}
        <button
          onClick={toggleTheme}
          className="p-2 text-slate-700 hover:text-black dark:text-zinc-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-900 rounded-xl transition-all duration-200 active:scale-90"
          title={isThemeDark ? "Switch to Light Mode (Click Black)" : "Switch to Deep Black Mode"}
        >
          {isThemeDark ? <Sun className="w-4.5 h-4.5 text-amber-400" /> : <Moon className="w-4.5 h-4.5 text-slate-900" />}
        </button>

        {/* Notification Center */}
        <div className="relative">
          <button
            onClick={() => { setShowNotifications(!showNotifications); setShowProfileMenu(false); }}
            className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl transition-all duration-200 relative"
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
            className="flex items-center space-x-2.5 p-1 pl-1.5 pr-2.5 rounded-2xl hover:bg-slate-100 dark:hover:bg-zinc-900 border border-transparent hover:border-slate-200 dark:hover:border-zinc-800 transition-all duration-200"
          >
            <div className="relative">
              {userData?.data?.user?.avatar ? (
                <img
                  src={userData.data.user.avatar}
                  alt={userData?.data?.user?.userName || "Avatar"}
                  className="h-8 w-8 rounded-xl object-cover ring-1 ring-black/10 dark:ring-zinc-700 shadow-sm"
                />
              ) : (
                <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-slate-900 via-neutral-900 to-black dark:from-zinc-900 dark:to-zinc-950 border border-black/10 dark:border-zinc-700/80 flex items-center justify-center text-xs font-black text-white uppercase shadow-sm">
                  {userData?.data?.user?.userName?.charAt(0) || "U"}
                </div>
              )}
              {/* Online indicator dot */}
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-black"></span>
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold text-black dark:text-zinc-100 leading-tight">
                {userData?.data?.user?.userName || "User"}
              </span>
              <span className="text-[10px] font-medium text-slate-400 dark:text-zinc-500 leading-none mt-0.5">
                Personal
              </span>
            </div>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-[#0c0c0e] border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-2xl z-50 py-2 overflow-hidden animate-slide-in">
              <div className="px-4 py-2.5 border-b border-slate-100 dark:border-zinc-800/80">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">Signed In As</p>
                <p className="text-xs font-bold text-black dark:text-zinc-100 truncate mt-0.5">{userData?.data?.user?.userName || "User"}</p>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 truncate">{userData?.data?.user?.email || "user@coab.com"}</p>
              </div>
              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  window.dispatchEvent(new CustomEvent("navigate-to-tab", { detail: "Settings" }));
                }}
                className="w-full px-4 py-2.5 text-left text-xs font-semibold text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-900 flex items-center gap-2.5 transition-colors duration-150"
              >
                <User className="w-4 h-4 text-slate-500 dark:text-zinc-400" />
                <span>Profile Settings</span>
              </button>
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2.5 text-left text-xs font-semibold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 flex items-center gap-2.5 border-t border-slate-100 dark:border-zinc-800/80 transition-colors duration-150"
              >
                <LogOut className="w-4 h-4" />
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

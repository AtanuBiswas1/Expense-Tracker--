import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { checkAuth } from "../features/loginuser/loginUser.Slice.js";
import { useToast } from "../context/ToastContext";
import { User, Shield, Bell, Globe, Database, Moon, Sun, Download, Upload } from "lucide-react";

function SettingsView() {
  const { addToast } = useToast();
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.auth);
  
  // Local Settings States
  const [userName, setUserName] = useState("User");
  const [email, setEmail] = useState("user@coab.com");
  const [selectedCurrency, setSelectedCurrency] = useState("INR");
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [enable2fa, setEnable2fa] = useState(false);
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifWarning, setNotifWarning] = useState(true);

  useEffect(() => {
    if (userData?.data?.user) {
      setUserName(userData.data.user.userName || "User");
      setEmail(userData.data.user.email || "user@coab.com");
    }
    const savedCurrency = localStorage.getItem("app_currency") || "INR";
    setSelectedCurrency(savedCurrency);
    
    const savedLanguage = localStorage.getItem("app_language") || "en";
    setSelectedLanguage(savedLanguage);
  }, [userData]);

  const handleProfileSave = (e) => {
    e.preventDefault();
    addToast("Profile details updated successfully.", "success");
  };

  const handleCurrencyChange = (e) => {
    const val = e.target.value;
    setSelectedCurrency(val);
    localStorage.setItem("app_currency", val);
    
    // Broadcast currency changes globally
    window.dispatchEvent(new CustomEvent("currency-change", { detail: val }));
    addToast(`Currency switched to ${val}.`, "info");
  };

  const handleBackupExport = () => {
    const localExpenses = localStorage.getItem("offline_expenses") || "[]";
    const localIncomes = localStorage.getItem("offline_incomes") || "[]";
    const backupObj = {
      expenses: JSON.parse(localExpenses),
      incomes: JSON.parse(localIncomes),
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(backupObj, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `COAB_Local_Backup_${Date.now()}.json`;
    a.click();
    addToast("Local data backup file exported.", "success");
  };

  const handleBackupImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed.expenses || parsed.incomes) {
          localStorage.setItem("offline_expenses", JSON.stringify(parsed.expenses || []));
          localStorage.setItem("offline_incomes", JSON.stringify(parsed.incomes || []));
          addToast("Backup restored successfully!", "success");
          window.dispatchEvent(new Event("local-data-update"));
        } else {
          addToast("Invalid backup file format.", "error");
        }
      } catch (err) {
        addToast("Error parsing backup contents.", "error");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      
      {/* Left Menu Selector column */}
      <div className="md:col-span-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-3 h-fit">
        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-2">Settings Segments</span>
        
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2.5 px-3 py-2 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-650 dark:text-indigo-400 font-bold rounded-xl">
            <User className="w-4 h-4" />
            <span>Profile & Account</span>
          </div>
          <div className="flex items-center gap-2.5 px-3 py-2 text-slate-500 dark:text-slate-400 font-medium rounded-xl hover:bg-slate-50 dark:hover:bg-slate-950 transition cursor-pointer">
            <Shield className="w-4 h-4" />
            <span>Security & Auth</span>
          </div>
          <div className="flex items-center gap-2.5 px-3 py-2 text-slate-500 dark:text-slate-400 font-medium rounded-xl hover:bg-slate-50 dark:hover:bg-slate-950 transition cursor-pointer">
            <Bell className="w-4 h-4" />
            <span>Notifications</span>
          </div>
        </div>
      </div>

      {/* Right Content Form Column */}
      <div className="md:col-span-2 space-y-6">
        
        {/* Profile Settings form */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-850 dark:text-slate-200 flex items-center gap-2">
            <User className="w-4.5 h-4.5 text-indigo-500" />
            <span>Personal Profile Details</span>
          </h3>

          <form onSubmit={handleProfileSave} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Username</label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-200"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full bg-slate-100 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 rounded-xl p-2.5 text-slate-400 cursor-not-allowed"
                />
              </div>
            </div>
            <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-750 text-white font-semibold rounded-xl shadow-md transition">
              Save Changes
            </button>
          </form>
        </div>

        {/* System preferences config */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-850 dark:text-slate-200 flex items-center gap-2">
            <Globe className="w-4.5 h-4.5 text-indigo-500" />
            <span>Preferences & Currency</span>
          </h3>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Default Currency</label>
              <select
                value={selectedCurrency}
                onChange={handleCurrencyChange}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-200"
              >
                <option value="INR">INR (₹) - Indian Rupee</option>
                <option value="USD">USD ($) - US Dollar</option>
                <option value="EUR">EUR (€) - Euro</option>
                <option value="GBP">GBP (£) - British Pound</option>
              </select>
            </div>
            
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Preferred Language</label>
              <select
                value={selectedLanguage}
                onChange={(e) => { setSelectedLanguage(e.target.value); localStorage.setItem("app_language", e.target.value); addToast("Language updated.", "info"); }}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-200"
              >
                <option value="en">English (US)</option>
                <option value="hi">Hindi (हिन्दी)</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
              </select>
            </div>
          </div>
        </div>

        {/* Database backup restoration */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-850 dark:text-slate-200 flex items-center gap-2">
            <Database className="w-4.5 h-4.5 text-indigo-500" />
            <span>Database Backup & Recovery</span>
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={handleBackupExport}
              className="flex items-center justify-center gap-2 py-3 px-4 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-990 border border-slate-200 dark:border-slate-850 text-slate-700 dark:text-slate-350 text-xs font-semibold rounded-2xl transition"
            >
              <Download className="w-4 h-4 text-indigo-550" />
              <span>Export local JSON</span>
            </button>

            <label className="flex items-center justify-center gap-2 py-3 px-4 border border-dashed border-indigo-200 dark:border-indigo-850 text-indigo-650 dark:text-indigo-400 text-xs font-semibold rounded-2xl hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 cursor-pointer transition">
              <Upload className="w-4 h-4" />
              <span>Import JSON Backup</span>
              <input type="file" accept=".json" onChange={handleBackupImport} className="hidden" />
            </label>
          </div>
        </div>

      </div>

    </div>
  );
}

export default SettingsView;

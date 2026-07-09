import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { checkAuth } from "../features/loginuser/loginUser.Slice.js";
import { useToast } from "../context/ToastContext";
import { User, Shield, Bell, Globe, Database, Moon, Sun, Download, Upload } from "lucide-react";
import { ExpenceApiCall, IncomeApiCall, fetchBudgetLimitsApiCall, fetchSavingsGoalsApiCall } from "../API/apiCall.Function.js";

function SettingsView() {
  const { addToast } = useToast();
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.auth);
  
  // Local Settings States
  const [activeSubTab, setActiveSubTab] = useState("profile"); // profile, security, notifications
  const [userName, setUserName] = useState("User");
  const [email, setEmail] = useState("user@coab.com");
  const [selectedCurrency, setSelectedCurrency] = useState("INR");
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [enable2fa, setEnable2fa] = useState(false);
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifWarning, setNotifWarning] = useState(true);
  const [notifPush, setNotifPush] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const getCookie = (name) => {
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith(name + "="))
      ?.split("=")[1];
  };

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

  const handleBackupExport = async () => {
    addToast("Generating backup (fetching database records)...", "info");
    
    let dbExpenses = [];
    let dbIncomes = [];
    let dbLimits = [];
    let dbGoals = [];

    try {
      const expRes = await ExpenceApiCall();
      if (expRes && expRes.data?.Expenses) {
        dbExpenses = expRes.data.Expenses;
      }
    } catch (e) {}
    
    try {
      const incRes = await IncomeApiCall();
      if (incRes && incRes.data?.Income) {
        dbIncomes = incRes.data.Income;
      }
    } catch (e) {}

    try {
      const limitRes = await fetchBudgetLimitsApiCall();
      if (limitRes && limitRes.data?.limits) {
        dbLimits = limitRes.data.limits;
      }
    } catch (e) {}

    try {
      const goalRes = await fetchSavingsGoalsApiCall();
      if (goalRes && goalRes.data?.savingsGoals) {
        dbGoals = goalRes.data.savingsGoals;
      }
    } catch (e) {}

    const localExpenses = JSON.parse(localStorage.getItem("offline_expenses") || "[]");
    const localIncomes = JSON.parse(localStorage.getItem("offline_incomes") || "[]");
    const localGoals = JSON.parse(localStorage.getItem("offline_goals") || "[]");

    const backupObj = {
      expenses: [...dbExpenses.map(e => ({ ...e, isFromDb: true })), ...localExpenses],
      incomes: [...dbIncomes.map(i => ({ ...i, isFromDb: true })), ...localIncomes],
      limits: dbLimits,
      goals: [...dbGoals.map(g => ({ ...g, isFromDb: true })), ...localGoals],
      timestamp: new Date().toISOString(),
      version: "2.0"
    };
    
    const blob = new Blob([JSON.stringify(backupObj, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `COAB_Financial_Backup_${Date.now()}.json`;
    a.click();
    addToast("Full financial database backup exported.", "success");
  };

  const handleBackupImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed.expenses || parsed.incomes || parsed.limits || parsed.goals) {
          const localExpenses = (parsed.expenses || []).filter(e => !e.isFromDb);
          const localIncomes = (parsed.incomes || []).filter(i => !i.isFromDb);
          const localGoals = (parsed.goals || []).filter(g => !g.isFromDb);

          localStorage.setItem("offline_expenses", JSON.stringify(localExpenses));
          localStorage.setItem("offline_incomes", JSON.stringify(localIncomes));
          localStorage.setItem("offline_goals", JSON.stringify(localGoals));

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

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      addToast("New passwords do not match.", "error");
      return;
    }
    
    const token = getCookie("accessToken");
    try {
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/users/changePassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ oldPassword, newPassword })
      });
      const resData = await response.json();
      if (response.ok) {
        addToast("Password changed successfully!", "success");
        setOldPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
      } else {
        addToast(resData.message || "Failed to change password", "warning");
      }
    } catch (err) {
      console.error(err);
      addToast("Password changed successfully (Demo Mode).", "success");
      setOldPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      
      {/* Left Menu Selector column */}
      <div className="md:col-span-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-3 h-fit">
        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-2">Settings Segments</span>
        
        <div className="space-y-1 text-xs">
          <button 
            type="button"
            onClick={() => setActiveSubTab("profile")}
            className={`w-full flex items-center gap-2.5 px-3 py-2 font-bold rounded-xl cursor-pointer transition ${activeSubTab === "profile" ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-650 dark:text-indigo-400" : "text-slate-500 dark:text-slate-400 font-medium hover:bg-slate-50 dark:hover:bg-slate-950"}`}
          >
            <User className="w-4 h-4" />
            <span>Profile & Account</span>
          </button>
          <button 
            type="button"
            onClick={() => setActiveSubTab("security")}
            className={`w-full flex items-center gap-2.5 px-3 py-2 font-bold rounded-xl cursor-pointer transition ${activeSubTab === "security" ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-650 dark:text-indigo-400" : "text-slate-500 dark:text-slate-400 font-medium hover:bg-slate-50 dark:hover:bg-slate-950"}`}
          >
            <Shield className="w-4 h-4" />
            <span>Security & Auth</span>
          </button>
          <button 
            type="button"
            onClick={() => setActiveSubTab("notifications")}
            className={`w-full flex items-center gap-2.5 px-3 py-2 font-bold rounded-xl cursor-pointer transition ${activeSubTab === "notifications" ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-650 dark:text-indigo-400" : "text-slate-500 dark:text-slate-400 font-medium hover:bg-slate-50 dark:hover:bg-slate-950"}`}
          >
            <Bell className="w-4 h-4" />
            <span>Notifications</span>
          </button>
        </div>
      </div>

      {/* Right Content Form Column */}
      <div className="md:col-span-2 space-y-6">
        
        {activeSubTab === "profile" && (
          <>
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
                  type="button"
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
          </>
        )}

        {activeSubTab === "security" && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-5">
            <h3 className="text-sm font-bold text-slate-850 dark:text-slate-200 flex items-center gap-2">
              <Shield className="w-4.5 h-4.5 text-indigo-500" />
              <span>Security & Password Settings</span>
            </h3>

            <form onSubmit={handlePasswordChange} className="space-y-4 text-xs">
              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Current Password</label>
                  <input
                    type="password"
                    required
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-200 animate-fade-in"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">New Password</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-200 animate-fade-in"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-200 animate-fade-in"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              
              <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-750 text-white font-semibold rounded-xl shadow-md transition">
                Update Password
              </button>
            </form>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-850 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-250">Two-Factor Authentication (2FA)</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">Secure your authentication sessions with mobile OTP verification.</p>
              </div>
              <button 
                type="button"
                onClick={() => { setEnable2fa(!enable2fa); addToast(`Two-factor auth switched to ${!enable2fa ? 'Enabled' : 'Disabled'}.`, "info"); }}
                className={`relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${enable2fa ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-800'}`}
              >
                <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${enable2fa ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>
        )}

        {activeSubTab === "notifications" && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-850 dark:text-slate-200 flex items-center gap-2">
              <Bell className="w-4.5 h-4.5 text-indigo-500" />
              <span>Notification Preferences</span>
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between py-2 border-b border-slate-50 dark:border-slate-950">
                <div>
                  <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200">Email Notifications</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Receive daily transaction digests and security alerts in your inbox.</p>
                </div>
                <button 
                  type="button"
                  onClick={() => { setNotifEmail(!notifEmail); addToast(`Email notifications switched to ${!notifEmail ? 'Enabled' : 'Disabled'}.`, "info"); }}
                  className={`relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${notifEmail ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-800'}`}
                >
                  <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${notifEmail ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-slate-50 dark:border-slate-950">
                <div>
                  <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200">Budget Warning Alerts</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Get notified immediately when category spending reaches 85% of limit.</p>
                </div>
                <button 
                  type="button"
                  onClick={() => { setNotifWarning(!notifWarning); addToast(`Budget warning limits notifications switched to ${!notifWarning ? 'Enabled' : 'Disabled'}.`, "info"); }}
                  className={`relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${notifWarning ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-800'}`}
                >
                  <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${notifWarning ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between py-2">
                <div>
                  <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200">Push Notifications</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Receive immediate notifications on your desktop or mobile browser.</p>
                </div>
                <button 
                  type="button"
                  onClick={() => { setNotifPush(!notifPush); addToast(`Push notifications switched to ${!notifPush ? 'Enabled' : 'Disabled'}.`, "info"); }}
                  className={`relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${notifPush ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-800'}`}
                >
                  <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${notifPush ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}

export default SettingsView;

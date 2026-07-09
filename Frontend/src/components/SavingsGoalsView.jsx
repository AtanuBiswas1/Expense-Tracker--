import React, { useState, useEffect } from "react";
import { format, formatDistanceToNow, addMonths } from "date-fns";
import { ShieldAlert, Laptop, Plane, Zap, Target, TrendingUp, Sparkles, CheckCircle2, AlertCircle, Plus } from "lucide-react";
import { useToast } from "../context/ToastContext";
import { 
  addSavingsGoalApiCall, 
  fetchSavingsGoalsApiCall, 
  contributeSavingsGoalApiCall, 
  deleteSavingsGoalApiCall 
} from "../API/apiCall.Function.js";

function SavingsGoalsView() {
  const { addToast } = useToast();
  const [goals, setGoals] = useState([]);
  const [currencySymbol, setCurrencySymbol] = useState("₹");
  const [newGoalTitle, setNewGoalTitle] = useState("");
  const [newGoalTarget, setNewGoalTarget] = useState("");
  const [newGoalCategory, setNewGoalCategory] = useState("Emergency Fund");
  const [isLoading, setIsLoading] = useState(true);
  
  // Confetti particles state
  const [particles, setParticles] = useState([]);
  const [triggerCount, setTriggerCount] = useState(0);

  const loadGoals = async () => {
    setIsLoading(true);
    try {
      let dbGoals = [];
      let offlineGoals = [];
      try {
        offlineGoals = JSON.parse(localStorage.getItem("offline_goals") || "[]");
      } catch (e) {}

      try {
        const res = await fetchSavingsGoalsApiCall();
        if (res && res.data?.goals) {
          dbGoals = res.data.goals;
        }
      } catch (e) {
        console.error(e);
      }

      const combined = [...dbGoals, ...offlineGoals];
      const mapped = combined.map(g => ({
        id: g._id || g.id,
        title: g.title,
        targetAmount: g.targetAmount,
        currentAmount: g.currentAmount,
        targetDate: g.targetDate ? g.targetDate.split("T")[0] : format(addMonths(new Date(), 6), "yyyy-MM-dd"),
        category: g.category,
        status: g.currentAmount >= g.targetAmount ? "completed" : "active",
        icon: g.category === "Travel" ? "Plane" : (g.category === "Car" ? "Zap" : (g.category === "Laptop" ? "Laptop" : "ShieldAlert")),
        isOffline: !g._id
      }));
      setGoals(mapped);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadGoals();
    
    const handleCurrency = (e) => {
      const symbols = { INR: "₹", USD: "$", EUR: "€", GBP: "£" };
      setCurrencySymbol(symbols[e.detail] || "₹");
    };
    window.addEventListener("currency-change", handleCurrency);
    return () => {
      window.removeEventListener("currency-change", handleCurrency);
    };
  }, []);

  // Light weight CSS Confetti explosion
  const triggerConfetti = () => {
    const newParticles = [];
    const colors = ["#4F46E5", "#22C55E", "#F59E0B", "#EF4444", "#0EA5E9", "#EC4899", "#8B5CF6"];
    
    for (let i = 0; i < 60; i++) {
      newParticles.push({
        id: `p-${triggerCount}-${i}`,
        left: 40 + Math.random() * 20, // Center cluster
        top: 40 + Math.random() * 20,
        color: colors[Math.floor(Math.random() * colors.length)],
        angle: Math.random() * 360,
        speed: 1 + Math.random() * 3,
        scale: 0.5 + Math.random() * 0.8,
        delay: Math.random() * 0.2
      });
    }
    
    setParticles(newParticles);
    setTriggerCount(prev => prev + 1);
    
    // Clear particles after animation
    setTimeout(() => {
      setParticles([]);
    }, 2500);
  };

  const handleAddGoal = async (e) => {
    e.preventDefault();
    if (!newGoalTitle.trim() || !newGoalTarget) return;

    const targetDate = format(addMonths(new Date(), 6), "yyyy-MM-dd");

    try {
      const res = await addSavingsGoalApiCall(
        newGoalTitle,
        Number(newGoalTarget),
        0,
        newGoalCategory,
        targetDate
      );
      if (res && res.success) {
        addToast(`New goal '${newGoalTitle}' created!`, "success");
        setNewGoalTitle("");
        setNewGoalTarget("");
        loadGoals();
        window.dispatchEvent(new CustomEvent("local-data-update"));
      } else {
        const offlineGoals = JSON.parse(localStorage.getItem("offline_goals") || "[]");
        offlineGoals.push({
          id: `offline-goal-${Date.now()}`,
          title: newGoalTitle,
          targetAmount: Number(newGoalTarget),
          currentAmount: 0,
          category: newGoalCategory,
          targetDate: targetDate
        });
        localStorage.setItem("offline_goals", JSON.stringify(offlineGoals));
        addToast(`New goal '${newGoalTitle}' created (Offline Mode).`, "success");
        setNewGoalTitle("");
        setNewGoalTarget("");
        loadGoals();
        window.dispatchEvent(new CustomEvent("local-data-update"));
      }
    } catch (err) {
      console.error(err);
      const offlineGoals = JSON.parse(localStorage.getItem("offline_goals") || "[]");
      offlineGoals.push({
        id: `offline-goal-${Date.now()}`,
        title: newGoalTitle,
        targetAmount: Number(newGoalTarget),
        currentAmount: 0,
        category: newGoalCategory,
        targetDate: targetDate
      });
      localStorage.setItem("offline_goals", JSON.stringify(offlineGoals));
      addToast(`New goal '${newGoalTitle}' created locally.`, "success");
      setNewGoalTitle("");
      setNewGoalTarget("");
      loadGoals();
      window.dispatchEvent(new CustomEvent("local-data-update"));
    }
  };

  const handleContribute = async (goalId) => {
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;

    const amountStr = prompt("Enter contribution amount (₹):");
    if (!amountStr || isNaN(amountStr) || Number(amountStr) <= 0) return;
    
    const amt = Number(amountStr);

    if (goal.isOffline) {
      const offlineGoals = JSON.parse(localStorage.getItem("offline_goals") || "[]");
      const targetGoal = offlineGoals.find(g => g.id === goalId);
      if (targetGoal) {
        targetGoal.currentAmount = (targetGoal.currentAmount || 0) + amt;
        localStorage.setItem("offline_goals", JSON.stringify(offlineGoals));
        addToast(`Contributed ${currencySymbol}${amt.toLocaleString()} to goal locally!`, "success");
        if (targetGoal.currentAmount >= targetGoal.targetAmount && goal.status !== "completed") {
          triggerConfetti();
          addToast("Congratulations! You've achieved your savings goal! 🏆 🎉", "success", 6000);
        }
        loadGoals();
        window.dispatchEvent(new CustomEvent("local-data-update"));
      }
      return;
    }

    try {
      const res = await contributeSavingsGoalApiCall(goalId, amt);
      if (res && res.success) {
        addToast(`Contributed ${currencySymbol}${amt.toLocaleString()} to goal!`, "success");
        
        // If target reached
        if (goal.currentAmount + amt >= goal.targetAmount && goal.status !== "completed") {
          triggerConfetti();
          addToast("Congratulations! You've achieved your savings goal! 🏆 🎉", "success", 6000);
        }
        
        loadGoals();
        window.dispatchEvent(new CustomEvent("local-data-update"));
      } else {
        const offlineGoals = JSON.parse(localStorage.getItem("offline_goals") || "[]");
        let localGoal = offlineGoals.find(g => g.id === goalId);
        if (!localGoal) {
          localGoal = {
            id: goal.id,
            title: goal.title,
            targetAmount: goal.targetAmount,
            currentAmount: goal.currentAmount,
            category: goal.category,
            targetDate: goal.targetDate
          };
          offlineGoals.push(localGoal);
        }
        localGoal.currentAmount = (localGoal.currentAmount || 0) + amt;
        localStorage.setItem("offline_goals", JSON.stringify(offlineGoals));
        addToast(`Contributed ${currencySymbol}${amt.toLocaleString()} (Offline Mode).`, "success");
        if (localGoal.currentAmount >= localGoal.targetAmount && goal.status !== "completed") {
          triggerConfetti();
          addToast("Congratulations! You've achieved your savings goal! 🏆 🎉", "success", 6000);
        }
        loadGoals();
        window.dispatchEvent(new CustomEvent("local-data-update"));
      }
    } catch (err) {
      console.error(err);
      const offlineGoals = JSON.parse(localStorage.getItem("offline_goals") || "[]");
      let localGoal = offlineGoals.find(g => g.id === goalId);
      if (!localGoal) {
        localGoal = {
          id: goal.id,
          title: goal.title,
          targetAmount: goal.targetAmount,
          currentAmount: goal.currentAmount,
          category: goal.category,
          targetDate: goal.targetDate
        };
        offlineGoals.push(localGoal);
      }
      localGoal.currentAmount = (localGoal.currentAmount || 0) + amt;
      localStorage.setItem("offline_goals", JSON.stringify(offlineGoals));
      addToast(`Contributed locally due to connection issue.`, "success");
      if (localGoal.currentAmount >= localGoal.targetAmount && goal.status !== "completed") {
        triggerConfetti();
        addToast("Congratulations! You've achieved your savings goal! 🏆 🎉", "success", 6000);
      }
      loadGoals();
      window.dispatchEvent(new CustomEvent("local-data-update"));
    }
  };

  const handleDeleteGoal = async (goalId) => {
    if (!confirm("Are you sure you want to delete this savings goal?")) return;
    
    const goal = goals.find(g => g.id === goalId);
    if (goal && goal.isOffline) {
      const offlineGoals = JSON.parse(localStorage.getItem("offline_goals") || "[]");
      const filtered = offlineGoals.filter(g => g.id !== goalId);
      localStorage.setItem("offline_goals", JSON.stringify(filtered));
      addToast("Savings goal deleted locally.", "info");
      loadGoals();
      window.dispatchEvent(new CustomEvent("local-data-update"));
      return;
    }

    try {
      const res = await deleteSavingsGoalApiCall(goalId);
      if (res && res.success) {
        addToast("Savings goal deleted.", "info");
        loadGoals();
        window.dispatchEvent(new CustomEvent("local-data-update"));
      } else {
        const offlineGoals = JSON.parse(localStorage.getItem("offline_goals") || "[]");
        const filtered = offlineGoals.filter(g => g.id !== goalId);
        localStorage.setItem("offline_goals", JSON.stringify(filtered));
        addToast("Savings goal deleted (Offline Mode).", "info");
        loadGoals();
        window.dispatchEvent(new CustomEvent("local-data-update"));
      }
    } catch (err) {
      console.error(err);
      const offlineGoals = JSON.parse(localStorage.getItem("offline_goals") || "[]");
      const filtered = offlineGoals.filter(g => g.id !== goalId);
      localStorage.setItem("offline_goals", JSON.stringify(filtered));
      addToast("Savings goal deleted locally.", "info");
      loadGoals();
      window.dispatchEvent(new CustomEvent("local-data-update"));
    }
  };

  const getGoalIcon = (iconName) => {
    switch (iconName) {
      case "Laptop": return <Laptop className="w-5 h-5 text-indigo-500" />;
      case "Plane": return <Plane className="w-5 h-5 text-sky-500" />;
      case "Zap": return <Zap className="w-5 h-5 text-amber-500" />;
      default: return <ShieldAlert className="w-5 h-5 text-emerald-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-pulse">
        {/* Left Content: Goal lists skeleton */}
        <div className="lg:col-span-2 space-y-4">
          <div className="h-4 w-48 bg-slate-300 dark:bg-slate-700 rounded-full"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex gap-3 items-center">
                  <div className="p-3 bg-slate-100 dark:bg-slate-850 rounded-xl w-10 h-10"></div>
                  <div className="space-y-2">
                    <div className="h-3.5 w-32 bg-slate-300 dark:bg-slate-700 rounded-full"></div>
                    <div className="h-2 w-20 bg-slate-200 dark:bg-slate-850 rounded-full"></div>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="h-3 w-full bg-slate-250 dark:bg-slate-800 rounded-full"></div>
                  <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-950 rounded-full"></div>
                </div>
                <div className="flex gap-2">
                  <div className="h-7 w-20 bg-slate-200 dark:bg-slate-855 rounded-lg flex-1"></div>
                  <div className="h-7 w-12 bg-slate-200 dark:bg-slate-855 rounded-lg"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Content: Add goal form skeleton */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 space-y-4 h-fit">
          <div className="h-4 w-36 bg-slate-300 dark:bg-slate-700 rounded-full"></div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-2.5 w-24 bg-slate-250 dark:bg-slate-800 rounded-full"></div>
              <div className="h-9 w-full bg-slate-100 dark:bg-slate-950 rounded-xl"></div>
            </div>
          ))}
          <div className="h-9 w-full bg-slate-300 dark:bg-slate-700 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 relative overflow-hidden">
      
      {/* Confetti Animation overlay */}
      {particles.map(p => (
        <div 
          key={p.id}
          className="absolute z-50 rounded-sm pointer-events-none"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: `${10 * p.scale}px`,
            height: `${10 * p.scale}px`,
            backgroundColor: p.color,
            transform: `rotate(${p.angle}deg)`,
            animation: `disperse 2.2s cubic-bezier(0.1, 0.8, 0.3, 1) forwards`,
            animationDelay: `${p.delay}s`
          }}
        />
      ))}

      <style>{`
        @keyframes disperse {
          0% {
            transform: translate(0, 0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translate(${(Math.random() - 0.5) * 500}px, ${Math.random() * 400 + 100}px) rotate(${Math.random() * 720}deg);
            opacity: 0;
          }
        }
      `}</style>

      {/* Main layout grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left content: Goal lists */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-indigo-50/30 dark:bg-indigo-950/10 border border-indigo-150/40 dark:border-indigo-900/50 rounded-2xl p-4 flex items-start gap-3">
            <TrendingUp className="w-5 h-5 text-indigo-500 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-indigo-900 dark:text-indigo-300">Goal calculations & updates</h4>
              <p className="text-[10px] text-slate-400 font-medium leading-relaxed mt-1">
                To specify savings allocation, click **Contribute** on any goal and enter the transfer sum. This isolates that amount from your overall balance to track the target progress.
              </p>
            </div>
          </div>

          <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <span>Savings Target Monitors</span>
            <span className="text-xs font-normal text-slate-400">({goals.filter(g => g.status === 'active').length} active)</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {goals.map(g => {
              const pct = Math.min((g.currentAmount / g.targetAmount) * 100, 100);
              const remaining = g.targetAmount - g.currentAmount;
              const isDone = g.status === "completed";

              return (
                <div key={g.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm space-y-4 relative overflow-hidden group hover:border-indigo-500/20 transition-all">
                  
                  {isDone && (
                    <div className="absolute top-0 right-0 bg-emerald-555/15 text-emerald-500 text-[8px] font-bold px-2.5 py-1 rounded-bl-xl uppercase tracking-wider flex items-center gap-1">
                      <CheckCircle2 className="w-2.5 h-2.5" />
                      <span>Achieved</span>
                    </div>
                  )}

                  <div className="flex gap-3 items-center">
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850">
                      {getGoalIcon(g.icon)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 dark:text-slate-250 truncate w-36">{g.title}</h4>
                      <p className="text-[10px] text-slate-400 font-medium">Target: {g.targetDate}</p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-semibold text-slate-500">
                      <span>Progress: {pct.toFixed(0)}%</span>
                      <span>{currencySymbol}{g.currentAmount.toLocaleString()} / {currencySymbol}{g.targetAmount.toLocaleString()}</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-50 dark:bg-slate-950 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-700 ${isDone ? 'bg-gradient-to-r from-emerald-400 to-teal-500' : 'bg-gradient-to-r from-indigo-500 to-purple-500'}`} 
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex gap-2.5 pt-1">
                    <button
                      onClick={() => handleContribute(g.id)}
                      disabled={isDone}
                      className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-950 dark:hover:bg-slate-990 border border-slate-200/80 dark:border-slate-850 text-slate-700 dark:text-slate-350 text-[10px] font-semibold rounded-lg transition disabled:opacity-40"
                    >
                      Contribute
                    </button>
                    <button
                      onClick={() => handleDeleteGoal(g.id)}
                      className="py-1.5 px-2 bg-rose-50 hover:bg-rose-100 text-rose-500 rounded-lg text-[10px] transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Content: Add goal form */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4 h-fit">
          <span className="text-sm font-bold text-slate-750 dark:text-slate-350 block">Create Savings Goal</span>
          
          <form onSubmit={handleAddGoal} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Goal Description</label>
              <input
                type="text"
                placeholder="e.g. Dream Laptop M4, Emergency Reserve"
                required
                value={newGoalTitle}
                onChange={(e) => setNewGoalTitle(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 text-xs border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Target Amount ({currencySymbol})</label>
              <input
                type="number"
                placeholder="e.g. 50000"
                required
                value={newGoalTarget}
                onChange={(e) => setNewGoalTarget(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 text-xs border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Goal Category</label>
              <select
                value={newGoalCategory}
                onChange={(e) => setNewGoalCategory(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 text-xs border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-indigo-500"
              >
                <option value="Emergency Fund">Emergency Fund</option>
                <option value="Travel">Travel & Trip</option>
                <option value="House">House & Home</option>
                <option value="Car">Electric Vehicle / Car</option>
                <option value="Laptop">Computer / Gadget</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-750 text-white text-xs font-semibold rounded-xl shadow-lg transition transform active:scale-95 flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Launch Goal</span>
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}

export default SavingsGoalsView;

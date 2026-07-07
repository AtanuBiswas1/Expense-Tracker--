import React, { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

// SVG Icons for different Toast Types
const ToastIcon = ({ type }) => {
  switch (type) {
    case "success":
      return (
        <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case "error":
      return (
        <svg className="w-5 h-5 text-rose-450" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case "warning":
      return (
        <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      );
    case "info":
    default:
      return (
        <svg className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
  }
};

const ToastItem = ({ id, message, type, duration, onRemove }) => {
  const [isExiting, setIsExiting] = useState(false);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onRemove(id);
    }, 300); // match fade-out animation duration
  };

  // Color theme classes for each type
  const themeClasses = {
    success: "bg-slate-950/80 border-emerald-500/35 shadow-emerald-950/10 hover:border-emerald-500/50",
    error: "bg-slate-950/80 border-rose-500/35 shadow-rose-950/10 hover:border-rose-500/50",
    warning: "bg-slate-950/80 border-amber-500/35 shadow-amber-950/10 hover:border-amber-500/50",
    info: "bg-slate-950/80 border-teal-500/35 shadow-teal-950/10 hover:border-teal-500/50",
  };

  const progressColors = {
    success: "bg-gradient-to-r from-emerald-500 to-teal-500",
    error: "bg-gradient-to-r from-rose-500 to-red-500",
    warning: "bg-gradient-to-r from-amber-500 to-orange-500",
    info: "bg-gradient-to-r from-teal-500 to-cyan-500",
  };

  return (
    <div
      className={`relative w-80 backdrop-blur-xl border p-4.5 rounded-2xl flex gap-3.5 shadow-2xl transition-all duration-300 pointer-events-auto transform hover:scale-[1.02] ${
        themeClasses[type]
      } ${
        isExiting
          ? "opacity-0 translate-x-12 scale-95"
          : "opacity-100 translate-x-0 scale-100 animate-slide-in"
      }`}
      style={{
        animation: "slideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      }}
    >
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(24px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }
        @keyframes shrinkWidth {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>

      {/* Progress Bar */}
      <div
        className={`absolute bottom-0 left-0 h-[3px] rounded-b-2xl ${progressColors[type]}`}
        style={{
          animation: `shrinkWidth ${duration}ms linear forwards`,
        }}
      />

      <div className="flex-shrink-0 mt-0.5">
        <ToastIcon type={type} />
      </div>

      <div className="flex-grow flex flex-col justify-center">
        <p className="text-slate-200 text-sm font-medium leading-relaxed select-none">
          {message}
        </p>
      </div>

      <button
        onClick={handleClose}
        className="flex-shrink-0 self-start text-slate-500 hover:text-slate-350 p-1 hover:bg-slate-900/50 rounded-lg transition-colors duration-200"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          id={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onRemove={removeToast}
        />
      ))}
    </div>
  );
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "info", duration = 4000) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type, duration }]);
    
    setTimeout(() => {
      // Direct removal from container handling is triggered inside ToastItem's timer
      // but we schedule cleanup here too to ensure state is clean
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, duration + 500); // slightly longer to allow fade-out transitions
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

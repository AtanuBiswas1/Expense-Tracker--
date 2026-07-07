import React, { useState, useEffect, useRef } from "react";
import { aiAnalyzeApiCall } from "../API/apiCall.Function.js";

function AiAdvisor() {
  const [loading, setLoading] = useState(true);
  const [chatLoading, setChatLoading] = useState(false);
  const [data, setData] = useState(null);
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Hello! I am COAB AI, your financial assistant. How can I help you manage your budget today?",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const chatEndRef = useRef(null);

  const fetchAIAnalysis = async () => {
    setLoading(true);
    try {
      const response = await aiAnalyzeApiCall();
      if (response && response.data) {
        setData(response.data);
      }
    } catch (err) {
      console.error("Failed to load AI Analysis:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAIAnalysis();
  }, []);

  useEffect(() => {
    // Scroll to bottom of chat
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, chatLoading]);

  const handleSendMessage = async (textToSend) => {
    const text = textToSend || inputMessage;
    if (!text.trim()) return;

    setMessages((prev) => [...prev, { sender: "user", text }]);
    setInputMessage("");
    setChatLoading(true);

    try {
      const response = await aiAnalyzeApiCall(text);
      if (response && response.data && response.data.chatResponse) {
        setMessages((prev) => [...prev, { sender: "ai", text: response.data.chatResponse }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { sender: "ai", text: "I ran into a problem analyzing that. Please try again in a moment!" },
        ]);
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "Sorry, I'm having trouble connecting right now." },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  // Radial Score Calculations
  const score = data?.score || 50;
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  // Quick Prompt Chips
  const quickPrompts = [
    "How can I save more?",
    "Analyze my spending",
    "Am I doing okay?",
  ];

  return (
    <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-6 shadow-2xl space-y-6 flex flex-col h-[700px] hover:border-slate-700/40 transition-colors duration-300">
      <div>
        <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-teal-500"></span>
          </span>
          COAB AI Advisor
        </h3>
        <p className="text-xs text-slate-400 mt-1">Smart personalized suggestions based on your transactions</p>
      </div>

      {loading ? (
        <div className="flex-grow flex flex-col justify-center items-center gap-3">
          <svg className="animate-spin h-8 w-8 text-teal-400" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="text-sm text-slate-450 font-medium animate-pulse">Running financial analysis...</span>
        </div>
      ) : (
        <>
          {/* Health Score and Summary Header */}
          <div className="bg-slate-950/40 border border-slate-800/50 p-4 rounded-2xl flex items-center gap-4">
            {/* SVG Radial Gauge */}
            <div className="relative flex-shrink-0 flex items-center justify-center">
              <svg className="w-18 h-18 transform -rotate-90">
                <circle cx="36" cy="36" r={radius} className="stroke-slate-800" strokeWidth="6" fill="transparent" />
                <circle
                  cx="36"
                  cy="36"
                  r={radius}
                  className="stroke-teal-400 transition-all duration-1000 ease-out"
                  strokeWidth="6"
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-lg font-extrabold text-teal-400">{score}</span>
                <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">Health</span>
              </div>
            </div>

            <div className="flex-grow">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Summary</p>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {data?.summary || "Add some incomes and expenses to see your personalized status dashboard!"}
              </p>
            </div>
          </div>

          {/* AI Alerts / Recommendations list */}
          <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
            {data?.savingsAlert && (
              <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-3 text-xs text-rose-450 flex items-start gap-2.5">
                <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>{data.savingsAlert}</span>
              </div>
            )}
            {data?.recommendations?.map((rec, index) => (
              <div key={index} className="bg-slate-950/30 border border-slate-850/50 rounded-xl p-3 text-xs text-slate-350 flex items-start gap-2.5">
                <svg className="w-4 h-4 mt-0.5 text-teal-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{rec}</span>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="border-t border-slate-800/80"></div>

          {/* Interactive Chat Log */}
          <div className="flex-grow flex flex-col min-h-0">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Advisor Chat Console</span>
            
            <div className="flex-grow overflow-y-auto space-y-3 pr-1 mb-3 scrollbar-thin">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-teal-500 text-slate-950 font-medium rounded-tr-none shadow-md shadow-teal-500/5"
                        : "bg-slate-950/50 border border-slate-800/60 text-slate-300 rounded-tl-none"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {chatLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-950/50 border border-slate-800/60 text-slate-350 rounded-2xl rounded-tl-none px-4 py-2.5 flex items-center gap-2">
                    <span className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">COAB Thinking</span>
                    <div className="flex gap-1 items-center mt-0.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-teal-450 animate-bounce" />
                      <div className="w-1.5 h-1.5 rounded-full bg-teal-450 animate-bounce [animation-delay:0.2s]" />
                      <div className="w-1.5 h-1.5 rounded-full bg-teal-450 animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick Suggestions Chips */}
            <div className="flex flex-wrap gap-2 mb-3">
              {quickPrompts.map((prompt, i) => (
                <button
                  key={i}
                  disabled={chatLoading}
                  onClick={() => handleSendMessage(prompt)}
                  className="px-3 py-1.5 text-[10px] font-semibold bg-slate-850 hover:bg-slate-800 text-slate-350 hover:text-slate-100 border border-slate-800 hover:border-slate-700/60 rounded-full transition-all duration-250 cursor-pointer disabled:opacity-50"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <div className="relative flex items-center">
              <input
                type="text"
                value={inputMessage}
                disabled={chatLoading}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask COAB anything about your finances..."
                className="w-full bg-slate-950/60 border border-slate-800/80 rounded-xl py-3 pl-4 pr-12 text-xs text-slate-200 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 placeholder-slate-500"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={chatLoading || !inputMessage.trim()}
                className="absolute right-2 p-2 text-teal-400 hover:text-teal-350 disabled:text-slate-650 transition-colors duration-250"
              >
                <svg className="w-4 h-4 transform rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default AiAdvisor;

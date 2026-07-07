import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { ExpenceApiCall, IncomeApiCall } from "../../API/apiCall.Function.js";
import BarChart from "./BarChart.jsx";
import PieChart from "./PieChart.jsx";
import LineChart from "./LineChart.jsx";
import { useDispatch } from "react-redux";
import {
  setTotalIncome,
  setTotalExpense,
} from "../../features/apiDate/apiData.Slice.js";

function Chart() {
  const [rawExpenses, setRawExpenses] = useState([]);
  const [rawIncomes, setRawIncomes] = useState([]);
  const [groupingBasis, setGroupingBasis] = useState("days"); // "days" | "month" | "year"
  const dispatch = useDispatch();

  // Fetch all data from backend (no date/month/year query filters, to get complete history)
  const fetchDataForExpenses = async () => {
    try {
      const response = await ExpenceApiCall("", "", "");
      const ExpensesData = response?.data?.Expenses || [];
      if (response && response.message) {
        dispatch(setTotalExpense(response.message.TotalExpence || 0));
      }
      setRawExpenses(ExpensesData);
    } catch (error) {
      console.error("Error fetching expenses for chart:", error);
    }
  };

  const fetchDataForIncome = async () => {
    try {
      const response = await IncomeApiCall("", "", "");
      const IncomesData = response?.data?.Income || [];
      if (response && response.message) {
        dispatch(setTotalIncome(response?.message?.TotalIncome || 0));
      }
      setRawIncomes(IncomesData);
    } catch (error) {
      console.error("Error fetching income for chart:", error);
    }
  };

  useEffect(() => {
    fetchDataForExpenses();
    fetchDataForIncome();
  }, []);

  // Aggregation logic on client-side
  const getAggregatedData = () => {
    const formatKey = (dateVal) => {
      if (!dateVal) return "";
      const d = new Date(dateVal);
      if (isNaN(d.getTime())) return "";

      if (groupingBasis === "days") {
        return format(d, "yyyy-MM-dd");
      } else if (groupingBasis === "month") {
        return format(d, "yyyy-MM");
      } else {
        return format(d, "yyyy");
      }
    };

    const grouped = {};

    rawExpenses.forEach((item) => {
      const key = formatKey(item.date || item.createdAt);
      if (!key) return;
      if (!grouped[key]) {
        grouped[key] = { key, income: 0, expenses: 0 };
      }
      grouped[key].expenses += item.amount || 0;
    });

    rawIncomes.forEach((item) => {
      const key = formatKey(item.date || item.createdAt);
      if (!key) return;
      if (!grouped[key]) {
        grouped[key] = { key, income: 0, expenses: 0 };
      }
      grouped[key].income += item.amount || 0;
    });

    const dataArray = Object.values(grouped);
    
    // Sort chronologically
    dataArray.sort((a, b) => a.key.localeCompare(b.key));

    // Format output display labels and return
    return dataArray
      .filter((item) => item.income !== 0 || item.expenses !== 0)
      .map((item) => {
        let displayLabel = item.key;
        try {
          if (groupingBasis === "days") {
            const d = new Date(item.key + "T00:00:00");
            displayLabel = format(d, "dd MMM yyyy");
          } else if (groupingBasis === "month") {
            const parts = item.key.split("-");
            const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, 1);
            displayLabel = format(d, "MMM yyyy");
          }
        } catch (e) {
          console.error("Error formatting date label:", e);
        }

        return {
          month: displayLabel, // Keep property as 'month' to prevent breaking chart label mapping
          income: item.income,
          expenses: item.expenses,
        };
      });
  };

  const AllDataofIncomeExpenses = getAggregatedData();

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8 space-y-8">
      {/* Header section with view toggle */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Analytics & Trends</h2>
          <p className="text-sm text-slate-500">Visual representations of your balance, income, and expenditures</p>
        </div>
        
        {/* Dropdown Selector */}
        <div className="flex items-center gap-3 bg-white border border-slate-200 px-4 py-2.5 rounded-xl shadow-sm">
          <label htmlFor="groupingBasis" className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
            View By:
          </label>
          <select
            id="groupingBasis"
            value={groupingBasis}
            className="bg-transparent text-slate-700 font-semibold text-sm outline-none cursor-pointer"
            onChange={(e) => setGroupingBasis(e.target.value)}
          >
            <option value="days" className="bg-white text-slate-800">Days</option>
            <option value="month" className="bg-white text-slate-800">Month</option>
            <option value="year" className="bg-white text-slate-800">Year</option>
          </select>
        </div>
      </div>

      {/* Charts */}
      <div className="w-full bg-white border border-slate-200/80 rounded-3xl p-6 shadow-md transition-all duration-300 hover:border-slate-300/80">
        <LineChart AllDataofIncomeExpenses={AllDataofIncomeExpenses} groupingBasis={groupingBasis} />
      </div>

      <div className="flex justify-center">
        <PieChart AllDataofIncomeExpenses={AllDataofIncomeExpenses} />
      </div>

      <div className="w-full bg-white border border-slate-200/80 rounded-3xl p-6 shadow-md transition-all duration-300 hover:border-slate-300/80">
        <BarChart AllDataofIncomeExpenses={AllDataofIncomeExpenses} groupingBasis={groupingBasis} />
      </div>
    </div>
  );
}

export default Chart;

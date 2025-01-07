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
  const [monthlyExpensesData, setMonthlyExpensesData] = useState([]);
  const [monthlyIncomesData, setMonthlyIncomessData] = useState([]);
  const [selectedmonth, setMonth] = useState("");
  const dispatch = useDispatch();

  const Months = [
    "Select",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "July",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Fetch data from backend
  const fetchDataForExpenses = async () => {
    const response = await ExpenceApiCall("", selectedmonth, 2025); 
    const ExpensesData = await response?.data?.Expenses;
    if (response) {
      dispatch(setTotalExpense(response.message.TotalExpence));
    }
    // Process data for monthly and yearly
    const groupedByMonth = ExpensesData.reduce((acc, expense) => {
      const month = format(new Date(expense.date), "yyyy-MM");
      acc[month] = (acc[month] || 0) + expense.amount;
      return acc;
    }, {});

    setMonthlyExpensesData(
      Object.entries(groupedByMonth).map(([key, value]) => ({
        month: key,
        amount: value,
      }))
    );
  };

  const fetchDataForIncome = async () => {
    const response = await IncomeApiCall("", selectedmonth, 2025); 
    const IncomesData = await response?.data?.Income;
    if (response) {
      dispatch(setTotalIncome(response?.message?.TotalIncome));
    }
    // Process data for monthly and yearly
    const groupedByMonth = IncomesData.reduce((acc, Income) => {
      const month = format(new Date(Income.createdAt), "yyyy-MM");
      acc[month] = (acc[month] || 0) + Income.amount;
      return acc;
    }, {});

    setMonthlyIncomessData(
      Object.entries(groupedByMonth).map(([key, value]) => ({
        month: key,
        amount: value,
      }))
    );
  };

  useEffect(() => {
    fetchDataForExpenses();
    fetchDataForIncome();
  }, [selectedmonth]);

  // Generate sequential months from start to end
  const generateMonths = (start, end) => {
    const months = [];
    const startDate = new Date(`${start}-01`);
    const endDate = new Date(`${end}-01`);
    while (startDate <= endDate) {
      const year = startDate.getFullYear();
      const month = String(startDate.getMonth() + 1).padStart(2, "0");
      months.push(`${year}-${month}`);
      startDate.setMonth(startDate.getMonth() + 1);
    }
    return months;
  };

  // Merge and group data
  const mergeData = (incomeData, expensesData, allMonths) => {
    const combinedData = [
      ...incomeData.map((item) => ({ ...item, type: "income" })),
      ...expensesData.map((item) => ({ ...item, type: "expenses" })),
    ];

    const groupedData = combinedData.reduce((acc, item) => {
      const { month, amount, type } = item;
      if (!acc[month]) {
        acc[month] = { month, income: 0, expenses: 0 };
      }
      acc[month][type] += amount;
      return acc;
    }, {});

    // Ensure all months are present with default values
    return allMonths.map(
      (month) => groupedData[month] || { month, income: 0, expenses: 0 }
    );
  };

  // Define the date range
  const startMonth = "2024-01";
  const currentDate = new Date();
  const endMonth = `${currentDate.getFullYear()}-${String(
    currentDate.getMonth() + 1
  ).padStart(2, "0")}`;

  // Generate all months from start to current month
  const allMonths = generateMonths(startMonth, endMonth);

  let AllDataofIncomeExpenses = mergeData(
    monthlyIncomesData,
    monthlyExpensesData,
    allMonths
  );
  AllDataofIncomeExpenses = AllDataofIncomeExpenses.filter(
    (item) => item.income !== 0 || item.expenses !== 0
  );

  return (
    <div className="my-4 md:w-[70%]">
      {/* <div className="bg-slate-200 rounded-lg px-2 py-1">
          <label htmlFor="month">Search using Month</label>
          <select
            id="month"
            value={selectedmonth}
            className="bg-blue-600 rounded-2xl p-1"
            onChange={(event) => setMonth(Months.indexOf(event.target.value))}
          >
            {Months.map((month, key) => (
              <option key={key}>{month}</option>
            ))}
          </select>
        </div> */}

      <div className="flex w-[100%] flex-col sm:flex-row">
        <BarChart AllDataofIncomeExpenses={AllDataofIncomeExpenses} />
        <PieChart AllDataofIncomeExpenses={AllDataofIncomeExpenses} />
      </div>

      <div className=" rounded-3xl px-3 py-5 mx-5 my-5 shadow-2xl">
        <LineChart AllDataofIncomeExpenses={AllDataofIncomeExpenses} />
      </div>
    </div>
  );
}

export default Chart;

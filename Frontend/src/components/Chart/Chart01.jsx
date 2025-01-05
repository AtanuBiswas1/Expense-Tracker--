import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { ExpenceApiCall, IncomeApiCall } from "../../API/apiCall.Function.js";
import BarChart from "./BarChart.jsx";
import PieChart from "./PieChart.jsx";
import LineChart from "./LineChart.jsx";

function Chart() {
  const [monthlyExpensesData, setMonthlyExpensesData] = useState([]);
  const [monthlyIncomesData, setMonthlyIncomessData] = useState([]);

  useEffect(() => {
    // Fetch data from backend
    const fetchDataForExpenses = async () => {
      const response = await ExpenceApiCall(); // Replace with your API endpoint
      const ExpensesData = await response?.data?.Expenses;
      console.log("Expenses Data:",response)
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
      const response = await IncomeApiCall(); // Replace with your API endpoint
      const IncomesData = await response?.data?.Income;

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

    fetchDataForExpenses();
    fetchDataForIncome();
  }, []);

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
    <div>
      <div className="flex bg-gray-900 h-[600px]">
        <BarChart AllDataofIncomeExpenses={AllDataofIncomeExpenses} />
        <PieChart AllDataofIncomeExpenses={AllDataofIncomeExpenses} />
      </div>

      <div>
        <LineChart AllDataofIncomeExpenses={AllDataofIncomeExpenses} />
      </div>
    </div>
  );
}

export default Chart;

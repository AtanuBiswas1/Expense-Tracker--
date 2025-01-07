import React from "react";
import {Pie} from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

// Pie Chart Component
const PieChart = ({ AllDataofIncomeExpenses }) => {
  const totalIncome = AllDataofIncomeExpenses.reduce(
    (acc, curr) => acc + curr.income,
    0
  );
  const totalExpenses = AllDataofIncomeExpenses.reduce(
    (acc, curr) => acc + curr.expenses,
    0
  );

  const data = {
    labels: ["Income", "Expenses"],
    datasets: [
      {
        data: [totalIncome, totalExpenses],
        // backgroundColor: ["rgba(75, 192, 192, 0.6)", "rgba(255, 99, 132, 0.6)"],
        // borderColor: ["rgba(75, 192, 192, 1)", "rgba(255, 99, 132, 1)"],
        // borderWidth: 1,
        backgroundColor: [
          "rgba(75, 192, 192, 0.8)", // Income
          "rgba(255, 99, 132, 0.8)", // Expenses
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)",
          "rgba(255, 99, 132, 1)",
        ],
        borderWidth: 2,
        hoverBackgroundColor: [
          "rgba(75, 192, 192, 1)",
          "rgba(255, 99, 132, 1)",
        ],
        hoverBorderColor: [
          "rgba(75, 192, 192, 1)",
          "rgba(255, 99, 132, 1)",
        ],
        hoverOffset: 10, // Enlarge segments on hover
      },
      
    ],
  };

  // const options = {
  //   responsive: true,
  //   plugins: {
  //     legend: { position: "top" },
  //     title: { display: true, text: "Total Income vs. Expenses" },
  //   },
  // };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          font: {
            size: 14,
            weight: "500",
          },
          color: "#333",
        },
      },
      title: {
        display: true,
        text: "Income vs Expenses Overview",
        font: {
          size: 20,
          weight: "bold",
        },
        color: "#444",
        padding: 20,
      },
      tooltip: {
        backgroundColor: "#fff",
        titleColor: "#000",
        titleFont: { size: 16, weight: "bold" },
        bodyColor: "#333",
        bodyFont: { size: 14 },
        borderColor: "#ccc",
        borderWidth: 1,
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)", // Tooltip shadow
      },
    },
  };


  return (
    <div className="w-[40%] rounded-3xl px-3 py-5 mx-5 shadow-2xl">
    
      <Pie data={data} options={options} />
    </div>
  );
};

export default PieChart;

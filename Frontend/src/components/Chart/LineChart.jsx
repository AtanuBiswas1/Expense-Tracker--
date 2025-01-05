import React from "react";
import { Line } from "react-chartjs-2";
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

const LineChart = ({ AllDataofIncomeExpenses }) => {
  const data = {
    labels: AllDataofIncomeExpenses.map((data) => data.month),
    datasets: [
      {
        label: "Income",
        data: AllDataofIncomeExpenses.map((data) => data.income),
        borderColor: "rgba(75, 192, 192, 1)",
        fill: false,
        tension: 0.4,
      },
      {
        label: "Expenses",
        data: AllDataofIncomeExpenses.map((data) => data.expenses),
        borderColor: "rgba(255, 99, 132, 1)",
        fill: false,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Income vs. Expenses Trend" },
    },
    scales: {
      x: { title: { display: true, text: "Months" } },
      y: {
        title: { display: true, text: "Amount (in USD)" },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="h-[400px]">
      <Line data={data} options={options} />
    </div>
  );
};

export default LineChart;

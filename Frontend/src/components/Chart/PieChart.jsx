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
        backgroundColor: ["rgba(75, 192, 192, 0.6)", "rgba(255, 99, 132, 0.6)"],
        borderColor: ["rgba(75, 192, 192, 1)", "rgba(255, 99, 132, 1)"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Total Income vs. Expenses" },
    },
  };

  return (
    <div className="w-[400px] h-[400px]">
      <Pie data={data} options={options} />
    </div>
  );
};

export default PieChart;

import React from "react";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Radar } from "react-chartjs-2";

// Register the necessary components
ChartJS.register(
  RadialLinearScale, // for Radar chart scale
  PointElement, // for data points in radar chart
  LineElement, // for line connecting points
  Title,
  Tooltip,
  Legend
);

const RadarChart = ({ AllDataofIncomeExpenses }) => {
  const data = {
    labels: AllDataofIncomeExpenses.map((data) => data.month), // x-axis labels
    datasets: [
      {
        label: "Income",
        data: AllDataofIncomeExpenses.map((data) => data.income),
        backgroundColor: "rgba(75, 192, 192, 0.3)", // Transparency for background
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 2,
        pointBackgroundColor: "rgba(75, 192, 192, 1)",
        pointBorderColor: "#fff",
        pointRadius: 5,
      },
      {
        label: "Expenses",
        data: AllDataofIncomeExpenses.map((data) => data.expenses),
        backgroundColor: "rgba(255, 99, 132, 0.3)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 2,
        pointBackgroundColor: "rgba(255, 99, 132, 1)",
        pointBorderColor: "#fff",
        pointRadius: 5,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
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
        text: "Income vs Expenses (Radar Chart)",
        font: {
          size: 20,
          weight: "bold",
        },
        color: "#444",
        padding: 20,
      },
    },
  };

  return (
    // <div className=" sm:w-[60%] rounded-3xl px-3 py-5 mx-5 shadow-2xl transition-all duration-500 hover:scale-105 animate__animated animate__fadeIn">
    //   <Radar data={data} options={options} />
    // </div>
    <div className="w-full sm:w-[60%] rounded-3xl px-4 sm:px-6 py-6 mx-auto my-5 shadow-2xl transition-all duration-500 hover:scale-105 animate__animated animate__fadeIn">
      <Radar data={data} options={options} />
    </div>
  );
};

export default RadarChart;

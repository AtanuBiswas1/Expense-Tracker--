import React, { useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement,
} from "chart.js";
import { Bar, Line, Pie, Radar } from "react-chartjs-2"; // Removed Doughnut import as it wasn't being used.

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement
);

const BarChart = ({ AllDataofIncomeExpenses, groupingBasis }) => {
  const data = {
    labels: AllDataofIncomeExpenses.map((data2) => data2.month),
    datasets: [
      {
        label: "Income",
        data: AllDataofIncomeExpenses.map((data2) => data2.income),
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return "rgba(45, 212, 191, 0.15)";
          const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, "rgba(45, 212, 191, 0.85)");
          gradient.addColorStop(1, "rgba(45, 212, 191, 0.15)");
          return gradient;
        },
        borderColor: "rgba(45, 212, 191, 1)",
        borderWidth: 1.5,
        borderRadius: 6,
        borderSkipped: false,
        hoverBackgroundColor: "rgba(45, 212, 191, 1)"
      },
      {
        label: "Expenses",
        data: AllDataofIncomeExpenses.map((data2) => data2.expenses),
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return "rgba(244, 63, 94, 0.15)";
          const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, "rgba(244, 63, 94, 0.85)");
          gradient.addColorStop(1, "rgba(244, 63, 94, 0.15)");
          return gradient;
        },
        borderColor: "rgba(244, 63, 94, 1)",
        borderWidth: 1.5,
        borderRadius: 6,
        borderSkipped: false,
        hoverBackgroundColor: "rgba(244, 63, 94, 1)"
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            size: 13,
            weight: "600",
            family: "'Outfit', sans-serif",
          },
          color: "#475569",
          usePointStyle: true,
          padding: 15,
        },
      },
      title: {
        display: true,
        text: `Income vs Expenses (${groupingBasis === 'days' ? 'Daily' : groupingBasis === 'year' ? 'Yearly' : 'Monthly'} Breakdown)`,
        font: {
          size: 16,
          weight: "700",
          family: "'Outfit', sans-serif",
        },
        color: "#1e293b",
        padding: { bottom: 20 },
      },
      tooltip: {
        backgroundColor: "#0f172a",
        titleFont: { family: "'Outfit', sans-serif", size: 13, weight: "bold" },
        bodyFont: { family: "'Inter', sans-serif", size: 12 },
        borderColor: "rgba(148, 163, 184, 0.1)",
        borderWidth: 1,
        padding: 12,
        cornerRadius: 12,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#475569",
          font: { family: "'Inter', sans-serif", size: 11 },
        },
      },
      y: {
        grid: {
          color: "rgba(148, 163, 184, 0.18)",
          drawBorder: false,
        },
        ticks: {
          color: "#475569",
          font: { family: "'Inter', sans-serif", size: 11 },
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="h-[320px] w-full">
      <Bar data={data} options={options} />
    </div>
  );
};

export default BarChart;

// // import React, { useEffect } from "react";
// // import {
// //   Chart as ChartJS,
// //   CategoryScale,
// //   LinearScale,
// //   BarElement,
// //   Title,
// //   Tooltip,
// //   Legend,
// //   ArcElement,
// //   LineElement,
// //   PointElement,
// // } from "chart.js";
// // import { Bar, Line, Pie, Doughnut, Radar } from "react-chartjs-2";

// // ChartJS.register(
// //   CategoryScale,
// //   LinearScale,
// //   BarElement,
// //   ArcElement,
// //   Title,
// //   Tooltip,
// //   Legend,
// //   LineElement,
// //   PointElement
// // );

// // const BarChart = ({ AllDataofIncomeExpenses }) => {
// //   const data = {
// //     labels: AllDataofIncomeExpenses.map((data) => data.month), // x-axis labels
// //     datasets: [
// //       {
// //         label: "Income", // Dataset 1
// //         data: AllDataofIncomeExpenses.map((data) => data.income),
// //         backgroundColor: "rgba(75, 192, 192, 0.6)", // Styling for Income
// //         borderColor: "rgba(75, 192, 192, 1)",
// //         borderWidth: 1,
// //         hoverBackgroundColor: "rgba(75, 192, 192, 1)",
// //         hoverBorderColor: "rgba(75, 192, 192, 1)",
// //       },
// //       {
// //         label: "Expenses", // Dataset 2
// //         data: AllDataofIncomeExpenses.map((data) => data.expenses),
// //         backgroundColor: "rgba(255, 99, 132, 0.6)", // Styling for Expenses
// //         borderColor: "rgba(255, 99, 132, 1)",
// //         borderWidth: 1,
// //         hoverBackgroundColor: "rgba(255, 99, 132, 1)",
// //         hoverBorderColor: "rgba(255, 99, 132, 1)",
// //       },
// //     ],
// //   };

// //   const options = {
// //     responsive: true,
// //     plugins: {
// //       legend: {
// //         position: "top",
// //         labels: {
// //           font: {
// //             size: 14,
// //             weight: "500",
// //           },
// //           color: "#333",
// //         },
// //       },
// //       title: {
// //         display: true,
// //         text: "Income vs Expenses (Monthly)",
// //         font: {
// //           size: 20,
// //           weight: "bold",
// //         },
// //         color: "#444",
// //         padding: 20,
// //       },
// //     },
// //     scales: {
// //       x: {
// //         title: {
// //           display: true,
// //           text: "Months",
// //           font: {
// //             size: 16,
// //           },
// //           color: "#666",
// //         },
// //       },
// //       y: {
// //         title: {
// //           display: true,
// //           text: "Amount (in USD)",
// //           font: {
// //             size: 16,
// //           },
// //           color: "#666",
// //         },
// //         beginAtZero: true,
// //       },
// //     },
// //   };

// //   return (
// //     // <div className="w-[60%] rounded-3xl px-3 py-5 mx-5 shadow-2xl">

// //     //   <Bar data={data} options={options} />
// //     // </div>
// //     <div className="w-full sm:w-[60%] rounded-3xl px-3 py-5 mx-5 shadow-2xl transition-all duration-500 hover:scale-105 animate__animated animate__fadeIn">
// //       <Bar data={data} options={options} />
// //     </div>
// //   );
// // };

// // export default BarChart;












  

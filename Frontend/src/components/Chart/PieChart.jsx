import React from "react";
import { Doughnut } from "react-chartjs-2";
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
        backgroundColor: [
          "rgba(45, 212, 191, 0.8)", // Glowing Teal
          "rgba(244, 63, 94, 0.8)", // Glowing Rose
        ],
        borderColor: ["rgba(45, 212, 191, 1)", "rgba(244, 63, 94, 1)"],
        borderWidth: 2,
        hoverBackgroundColor: [
          "rgba(45, 212, 191, 1)",
          "rgba(244, 63, 94, 1)",
        ],
        hoverBorderColor: ["rgba(45, 212, 191, 1)", "rgba(244, 63, 94, 1)"],
        hoverOffset: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "75%", // Sleek ring layout
    plugins: {
      legend: {
        position: "bottom",
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
        text: "Income vs Expenses Overview",
        font: {
          size: 16,
          weight: "700",
          family: "'Outfit', sans-serif",
        },
        color: "#1e293b",
        padding: 15,
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
  };

  return (
    <div className="w-full lg:w-[50%] bg-white border border-slate-200/80 rounded-3xl px-6 py-6 shadow-md transition-all duration-300 hover:border-slate-300/80">
      <div className="h-[260px] w-full flex justify-center">
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
};

export default PieChart;

// import React from "react";
// import { Pie } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
//   ArcElement,
//   PointElement,
//   LineElement,
// } from "chart.js";

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
//   ArcElement,
//   PointElement,
//   LineElement
// );

// // Pie Chart Component
// const PieChart = ({ AllDataofIncomeExpenses }) => {
//   const totalIncome = AllDataofIncomeExpenses.reduce(
//     (acc, curr) => acc + curr.income,
//     0
//   );
//   const totalExpenses = AllDataofIncomeExpenses.reduce(
//     (acc, curr) => acc + curr.expenses,
//     0
//   );

//   const data = {
//     labels: ["Income", "Expenses"],
//     datasets: [
//       {
//         data: [totalIncome, totalExpenses],

//         backgroundColor: [
//           "rgba(75, 192, 192, 0.8)", // Income
//           "rgba(255, 99, 132, 0.8)", // Expenses
//         ],
//         borderColor: ["rgba(75, 192, 192, 1)", "rgba(255, 99, 132, 1)"],
//         borderWidth: 2,
//         hoverBackgroundColor: [
//           "rgba(75, 192, 192, 1)",
//           "rgba(255, 99, 132, 1)",
//         ],
//         hoverBorderColor: ["rgba(75, 192, 192, 1)", "rgba(255, 99, 132, 1)"],
//         hoverOffset: 10, // Enlarge segments on hover
//       },
//     ],
//   };

//   const options = {
//     responsive: true,
//     plugins: {
//       legend: {
//         position: "bottom",
//         labels: {
//           font: {
//             size: 14,
//             weight: "500",
//           },
//           color: "#333",
//         },
//       },
//       title: {
//         display: true,
//         text: "Income vs Expenses Overview",
//         font: {
//           size: 20,
//           weight: "bold",
//         },
//         color: "#444",
//         padding: 20,
//       },
//       tooltip: {
//         backgroundColor: "#fff",
//         titleColor: "#000",
//         titleFont: { size: 16, weight: "bold" },
//         bodyColor: "#333",
//         bodyFont: { size: 14 },
//         borderColor: "#ccc",
//         borderWidth: 1,
//         boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)", // Tooltip shadow
//       },
//     },
//   };

//   return (
//     // <div className="w-[40%] rounded-3xl px-3 py-5 mx-5 shadow-2xl">

//     //   <Pie data={data} options={options} />
//     // </div>
//     <div className="w-full sm:w-[40%] rounded-3xl px-3 py-5 mx-5 shadow-2xl transition-all duration-500 hover:scale-105 animate__animated animate__fadeIn">
//       <Pie data={data} options={options} />
//     </div>
//   );
// };

// export default PieChart;

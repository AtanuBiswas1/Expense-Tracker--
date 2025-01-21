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

const BarChart = ({ AllDataofIncomeExpenses }) => {
  const data = {
    labels: AllDataofIncomeExpenses.map((data) => data.month), // x-axis labels
    datasets: [
      {
        label: "Income", // Dataset 1
        data: AllDataofIncomeExpenses.map((data) => data.income),
        backgroundColor: "rgba(75, 192, 192, 0.6)", // Styling for Income
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
        hoverBackgroundColor: "rgba(75, 192, 192, 1)",
        hoverBorderColor: "rgba(75, 192, 192, 1)",
      },
      {
        label: "Expenses", // Dataset 2
        data: AllDataofIncomeExpenses.map((data) => data.expenses),
        backgroundColor: "rgba(255, 99, 132, 0.6)", // Styling for Expenses
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
        hoverBackgroundColor: "rgba(255, 99, 132, 1)",
        hoverBorderColor: "rgba(255, 99, 132, 1)",
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
        text: "Income vs Expenses (Monthly)",
        font: {
          size: 20,
          weight: "bold",
        },
        color: "#444",
        padding: 20,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Months",
          font: {
            size: 16,
          },
          color: "#666",
        },
      },
      y: {
        title: {
          display: true,
          text: "Amount (in USD)",
          font: {
            size: 16,
          },
          color: "#666",
        },
        beginAtZero: true,
      },
    },
  };

  return (
    // <div className=" sm:w-[60%] rounded-3xl px-3 py-5 mx-5 shadow-2xl transition-all duration-500 hover:scale-105 animate__animated animate__fadeIn">
    //   <Bar data={data} options={options} />
    // </div>
    // <div className="h-[400px]  rounded-3xl px-3 py-5 shadow-2xl transition-all duration-500 hover:scale-105 animate__animated animate__fadeIn">
    //       <Bar data={data} options={options} />
    //     </div>
    // <div className="w-full h-[300px] sm:h-[500px] rounded-3xl px-4 sm:px-6 py-6 my-5 shadow-2xl transition-all duration-500 hover:scale-105 animate__animated animate__fadeIn">
    //   <Bar data={data} options={options} />
    // </div>

    // <div className="w-full rounded-3xl p-5 shadow-2xl transition-all duration-500 hover:scale-105">
      <Bar data={data} options={options} />
    // </div>
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












  

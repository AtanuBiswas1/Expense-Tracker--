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
    // <div className="h-[400px]  rounded-3xl px-3 py-5 shadow-2xl transition-all duration-500 hover:scale-105 animate__animated animate__fadeIn">
    //   <Line data={data} options={options} />
    // </div>
    // <div className="w-full h-[400px] sm:h-[500px] rounded-3xl px-4 sm:px-6 py-6 my-5 shadow-2xl transition-all duration-500 hover:scale-105 animate__animated animate__fadeIn">
      <Line data={data} options={options} />
    // </div>
  );
};

export default LineChart;

// import React from "react";
// import { Line } from "react-chartjs-2";
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

// const LineChart = ({ AllDataofIncomeExpenses }) => {
//   const data = {
//     labels: AllDataofIncomeExpenses.map((data) => data.month),
//     datasets: [
//       {
//         label: "Income",
//         data: AllDataofIncomeExpenses.map((data) => data.income),
//         borderColor: "rgba(75, 192, 192, 1)",
//         fill: false,
//         tension: 0.4,
//       },
//       {
//         label: "Expenses",
//         data: AllDataofIncomeExpenses.map((data) => data.expenses),
//         borderColor: "rgba(255, 99, 132, 1)",
//         fill: false,
//         tension: 0.4,
//       },
//     ],
//   };

//   const options = {
//     responsive: true,
//     plugins: {
//       legend: { position: "top" },
//       title: { display: true, text: "Income vs. Expenses Trend" },
//     },
//     scales: {
//       x: { title: { display: true, text: "Months" } },
//       y: {
//         title: { display: true, text: "Amount (in USD)" },
//         beginAtZero: true,
//       },
//     },
//   };

//   return (
//     // <div className="h-[400px] ">
//     //   <Line data={data} options={options} />
//     // </div>
//     <div className="h-[400px] w-full rounded-3xl px-3 py-5 shadow-2xl transition-all duration-500 hover:scale-105 animate__animated animate__fadeIn">
//       <Line data={data} options={options} />
//     </div>
//   );
// };

// export default LineChart;

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

const LineChart = ({ AllDataofIncomeExpenses, groupingBasis }) => {
  const data = {
    labels: AllDataofIncomeExpenses.map((d) => d.month),
    datasets: [
      {
        label: "Income",
        data: AllDataofIncomeExpenses.map((d) => d.income),
        borderColor: "rgba(45, 212, 191, 1)",
        borderWidth: 3,
        pointBackgroundColor: "rgba(45, 212, 191, 1)",
        pointBorderColor: "#fff",
        pointHoverRadius: 6,
        pointRadius: 4,
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return "rgba(45, 212, 191, 0.05)";
          const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, "rgba(45, 212, 191, 0.25)");
          gradient.addColorStop(1, "rgba(45, 212, 191, 0.0)");
          return gradient;
        },
        fill: true,
        tension: 0.4,
      },
      {
        label: "Expenses",
        data: AllDataofIncomeExpenses.map((d) => d.expenses),
        borderColor: "rgba(244, 63, 94, 1)",
        borderWidth: 3,
        pointBackgroundColor: "rgba(244, 63, 94, 1)",
        pointBorderColor: "#fff",
        pointHoverRadius: 6,
        pointRadius: 4,
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return "rgba(244, 63, 94, 0.05)";
          const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, "rgba(244, 63, 94, 0.25)");
          gradient.addColorStop(1, "rgba(244, 63, 94, 0.0)");
          return gradient;
        },
        fill: true,
        tension: 0.4,
      },
    ],
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
        text: `Income vs. Expenses Trend (${groupingBasis === 'days' ? 'Daily' : groupingBasis === 'year' ? 'Yearly' : 'Monthly'})`,
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
      <Line data={data} options={options} />
    </div>
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

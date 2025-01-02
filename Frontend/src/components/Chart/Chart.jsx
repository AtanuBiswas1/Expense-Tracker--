
import React, { useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line,Pie,Doughnut,Radar } from "react-chartjs-2";
import { ExpenceApiCall, IncomeApiCall } from "../../API/apiCall.Function.js";
import { useSelector } from "react-redux";

// Register required Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const CombinedBarChart =  () => {


  const { ExpensesData, IncomeData } =
      useSelector((state) => state.ExpensesANDIncomeAPICallData);
 
      console.log("Expenses",typeof ExpensesData,ExpensesData)
      console.log("Income",typeof IncomeData,IncomeData)
  useEffect(()=>{
    
  },[])
  const data = {
    labels: ["January", "February", "March", "April", "May"], // x-axis labels
    datasets: [
      {
        label: "Income", // Dataset 1
        data:"",
        backgroundColor: "rgba(75, 192, 192, 0.6)", // Styling for Income
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
      {
        label: "Expenses", // Dataset 2
        data:"",
        backgroundColor: "rgba(255, 99, 132, 0.6)", // Styling for Expenses
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" }, // Position of legend
      title: { display: true, text: "Income vs. Expenses (Monthly)" }, // Chart Title
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Months",
        },
      },
      y: {
        title: {
          display: true,
          text: "Amount (in USD)",
        },
        beginAtZero: true,
      },
    },
  };

  return <div>
    <div>
      <button>January</button>
    </div>
    <div className="w-[800px] h-[400px]">
    <Bar data={data} options={options} />
    {/* <Line data={data} /> */}
    {/* <Pie data={data} options={options} id={2}/> */}
    </div>
  </div>;
};

export default CombinedBarChart;

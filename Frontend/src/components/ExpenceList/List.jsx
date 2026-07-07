// import React, { useEffect, useState, useMemo, useCallback } from "react";
// import { ExpenceApiCall, IncomeApiCall } from "../../API/apiCall.Function.js";
// import { useSelector, useDispatch } from "react-redux";
// import {
//   ExpensesAPIData,
//   IncomeAPIData,
// } from "../../features/apiDate/apiData.Slice.js";

// function List() {
//   const Months = [
//     "Select",
//     "Jan",
//     "Feb",
//     "Mar",
//     "Apr",
//     "May",
//     "Jun",
//     "July",
//     "Aug",
//     "Sep",
//     "Oct",
//     "Nov",
//     "Dec",
//   ];

//   const [selectedmonth, setMonth] = useState("");
//   const [selectedDate, setSelectDate] = useState("");
//   const [selctedYear, setSelectedYear] = useState(2025);
//   const [loading, setLoading] = useState(false);
//   const [showIncomeTable, setShowIncomeTable] = useState(false);
//   const [isIncomeDataAgainCall, setIsIncomeDataAgainCall] = useState(false);

//   const { ExpensesData, IncomeData, newIncomeUpdate, newExpenseUpdate } =
//     useSelector((state) => state.ExpensesANDIncomeAPICallData);

//   const dispatch = useDispatch();

//   // Fetch Expenses Data
//   const fetchExpensesData = useCallback(async () => {
//     setLoading(true);
//     try {
//       const response = await ExpenceApiCall(
//         selectedDate,
//         selectedmonth,
//         selctedYear
//       );
//       //console.log("responce of expenses:",response)
//       dispatch(ExpensesAPIData(response?.data?.Expenses));
//     } catch (error) {
//       console.error("Error fetching expenses data:", error);
//     } finally {
//       setLoading(false);
//     }
//   }, [selectedDate, selectedmonth, dispatch]);

//   // Fetch Income Data
//   const fetchIncomeData = useCallback(async () => {
//     if (isIncomeDataAgainCall) {
//       setLoading(true);
//       try {
//         const response = await IncomeApiCall(
//           selectedDate,
//           selectedmonth,
//           selctedYear
//         );
//         //console.log("responce of incomes:",response)
//         dispatch(IncomeAPIData(response?.data?.Income));
//       } catch (error) {
//         console.error("Error fetching income data:", error);
//       } finally {
//         setLoading(false);
//       }
//     }
//   }, [selectedDate, selectedmonth, isIncomeDataAgainCall, dispatch]);

//   useEffect(() => {
//     fetchExpensesData();
//   }, [newExpenseUpdate, fetchExpensesData]);

//   useEffect(() => {
//     fetchIncomeData();
//   }, [newIncomeUpdate, fetchIncomeData]);

//   // Handle Expenses Button Click
//   const handleExpensesClick = () => {
//     setShowIncomeTable(false);
//     fetchExpensesData();
//     setMonth("");
//   };

//   // Handle Income Button Click
//   const handleIncomeClick = () => {
//     setShowIncomeTable(true);
//     if (!isIncomeDataAgainCall) {
//       setIsIncomeDataAgainCall(true);
//     }
//   };

//   // Memoized Expenses Table
//   const expensesTable = useMemo(() => {
//     if (!ExpensesData?.length) {
//       return (
//         <tr>
//           <td colSpan="6">No Data Found</td>
//         </tr>
//       );
//     }
//     return ExpensesData.map((item, key) => (
//       <tr className="border-t border-gray-200" key={key}>
//         <td>{new Date(item.date).toLocaleDateString("en-GB")}</td>
//         <td>{item.amount}</td>
//         <td>{item.status}</td>
//         <td>{item.category}</td>
//         <td>{item.description}</td>
//         {/* <td>
//           <button>Delete</button>
//         </td> */}
//       </tr>
//     ));
//   }, [ExpensesData]);

//   // Memoized Income Table
//   const incomeTable = useMemo(() => {
//     if (!IncomeData?.length) {
//       return (
//         <tr>
//           <td colSpan="6">No Data Found</td>
//         </tr>
//       );
//     }

//     return IncomeData.map((item, key) => (
//       <tr className="border-t border-gray-200" key={key}>
//         <td>{new Date(item.createdAt).toLocaleDateString("en-GB")}</td>
//         <td>{item.amount}</td>
//         <td>{item.status}</td>
//         <td>{item.description}</td>
//         {/* <td>
//           <button>Delete</button>
//         </td> */}
//       </tr>
//     ));
//   }, [IncomeData]);

//   return (
//     <div className="bg-gradient-to-r from-blue-50 to-green-100 min-h-screen py-6 px-4 md:px-10">
//       {/* Controls Section */}
//       <div className="shadow-lg p-4 w-full flex flex-wrap justify-between items-center gap-4 bg-white rounded-lg">
//         <button
//           className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all duration-300 shadow-md"
//           onClick={handleExpensesClick}
//         >
//           Expense
//         </button>
//         <button
//           className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all duration-300 shadow-md"
//           onClick={handleIncomeClick}
//         >
//           Income
//         </button>
//         <input
//           type="date"
//           className="bg-gray-200 text-gray-700 rounded-lg px-3 py-2 shadow-inner"
//           onChange={(e) => setSelectDate(e.target.value)}
//         />
//         <div className="flex flex-col items-start bg-slate-100 rounded-lg px-4 py-3 shadow-md">
//           <label htmlFor="month" className="text-gray-700 font-semibold mb-1">
//             Search using Month
//           </label>
//           <select
//             id="month"
//             value={selectedmonth}
//             className="bg-blue-500 text-white rounded-2xl px-3 py-2 focus:ring focus:ring-blue-300 shadow-md"
//             onChange={(event) => setMonth(Months.indexOf(event.target.value))}
//           >
//             {Months.map((month, key) => (
//               <option key={key} value={month}>
//                 {month}
//               </option>
//             ))}
//           </select>
//         </div>
//       </div>

//       {/* Table Section */}
//       <div className="mt-6 overflow-x-auto">
//         <table className="min-w-[600px] w-full border-collapse bg-white shadow-xl rounded-lg">
//           <thead>
//             <tr className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-lg">
//               <th className="py-3 px-6">Date</th>
//               <th className="py-3 px-6">Amount</th>
//               <th className="py-3 px-6">Status</th>
//               {!showIncomeTable && <th className="py-3 px-6">Description</th>}
//               {!showIncomeTable && <th className="py-3 px-6">Category</th>}
//               <th className="py-3 px-6"></th>
//             </tr>
//           </thead>
//           <tbody className="text-center bg-gray-50">
//             {loading ? (
//               <tr>
//                 <td colSpan={showIncomeTable ? "5" : "6"} className="py-4">
//                   <h1 className="text-gray-700 font-medium animate-pulse">
//                     Loading...
//                   </h1>
//                 </td>
//               </tr>
//             ) : !showIncomeTable ? (
//               expensesTable
//             ) : (
//               incomeTable
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

// export default List;

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { ExpenceApiCall, IncomeApiCall } from "../../API/apiCall.Function.js";
import { useSelector, useDispatch } from "react-redux";
import {
  ExpensesAPIData,
  IncomeAPIData,
} from "../../features/apiDate/apiData.Slice.js";
import { useToast } from "../../context/ToastContext.jsx";

function List() {
  const { addToast } = useToast();
  const Months = [
    "Select",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "July",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const [selectedMonth, setMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState(2025);
  const [loading, setLoading] = useState(false);
  const [showIncomeTable, setShowIncomeTable] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { ExpensesData, IncomeData, newIncomeUpdate, newExpenseUpdate } =
    useSelector((state) => state.ExpensesANDIncomeAPICallData);

  const dispatch = useDispatch();

  const fetchExpensesData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await ExpenceApiCall(selectedMonth, selectedYear);
      dispatch(ExpensesAPIData(response?.data?.Expenses));
      if (response?.message && (response.data === " " || !response.data?.Expenses)) {
        addToast(response.message, "warning");
      }
    } catch (error) {
      console.error("Error fetching expenses data:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedMonth, selectedYear, dispatch, addToast]);

  const fetchIncomeData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await IncomeApiCall(selectedMonth, selectedYear);
      dispatch(IncomeAPIData(response?.data?.Income));
      if (response?.message && (response.data === " " || !response.data?.Income)) {
        addToast(response.message, "warning");
      }
    } catch (error) {
      console.error("Error fetching income data:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedMonth, selectedYear, dispatch, addToast]);

  useEffect(() => {
    fetchExpensesData();
  }, [newExpenseUpdate, fetchExpensesData]);

  useEffect(() => {
    fetchIncomeData();
  }, [newIncomeUpdate, fetchIncomeData]);

  const handleExpensesClick = () => {
    setShowIncomeTable(false);
    setMonth("");
    fetchExpensesData();
  };

  const handleIncomeClick = () => {
    setShowIncomeTable(true);
    setMonth("");
    fetchIncomeData();
  };

  const handleAllClick = () => {
    setMonth("");
    if (showIncomeTable) {
      fetchIncomeData();
    } else {
      fetchExpensesData();
    }
  };

  const handlePagination = (direction) => {
    if (
      direction === "next" &&
      currentPage * itemsPerPage <
        (showIncomeTable ? IncomeData.length : ExpensesData.length)
    ) {
      setCurrentPage((prev) => prev + 1);
    }
    if (direction === "prev" && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const paginatedData = useMemo(() => {
    const data = showIncomeTable ? IncomeData : ExpensesData;
    const startIndex = (currentPage - 1) * itemsPerPage;
    return data?.slice(startIndex, startIndex + itemsPerPage) || [];
  }, [showIncomeTable, IncomeData, ExpensesData, currentPage]);

  const tableRows = useMemo(() => {
    if (!paginatedData.length) {
      return (
        <tr>
          <td colSpan="4" className="py-12 text-center text-slate-500 font-medium">
            No Data Found
          </td>
        </tr>
      );
    }
    return paginatedData.map((item, key) => {
      const isExpense = item.status?.toLowerCase().includes("exp") || !showIncomeTable;
      return (
        <tr className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors duration-200" key={key}>
          <td className="py-4 px-6 text-slate-700 font-medium text-sm">
            {new Date(item.date || item.createdAt).toLocaleDateString("en-GB", {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            })}
          </td>
          <td className={`py-4 px-6 font-semibold text-sm ${isExpense ? 'text-rose-600' : 'text-teal-600'}`}>
            {isExpense ? '-' : '+'}${item.amount.toLocaleString()}
          </td>
          <td className="py-4 px-6 text-sm">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
              isExpense 
                ? 'bg-rose-50 border-rose-200/60 text-rose-600' 
                : 'bg-teal-50 border-teal-200/60 text-teal-600'
            }`}>
              {item.status || (isExpense ? "Expense" : "Income")}
            </span>
          </td>
          <td className="py-4 px-6 text-slate-500 text-sm max-w-[200px] truncate" title={item.description || item.category}>
            {item.description || item.category || '—'}
          </td>
        </tr>
      );
    });
  }, [paginatedData, showIncomeTable]);

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-6">
      {/* Controls Section */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl flex flex-wrap justify-between items-center gap-6 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            className={`px-5 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300 ${
              !showIncomeTable
                ? "bg-rose-600 text-white shadow-lg shadow-rose-600/10 font-bold"
                : "bg-slate-100 text-slate-650 hover:text-slate-800 hover:bg-slate-200"
            }`}
            onClick={handleExpensesClick}
          >
            Expenses
          </button>
          <button
            className={`px-5 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300 ${
              showIncomeTable
                ? "bg-teal-600 text-white shadow-lg shadow-teal-600/10 font-bold"
                : "bg-slate-100 text-slate-650 hover:text-slate-800 hover:bg-slate-200"
            }`}
            onClick={handleIncomeClick}
          >
            Income
          </button>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl shadow-sm">
            <label htmlFor="month" className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
              Filter by Month:
            </label>
            <select
              id="month"
              value={Months[selectedMonth] || "Select"}
              className="bg-transparent text-slate-700 font-semibold text-sm outline-none cursor-pointer"
              onChange={(event) => setMonth(Months.indexOf(event.target.value))}
            >
              {Months.map((month, key) => (
                <option key={key} value={month} className="bg-white text-slate-800">
                  {month}
                </option>
              ))}
            </select>
          </div>
          
          <button
            className="px-5 py-2 text-sm font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl border border-slate-200 transition-all duration-300"
            onClick={handleAllClick}
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="mt-8 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-[600px] w-full border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs font-bold uppercase tracking-wider text-left">
                <th className="py-4 px-6">Date</th>
                <th className="py-4 px-6">Amount</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="4" className="py-12 text-center">
                    <div className="flex justify-center items-center gap-3 text-slate-500 font-medium">
                      <svg className="animate-spin h-5 w-5 text-teal-600" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Loading records...</span>
                    </div>
                  </td>
                </tr>
              ) : (
                tableRows
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Section */}
      <div className="flex justify-between items-center mt-6 px-2">
        <button
          className="flex items-center gap-2 bg-white hover:bg-slate-550/5 border border-slate-200 text-slate-600 disabled:opacity-35 disabled:hover:bg-white px-4 py-2.5 rounded-xl transition-all duration-300 text-sm font-semibold"
          onClick={() => handlePagination("prev")}
          disabled={currentPage === 1}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
          </svg>
          <span>Previous</span>
        </button>
        <span className="text-xs font-semibold text-slate-450 uppercase tracking-wider">
          Page {currentPage}
        </span>
        <button
          className="flex items-center gap-2 bg-white hover:bg-slate-550/5 border border-slate-200 text-slate-600 disabled:opacity-35 disabled:hover:bg-white px-4 py-2.5 rounded-xl transition-all duration-300 text-sm font-semibold"
          onClick={() => handlePagination("next")}
          disabled={
            currentPage * itemsPerPage >=
            (showIncomeTable
              ? IncomeData?.length || 0
              : ExpensesData?.length || 0)
          }
        >
          <span>Next</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default List;

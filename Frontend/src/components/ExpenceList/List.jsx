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

function List() {
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
    } catch (error) {
      console.error("Error fetching expenses data:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedMonth, selectedYear, dispatch]);

  const fetchIncomeData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await IncomeApiCall(selectedMonth, selectedYear);
      dispatch(IncomeAPIData(response?.data?.Income));
    } catch (error) {
      console.error("Error fetching income data:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedMonth, selectedYear, dispatch]);

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
          <td colSpan="5">No Data Found</td>
        </tr>
      );
    }
    return paginatedData.map((item, key) => (
      <tr className="border-t border-gray-200" key={key}>
        <td>
          {new Date(item.date || item.createdAt).toLocaleDateString("en-GB")}
        </td>
        <td>{item.amount}</td>
        <td>{item.status}</td>
        <td>{item.description || item.category}</td>
      </tr>
    ));
  }, [paginatedData]);

  return (
    <div className="bg-gradient-to-r from-blue-50 to-green-100 min-h-screen py-6 px-4 md:px-10">
      <div className="shadow-lg p-4 w-full flex flex-wrap justify-between items-center gap-4 bg-white rounded-lg">
        <button
          className="bg-green-500 text-white px-4 py-2 rounded-lg"
          onClick={handleExpensesClick}
        >
          Expenses
        </button>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          onClick={handleIncomeClick}
        >
          Income
        </button>
        <div className="flex flex-col items-start bg-slate-100 rounded-lg px-4 py-3 shadow-md">
          <label htmlFor="month" className="text-gray-700 font-semibold mb-1">
            Search by Month
          </label>
          <select
            id="month"
            value={selectedMonth}
            className="bg-blue-500 text-white rounded-2xl px-3 py-2"
            onChange={(event) => setMonth(Months.indexOf(event.target.value))}
          >
            {Months.map((month, key) => (
              <option key={key} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>
        <button
          className="bg-yellow-500 text-white px-4 py-2 rounded-lg"
          onClick={handleAllClick}
        >
          All
        </button>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="min-w-[600px] w-full border-collapse bg-white shadow-xl rounded-lg">
          <thead>
            <tr className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-lg">
              <th className="py-3 px-6">Date</th>
              <th className="py-3 px-6">Amount</th>
              <th className="py-3 px-6">Status</th>
              <th className="py-3 px-6">Description</th>
            </tr>
          </thead>
          <tbody className="text-center bg-gray-50">
            {loading ? (
              <tr>
                <td colSpan="5">Loading...</td>
              </tr>
            ) : (
              tableRows
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between mt-4">
        <button
          className="bg-gray-400 text-white px-3 py-2 rounded-lg"
          onClick={() => handlePagination("prev")}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        {/* <button
          className="bg-gray-400 text-white px-3 py-2 rounded-lg"
          onClick={() => handlePagination("next")}
          disabled={
            currentPage * itemsPerPage >=
            (showIncomeTable ? IncomeData.length : ExpensesData.length)
          }
        >
          Next
        </button> */}
        <button
          className="bg-gray-400 text-white px-3 py-2 rounded-lg"
          onClick={() => handlePagination("next")}
          disabled={
            currentPage * itemsPerPage >=
            (showIncomeTable
              ? IncomeData?.length || 0
              : ExpensesData?.length || 0)
          }
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default List;

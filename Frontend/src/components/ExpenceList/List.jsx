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

  const [selectedmonth, setMonth] = useState("");
  const [selectedDate, setSelectDate] = useState("");
  const [selctedYear,setSelectedYear]=useState(2025);
  const [loading, setLoading] = useState(false);
  const [showIncomeTable, setShowIncomeTable] = useState(false);
  const [isIncomeDataAgainCall, setIsIncomeDataAgainCall] = useState(false);

  const { ExpensesData, IncomeData, newIncomeUpdate, newExpenseUpdate } =
    useSelector((state) => state.ExpensesANDIncomeAPICallData);

  const dispatch = useDispatch();

  // Fetch Expenses Data
  const fetchExpensesData = useCallback(async () => {

    setLoading(true);
    try {
      const response = await ExpenceApiCall(selectedDate, selectedmonth,selctedYear);
      //console.log("responce of expenses:",response)
      dispatch(ExpensesAPIData(response?.data?.Expenses));
    } catch (error) {
      console.error("Error fetching expenses data:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedDate, selectedmonth,dispatch]);

  // Fetch Income Data
  const fetchIncomeData = useCallback(async () => {
    if (isIncomeDataAgainCall) {
      setLoading(true);
      try {
        const response = await IncomeApiCall(selectedDate, selectedmonth,selctedYear);
        //console.log("responce of incomes:",response)
        dispatch(IncomeAPIData(response?.data?.Income));
      } catch (error) {
        console.error("Error fetching income data:", error);
      } finally {
        setLoading(false);
      }
    }
  }, [selectedDate, selectedmonth, isIncomeDataAgainCall, dispatch]);

  useEffect(() => {
    fetchExpensesData();
  }, [newExpenseUpdate, fetchExpensesData]);

  useEffect(() => {
    fetchIncomeData();
  }, [newIncomeUpdate, fetchIncomeData]);

  // Handle Expenses Button Click
  const handleExpensesClick = () => {
    setShowIncomeTable(false);
    fetchExpensesData();
    setMonth("");
  };

  // Handle Income Button Click
  const handleIncomeClick = () => {
    setShowIncomeTable(true);
    if (!isIncomeDataAgainCall) {
      setIsIncomeDataAgainCall(true);
    }
  };

  // Memoized Expenses Table
  const expensesTable = useMemo(() => {
    if (!ExpensesData?.length) {
      return (
        <tr>
          <td colSpan="6">No Data Found</td>
        </tr>
      );
    }
    return ExpensesData.map((item, key) => (
      <tr className="border-t border-gray-200" key={key}>
        <td>{new Date(item.date).toLocaleDateString("en-GB")}</td>
        <td>{item.amount}</td>
        <td>{item.status}</td>
        <td>{item.category}</td>
        <td>{item.description}</td>
        {/* <td>
          <button>Delete</button>
        </td> */}
      </tr>
    ));
  }, [ExpensesData]);

  // Memoized Income Table
  const incomeTable = useMemo(() => {
    if (!IncomeData?.length) {
      return (
        <tr>
          <td colSpan="6">No Data Found</td>
        </tr>
      );
    }
    
    return IncomeData.map((item, key) => (
      <tr className="border-t border-gray-200" key={key}>
        <td>{new Date(item.createdAt).toLocaleDateString("en-GB")}</td>
        <td>{item.amount}</td>
        <td>{item.status}</td>
        <td>{item.description}</td>
        {/* <td>
          <button>Delete</button>
        </td> */}
      </tr>
    ));
  }, [IncomeData]);

  return (
    <div>
      <div className="shadow-xl p-2 w-full flex justify-end gap-4">
        <button
          className="bg-green-300 px-2 py-1 rounded-lg"
          onClick={handleExpensesClick}
        >
          Expense
        </button>
        <button
          className="bg-green-300 px-2 py-1 rounded-lg"
          onClick={handleIncomeClick}
        >
          Income
        </button>
        <input
          type="date"
          className="bg-gray-400 rounded-lg px-2 py-1"
          onChange={(e) => setSelectDate(e.target.value)}
        />
        <div className="bg-slate-200 rounded-lg px-2 py-1">
          <label htmlFor="month">Search using Month</label>
          <select
            id="month"
            value={selectedmonth}
            className="bg-blue-600 rounded-2xl p-1"
            onChange={(event) => setMonth(Months.indexOf(event.target.value))}
          >
            {/* {console.log(selectedmonth)} */}
            {Months.map((month, key) => (
              <option key={key}>{month}</option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <table className="min-w-full border-gray-300 rounded-xl">
          {!showIncomeTable?
          <thead className="bg-amber-400 rounded-3xl text-center">
          <tr >
              <th className="py-2 px-4">Date</th>
              <th className="py-2 px-4">Amount</th>
              <th className="py-2 px-4">Status</th>
              <th className="py-2 px-4">Description</th>
              <th className="py-2 px-4">Category</th>
              
              <th className="py-2 px-4"></th>
            </tr>
          </thead>
          :
          <thead className="bg-amber-400 rounded-3xl text-center">
          <tr>
              <th className="py-2 px-4">Date</th>
              <th className="py-2 px-4">Amount</th>
              <th className="py-2 px-4">Status</th>
              <th className="py-2 px-4"></th>
              <th className="py-2 px-4"></th>
            </tr>
          </thead>
          
          }
          <tbody className="text-center">
            {loading ? (
              <tr>
                <td colSpan="6">
                  <h1>Loading...</h1>
                </td>
              </tr>
            ) : !showIncomeTable ? (
              expensesTable
            ) : (
              incomeTable
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default List;

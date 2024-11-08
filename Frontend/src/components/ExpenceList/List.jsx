import React, { useEffect, useState } from "react";
import { ExpenceApicCall } from "../../API/apiCall.Function.js";
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
  const [loading, setloading] = useState(false);
  const { ExpensesData, IncomeData } = useSelector(
    (state) => state.ExpensesANDIncomeAPICallData
  );
  const dispatch = useDispatch();

  useEffect(() => {
    setloading((prev)=>prev=!prev);
    
    const expensesData = ExpenceApicCall();
    expensesData.then((value) => {
      dispatch(ExpensesAPIData(value?.data?.Expenses));
    });
    setloading((prev)=>prev=!prev);
    
  }, []);

  function ClickExpensesBtn() {
    setloading((prev)=>prev=!prev);
    const expensesData = ExpenceApicCall(selectedDate, selectedmonth);
    expensesData.then((value) => {
      dispatch(ExpensesAPIData(value?.data?.Expenses));
    });
    setloading((prev)=>prev=!prev);
    
  }

  return (
    <div>
      <div className="shadow-xl p-2 w-full flex justify-end gap-4">
        <button
          className="bg-green-300 px-2 py-1 rounded-lg "
          onClick={ClickExpensesBtn}
        >
          Expence
        </button>
        <button className="bg-green-300 px-2 py-1 rounded-lg ">Income</button>
        <input
          type="date"
          className="bg-gray-400 rounded-lg px-2 py-1"
          onChange={(e) => setSelectDate(e.target.value)}
        />
        <div className="bg-slate-200 rounded-lg px-2 py-1">
          <label htmlFor="month">Search using Month </label>
          <select
            id="month"
            value={selectedmonth}
            className="bg-blue-600 rounded-2xl p-1"
            onChange={(event) => setMonth(event.target.value)}
          >
            {Months.map((month, key) => {
              return <option key={key}>{month}</option>;
            })}
          </select>
        </div>
      </div>
      <div className="">
        <table className="min-w-full  border-gray-300 rounded-xl">
          <thead className="bg-amber-400 rounded-3xl">
            <tr className="">
              <th className="py-2 px-4 ">Date</th>
              <th className="py-2 px-4 ">Amount</th>
              <th className="py-2 px-4">Status</th>
              <th className="py-2 px-4 ">Description</th>
              <th className="py-2 px-4 ">Category</th>
            </tr>
          </thead>
          {loading ? (
            <tbody>
              <tr>
                <td>
                  <h1>loading.....</h1>
                  {console.log("line no 99", loading)}
                </td>
              </tr>
            </tbody>
          ) : !ExpensesData ? (
            <tbody>
              <tr>
                <td>
                  <h1>No data Found</h1>
                  
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody className="text-center">
              {ExpensesData.map((item, key) => {
                return (
                  <tr className="border-t border-gray-200" key={key}>
                    <td>{new Date(item.date).toLocaleDateString("en-GB")}</td>
                    <td>{item.amount}</td>
                    <td>{item.status}</td>
                    <td>{item.category}</td>
                    <td>{item.description}</td>
                  </tr>
                );
              })}
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
}

export default List;


import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/loginuser/loginUser.Slice";
import { logoutUrl } from "../constant.API_URL.js";
import { Toggle_ShowGraph_notList } from "../features/apiDate/apiData.Slice.js";

function Header() {
  const { userData, isAuthenticated } = useSelector((state) => state.auth);
  const {ShowGraph_notList}=useSelector((state)=>state.ExpensesANDIncomeAPICallData)
  const dispatch = useDispatch();

  
  const logoutUser = async () => {
    try {
      const logoutResponce = await fetch(logoutUrl, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      //const responceAfterLogout=await logoutResponce.json()
      dispatch(logout());
    } catch (error) {
      console.log("Server Error");
    }
  };
  const ToggleGraphListBtn=()=>{
    dispatch(Toggle_ShowGraph_notList())
  }
  return (
    <div className=" h-11 flex justify-between bg-slate-400">
      <div className="px-4 py-1">
        <h1>Expense Traker</h1>
      </div>

      {isAuthenticated ? (
        <div className="flex gap-5 px-5 py-1">
          
          {ShowGraph_notList ? (
            <button className="px-2 py-1 bg-green-800 text-white rounded-lg hover:bg-blue-900" onClick={ToggleGraphListBtn}>
              List
            </button>
          ) : (
            <button className="px-2 py-1 bg-gray-800 text-white rounded-lg hover:bg-blue-900" onClick={ToggleGraphListBtn}>
              Graph
            </button>
          )}

          <h1 className="pt-1 bg-green-300 px-2 rounded-2xl">
            {userData?.data?.user?.userName}
          </h1>
          <button
            className="px-2 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-900"
            onClick={logoutUser}
          >
            Logout
          </button>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default Header;

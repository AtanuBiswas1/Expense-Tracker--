import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/loginuser/loginUser.Slice";
import { logoutUrl } from "../constant.API_URL.js";
import { Toggle_ShowGraph_notList } from "../features/apiDate/apiData.Slice.js";

function Header() {
  const { userData, isAuthenticated } = useSelector((state) => state.auth);
  const { ShowGraph_notList } = useSelector(
    (state) => state.ExpensesANDIncomeAPICallData
  );
  const dispatch = useDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

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
  const ToggleGraphListBtn = () => {
    dispatch(Toggle_ShowGraph_notList());
  };
  return (
    // <div className=" h-11 flex justify-between bg-slate-400">
    //   <div className="px-4 py-1">
    //     <h1>Expense Traker</h1>
    //   </div>

    //   {isAuthenticated ? (
    //     <div className="flex gap-5 px-5 py-1">
    //       {ShowGraph_notList ? (
    //         <button
    //           className="px-2 py-1 bg-green-800 text-white rounded-lg hover:bg-blue-900"
    //           onClick={ToggleGraphListBtn}
    //         >
    //           List
    //         </button>
    //       ) : (
    //         <button
    //           className="px-2 py-1 bg-gray-800 text-white rounded-lg hover:bg-blue-900"
    //           onClick={ToggleGraphListBtn}
    //         >
    //           Graph
    //         </button>
    //       )}

    //       <h1 className="pt-1 bg-green-300 px-2 rounded-2xl">
    //         {userData?.data?.user?.userName}
    //       </h1>
    //       <button
    //         className="px-2 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-900"
    //         onClick={logoutUser}
    //       >
    //         Logout
    //       </button>
    //     </div>
    //   ) : (
    //     ""
    //   )}
    // </div>
    <div className="h-16 flex items-center justify-between px-4 bg-slate-400 shadow-md">
      {/* Logo Section */}
      <div className="flex items-center space-x-2">
        <h1 className="text-lg font-bold text-white">Expense Tracker</h1>
      </div>

      {/* Menu Button (Mobile) */}
      <div className="md:hidden">
        <button className="text-white focus:outline-none" onClick={toggleMenu}>
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>
      </div>

      {/* Navigation Links */}
      <div
        className={`absolute md:static top-16 left-0 w-full md:w-auto bg-slate-400 md:flex items-center space-x-6 md:space-x-8 p-4 md:p-0 transition-all duration-300 ease-in-out ${
          isMenuOpen ? "block" : "hidden"
        }`}
      >
        {isAuthenticated ? (
          <div className="flex flex-col md:flex-row items-center space-y-3 md:space-y-0">
            <button
              className={`px-4 py-2 mx-3 text-sm font-medium rounded-lg text-white ${
                ShowGraph_notList
                  ? "bg-green-800 hover:bg-green-900"
                  : "bg-gray-800 hover:bg-gray-900"
              }`}
              onClick={ToggleGraphListBtn}
            >
              {ShowGraph_notList ? "List" : "Graph"}
            </button>
            <h1 className="px-4 py-2 mx-3 text-sm font-medium bg-green-300 rounded-2xl text-slate-800">
              {userData?.data?.user?.userName}
            </h1>
            <button
              className="px-4 py-2 text-sm font-medium bg-blue-500 rounded-lg hover:bg-blue-700 text-white transition-all duration-300"
              onClick={logoutUser}
            >
              Logout
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default Header;

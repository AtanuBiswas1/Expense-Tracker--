import React from "react";

function MoneyCard({ totalBal = 0, titel, bgColor = "bg-blue-600" }) {
  const currentData = {
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    date: new Date().getDate(),
  };
  const currTime = {
    hour: new Date().getHours(),
    min: new Date().getMinutes(),
  };
  return (
    // <div className={`w-1/5 shadow-xl rounded-2xl p-2 text-white ${bgColor} my-2 mx-3`} >
    //   <h1 className="font-medium ">{titel}</h1>
    //   <h1>${totalBal}</h1>
    //   <div className="text-right">
    //   <h1>{`${currentData.date}/${currentData.month}/${currentData.year}`}</h1>
    //   <h1>{`${currTime.hour}:${currTime.min}`}</h1>
    //   </div>

    // </div>
    <div
      className={`w-full sm:w-1/3 lg:w-1/5 shadow-xl rounded-2xl p-4 text-white ${bgColor} my-3 mx-3 transform transition-transform duration-500 ease-in-out hover:scale-105`}
    >
      <h1 className="font-medium text-lg">{titel}</h1>
      <h1 className="text-xl font-semibold">${totalBal}</h1>
      <div className="text-right mt-2 text-sm">
        <h1>{`${currentData.date}/${currentData.month}/${currentData.year}`}</h1>
        <h1>{`${currTime.hour}:${currTime.min}`}</h1>
      </div>
    </div>
  );
}

export default MoneyCard;

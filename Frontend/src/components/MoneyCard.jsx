import React from "react";

function MoneyCard({totalBal,titel,bgColor="bg-blue-600"}) {
  
  const currentData={
    month :new Date().getMonth()+1,
    year : new Date().getFullYear(),
    date : new Date().getDate()
  }
  const currTime ={
    hour:new Date().getHours(),
    min:new Date().getMinutes(),
  } 
  return (
    <div className={`w-1/5 shadow-xl rounded-2xl p-2 text-white ${bgColor} my-2 mx-3`} >
      <h1 className="font-medium ">{titel}</h1>
      <h1>${totalBal}</h1>
      <div className="text-right">
      <h1>{`${currentData.date}/${currentData.month}/${currentData.year}`}</h1>
      <h1>{`${currTime.hour}:${currTime.min}`}</h1>
      </div>
      
    </div>
  );
}

export default MoneyCard;

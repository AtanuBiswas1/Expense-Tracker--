import React from "react";
import Moneyshowsection from "../components/Moneyshowsection";
import List from "../components/ExpenceList/List";
import Chart from "../components/Chart/Chart01";
import { useSelector } from "react-redux";
function Dashbord() {
  const {ShowGraph_notList}=useSelector((state)=>state.ExpensesANDIncomeAPICallData)
  
  return (
    <div>
      <Moneyshowsection />
       {ShowGraph_notList?
       <Chart/>
       :
       <List />
       }
      

      
    </div>
  );
}

export default Dashbord;

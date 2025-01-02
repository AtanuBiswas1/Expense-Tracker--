import React from "react";
import Moneyshowsection from "../components/Moneyshowsection";
import List from "../components/ExpenceList/List";
import BarChart from "../components/Chart/Chart";
import { useSelector } from "react-redux";
function Dashbord() {
  const {ShowGraph_notList}=useSelector((state)=>state.ExpensesANDIncomeAPICallData)
  
  return (
    <div>
      <Moneyshowsection />
       {ShowGraph_notList?
       <BarChart />
       :
       <List />
       }
      

      
    </div>
  );
}

export default Dashbord;

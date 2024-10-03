import React from "react";

function List() {
  return (
    <div>
      <div className="shadow-xl p-2 w-full flex justify-end gap-4">
        <label htmlFor="allIncomeExpence">All-Income-Expence</label>
        <select id="allIncomeExpence" className="bg-blue-300 rounded-2xl p-1">
          <option value="All ">All</option>
          <option value="Expence">Expence</option>
          <option value="Incom">Income</option>
        </select>
        <label htmlFor="date">Date</label>
        <select name="" id="date" className="bg-blue-300 rounded-2xl p-1">
          <option value="">All</option>
          <option value="">Today</option>
          <option value="">Yesterday</option>
          <option value="">Other Date</option>
        </select>
      </div>
      <div className="">
        <table className="min-w-full bg-orange-400 border-gray-300 rounded-xl">
          <thead className="bg-amber-400 rounded-3xl">
            <tr className="">
              <th className="py-2 px-4 text-left">Date</th>
              <th className="py-2 px-4 text-left">Amount</th>
              <th className="py-2 px-4 text-left">Status</th>
              <th className="py-2 px-4 text-left">Description</th>
              <th className="py-2 px-4 text-left">Category</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-gray-200 ">
                <td>2/3/4</td>
                <td>200</td>
                <td>Income</td>
                <td>Food</td>
                <td>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Totam, libero?</td>
            </tr>
            <tr className="border-t border-gray-200">
                <td>2/3/4</td>
                <td>200</td>
                <td>Income</td>
                <td>Food</td>
                <td>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt natus quisquam nobis inventore et illo dolor cumque, necessitatibus minima tempore.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default List;

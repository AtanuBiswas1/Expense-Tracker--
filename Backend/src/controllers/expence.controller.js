import { ApiError } from "../utils/ApiError.js";
import { asyncHandaler } from "../utils/asyncHandaler.js";
import { Expense } from "../model/expence.model.js";
import { ApiResponce } from "../utils/ApiResponce.js";
import { User } from "../model/user.model.js";

//1.expence save in backend
const userExpenceSave = asyncHandaler(async (req, resp) => {
  const { amount, date, category, description } = req.body;
  //console.log(req.body)
  if (amount === "" || date === "" || category === "" || description === "") {
    console.log(new ApiError(400, "Must be fill all fild"));
  }

  console.log(req.user?._id);
  const userExpenceCreate = await Expense.create({
    user: req.user?._id,
    amount,
    date,
    category,
    description,
  });
  const checkUserExpenceCreate = await Expense.findById(userExpenceCreate._id);
  if (!checkUserExpenceCreate) {
    console.log(new ApiError(500, "server Error for add Expence of user"));
    return resp
      .status(500)
      .json(new ApiResponce(500, " ", "server Error for add Expence of user"));
  }
  const user = await User.findById(req.user?._id);
  user.totalExpenceAmount += Number(amount);
  await user.save();

  return resp.status(201).json(
    new ApiResponce(
      200,
      {
        TotalExpence: user.totalExpenceAmount,
      },
      "successfully submitted"
    )
  );
});

//2. all expence sent to frontend with pagination technique
const ExpenseSendToFrontend = asyncHandaler(async (req, resp) => {
  const { date, month,year } = req.query;
  const user = await User.findById(req.user?._id);
  let query = { user: req.user._id }; // Query for logged-in user's expenses
  console.log("line no 49",req.query)
  // Add date filtering to the query if provided
  if (date) {
    query.date = new Date(date);
  }else if (year && month) {
    const startDate = new Date(`${year}-${month}-01`);
    const endDate = new Date(startDate);
    endDate.setMonth(startDate.getMonth() + 1); // Move to the first day of the next month
    query.date = { $gte: startDate, $lt: endDate }; // Filter for the selected month
  }
  // } else if (month) {
  //   const startDate = new Date(`2025-${month}-01`);
  //   const endDate = new Date(`2025-${month}-31`);
  //   // const startDate = new Date(`2025-02-01`);
  //   // const endDate = new Date(`2025-02-31`);
  //   /*const endDate = new Date(startDate);
  //       endDate.setMonth(startDate.getMonth() + 1); 
  //    */
  //   query.date = { $gte: startDate, $lt: endDate };
  // }
  //console.log("line no 61",query)
  const expenses = await Expense.find(query).sort({ date: -1 });
  console.log("line no 63",expenses);
  
  if (!expenses.length) {
    return resp
      .status(404)
      .json(
        new ApiResponce(200, " ", "No expenses found for the specified filters")
      );
  }

  return resp.status(202).json(
    new ApiResponce(
      200,
      {
        Expenses: expenses,
      },
      {
        TotalExpence: user.totalExpenceAmount,
        message:" expenses found for the specified filters"
      }
      
    )
  );
});

export { userExpenceSave, ExpenseSendToFrontend };

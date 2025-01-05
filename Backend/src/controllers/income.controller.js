import { ApiError } from "../utils/ApiError.js";
import { ApiResponce } from "../utils/ApiResponce.js";
import { asyncHandaler } from "../utils/asyncHandaler.js";
import { Budget } from "../model/budget.model.js";
import { User } from "../model/user.model.js";

const userIncomeSave = asyncHandaler(async (req, resp) => {
  const { amount, category } = req.body;
  //console.log(req.body);
  if (amount === "" || category === "") {
    console.log(new ApiError(400, "Must be fill all fild"));
  }
  //const user = await User.findById(req.user?._id);
  console.log(req.user?._id);
  const userExpenceCreate = await Budget.create({
    user: req.user?._id,
    amount,
    category,
  });
  const checkUserIncomeCreate = await Budget.findById(userExpenceCreate._id);
  if (!checkUserIncomeCreate) {
    console.log(new ApiError(500, "server Error for add Income of user"));
    return resp
      .status(500)
      .json(new ApiResponce(500, " ", "server Error for add Incoe of user"));
  }
  //console.log("submitted")
  const user = await User.findById(req.user?._id);
  user.totalSaveAmount +=Number(amount) ;
  await user.save();

  return resp.status(201).json(
    new ApiResponce(
      200,
      {
        TotalIncome: user.totalSaveAmount,
      },
      "successfully submitted"
    )
  );
});

//2. all Income sent to frontend with pagination technique
const IncomeSendToFrontend = asyncHandaler(async (req, resp) => {
  const { date, month } = req.query;
  let query = { user: req.user._id }; // Query for logged-in user's expenses
  
  const user = await User.findById(req.user?._id);

  // Add date filtering to the query if provided
  // if (date) {
  //   query.createdAt = new Date(date);
  // } else if (month) {
  //   const startDate = new Date(`2024-${month}-01`);
  //   const endDate = new Date(`2024-${month}-31`);
  //   /*const endDate = new Date(startDate);
  //         endDate.setMonth(startDate.getMonth() + 1); 
  //      */
  //   query.createdAt = { $gte: startDate, $lt: endDate };
  // }
  
  const incomes = await Budget.find(query).sort({ date: -1 });
 
  if (!incomes.length) {
    return resp
      .status(404)
      .json(
        new ApiResponce(200, " ", "No Income found for the specified filters")
      );
  }

  return resp.status(202).json(
    
    new ApiResponce(
      200,
      {
        Income: incomes,
      },
      {
        TotalIncome: user.totalSaveAmount,
        message:" Income found for the specified filters"
      }
      
    )
  );
});

export { userIncomeSave ,IncomeSendToFrontend};

import { asyncHandaler } from "../utils/asyncHandaler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponce } from "../utils/ApiResponce.js";
import { BudgetLimit } from "../model/budgetLimit.model.js";

// Save or Update Budget Limit
const userBudgetLimitSave = asyncHandaler(async (req, resp) => {
  const { category, limit } = req.body;

  if (!category || !limit) {
    throw new ApiError(400, "Category and limit fields are required");
  }

  // Find existing or create new limit
  let budgetLimit = await BudgetLimit.findOne({ user: req.user._id, category });

  if (budgetLimit) {
    budgetLimit.limit = Number(limit);
    await budgetLimit.save();
  } else {
    budgetLimit = await BudgetLimit.create({
      user: req.user._id,
      category,
      limit: Number(limit)
    });
  }

  return resp.status(200).json(
    new ApiResponce(200, budgetLimit, "Budget limit saved successfully")
  );
});

// Get Budget Limits
const budgetLimitsSendToFrontend = asyncHandaler(async (req, resp) => {
  const limits = await BudgetLimit.find({ user: req.user._id });
  return resp.status(200).json(
    new ApiResponce(200, { limits }, "Budget limits retrieved successfully")
  );
});

export { userBudgetLimitSave, budgetLimitsSendToFrontend };

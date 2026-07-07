import { asyncHandaler } from "../utils/asyncHandaler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponce } from "../utils/ApiResponce.js";
import { SavingsGoal } from "../model/savingsGoal.model.js";

// Save or Update Savings Goal
const userSavingsGoalSave = asyncHandaler(async (req, resp) => {
  const { title, targetAmount, currentAmount, category, targetDate } = req.body;

  if (!title || !targetAmount) {
    throw new ApiError(400, "Title and target amount are required");
  }

  const savingsGoal = await SavingsGoal.create({
    user: req.user._id,
    title,
    targetAmount: Number(targetAmount),
    currentAmount: Number(currentAmount || 0),
    category: category || "General",
    targetDate: targetDate ? new Date(targetDate) : undefined
  });

  return resp.status(201).json(
    new ApiResponce(200, savingsGoal, "Savings goal created successfully")
  );
});

// Contribute to Savings Goal
const userSavingsGoalContribution = asyncHandaler(async (req, resp) => {
  const { goalId, amount } = req.body;

  if (!goalId || !amount) {
    throw new ApiError(400, "Goal ID and contribution amount are required");
  }

  const goal = await SavingsGoal.findOne({ _id: goalId, user: req.user._id });
  if (!goal) {
    throw new ApiError(404, "Savings goal not found");
  }

  goal.currentAmount = (goal.currentAmount || 0) + Number(amount);
  await goal.save();

  return resp.status(200).json(
    new ApiResponce(200, goal, "Contribution saved successfully")
  );
});

// Get Savings Goals
const savingsGoalsSendToFrontend = asyncHandaler(async (req, resp) => {
  const goals = await SavingsGoal.find({ user: req.user._id });
  return resp.status(200).json(
    new ApiResponce(200, { goals }, "Savings goals retrieved successfully")
  );
});

// Delete Savings Goal
const userSavingsGoalDelete = asyncHandaler(async (req, resp) => {
  const { goalId } = req.body;

  if (!goalId) {
    throw new ApiError(400, "Goal ID is required");
  }

  const result = await SavingsGoal.deleteOne({ _id: goalId, user: req.user._id });
  if (result.deletedCount === 0) {
    throw new ApiError(404, "Savings goal not found");
  }

  return resp.status(200).json(
    new ApiResponce(200, {}, "Savings goal deleted successfully")
  );
});

export { userSavingsGoalSave, userSavingsGoalContribution, savingsGoalsSendToFrontend, userSavingsGoalDelete };

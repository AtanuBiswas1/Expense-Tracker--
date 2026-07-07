import { Router } from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
  currentPasswordChange,
} from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  userExpenceSave,
  ExpenseSendToFrontend,
} from "../controllers/expence.controller.js";
import {
  userIncomeSave,
  IncomeSendToFrontend,
} from "../controllers/income.controller.js";
import { getAIAnalysis } from "../controllers/ai.controller.js";
import {
  userBudgetLimitSave,
  budgetLimitsSendToFrontend
} from "../controllers/budgetLimit.controller.js";
import {
  userSavingsGoalSave,
  userSavingsGoalContribution,
  savingsGoalsSendToFrontend,
  userSavingsGoalDelete
} from "../controllers/savingsGoal.controller.js";

const router = Router();

// All routes declear here with controllers
// Thats means which controllers execute in which routes
router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
  ]),
  registerUser
);

router.route("/login").post(loginUser);

//secured routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/changePassword").post(currentPasswordChange);
router.route("/addUserExpence").post(verifyJWT, userExpenceSave);
router.route("/addUserIncome").post(verifyJWT, userIncomeSave);
router.route("/income/show/api").get(verifyJWT, IncomeSendToFrontend);
router.route("/expence/show/api").get(verifyJWT, ExpenseSendToFrontend);
router.route("/ai/analyze").post(verifyJWT, getAIAnalysis);

// New secure routes for Budget Limits and Savings Goals
router.route("/addBudgetLimit").post(verifyJWT, userBudgetLimitSave);
router.route("/budgetLimits/show").get(verifyJWT, budgetLimitsSendToFrontend);
router.route("/addSavingsGoal").post(verifyJWT, userSavingsGoalSave);
router.route("/savingsGoal/contribute").post(verifyJWT, userSavingsGoalContribution);
router.route("/savingsGoals/show").get(verifyJWT, savingsGoalsSendToFrontend);
router.route("/savingsGoal/delete").post(verifyJWT, userSavingsGoalDelete);

export default router;

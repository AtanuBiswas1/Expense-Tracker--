import { Router } from "express";
import { loginUser, logoutUser, registerUser,currentPasswordChange } from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {userExpenceSave} from "../controllers/expence.controller.js"
import {userIncomeSave} from "../controllers/income.controller.js"
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

router.route("/login").post(loginUser)

//secured routes
router.route("/logout").post( verifyJWT, logoutUser)
router.route("/changePassword").post(currentPasswordChange)
router.route("/addUserExpence").post(verifyJWT,userExpenceSave)
router.route("/addUserIncome").post(verifyJWT,userIncomeSave)

export default router;

import express from "express";

import userController from "../controller/userController.js";
import validate from "../middleware/validate.js";
import registerSchema from "../validation/registerSchema.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/addUser", validate(registerSchema), userController.addUser);

router.post("/loginUser", userController.loginUser);

router.get("/authLogin", auth, userController.authLogin);

router.post("/logOut", auth, userController.logOut);

router.post("/logOutAll", auth, userController.logOutAll);

router.get("/getAllUsers", userController.getAllUsers);

export default router;

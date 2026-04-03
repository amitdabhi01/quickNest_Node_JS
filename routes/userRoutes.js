import express from "express";

import userController from "../controller/userController.js";
import validate from "../middleware/validate.js";
import registerSchema from "../validation/registerSchema.js";
import auth from "../middleware/auth.js";
import uploads from "../middleware/upload.js";
import checkRole from "../middleware/checkRole.js";

const router = express.Router();

router.post(
  "/addUser",
  uploads.single("profilePic"),
  validate(registerSchema),
  userController.add,
);

router.post("/loginUser", userController.login);

router.get("/authLogin", auth, userController.authLogin);

router.post("/logOut", auth, userController.logOut);

router.post("/logOutAll", auth, userController.logOutAll);

router.get(
  "/getAll",
  auth,
  checkRole("admin", "super_admin"),
  userController.getAll,
);

router.patch("/update", uploads.single("profilePic"));

export default router;

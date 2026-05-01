import express from "express";

import userController from "../controller/userController.js";

import checkRole from "../middleware/checkRole.js";
import auth from "../middleware/auth.js";
import validate from "../middleware/validate.js";
import uploads from "../middleware/upload.js";

import {
  createUserSchema,
  updateUserSchema,
} from "../validation/userSchema.js";

import { authLimiter } from "../middleware/rateLimit.js";

const router = express.Router();

router.post(
  "/add",
  uploads.single("profilePic"),
  validate(createUserSchema),
  userController.add,
);

router.post("/login", userController.login);

router.get("/authLogin", auth, authLimiter, userController.authLogin);

router.post("/logOut", auth, userController.logOut);

router.post("/logOutAll", auth, userController.logOutAll);

router.get(
  "/getAll",
  auth,
  checkRole("admin", "super_admin"),
  userController.getAll,
);

router.patch(
  "/update",
  uploads.single("profilePic"),
  auth,
  userController.update,
);

router.delete("/delete", auth, userController.deleteUser);

export default router;

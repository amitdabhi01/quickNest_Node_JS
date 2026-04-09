import express from "express";

import auth from "../middleware/auth.js";
import checkRole from "../middleware/checkRole.js";

import adminController from "../controller/adminController.js";
import categoryController from "../controller/categoryController.js";
import serviceController from "../controller/serviceController.js";

import validate from "../middleware/validate.js";

import { createCategorySchema } from "../validation/categorySchema.js";

const router = express.Router();

// ==================== USERS ROUTES ====================
router.patch(
  "/update/:id",
  auth,
  checkRole("admin", "super_admin"),
  adminController.updateUserData,
);

router.delete(
  "/delete/:id",
  auth,
  checkRole("admin", "super_admin"),
  adminController.deleteUser,
);

// ==================== CATEGORIES ROUTES ====================
router.post(
  "/addCategory",
  auth,
  validate(createCategorySchema),
  checkRole("admin", "super_admin"),
  categoryController.add,
);

router.get(
  "/allCategories",
  auth,
  checkRole("admin", "super_admin"),
  categoryController.getAll,
);



// ==================== SERVICES ROUTES ====================
router.post(
  "/addService",
  auth,
  checkRole("admin", "super_admin"),
  serviceController.add,
);

export default router;

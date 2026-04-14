import express from "express";

import auth from "../middleware/auth.js";
import checkRole from "../middleware/checkRole.js";
import validate from "../middleware/validate.js";

import adminController from "../controller/adminController.js";
import categoryController from "../controller/categoryController.js";
import serviceController from "../controller/serviceController.js";

import {
  createCategorySchema,
  updateCategorySchema,
} from "../validation/categorySchema.js";

import { updateUserSchema } from "../validation/userSchema.js";

import { createServiceSchema } from "../validation/serviceSchema.js";

const router = express.Router();

// ==================== USERS ROUTES ====================
router.patch(
  "/update/:id",
  auth,
  checkRole("admin", "super_admin"),
  validate(updateUserSchema),
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

router.get(
  "/category/:id",
  auth,
  checkRole("admin", "super_admin"),
  categoryController.getById,
);

router.patch(
  "/category/:id",
  auth,
  validate(updateCategorySchema),
  checkRole("admin", "super_admin"),
  categoryController.update,
);

router.delete(
  "/category/:id",
  auth,
  checkRole("admin", "super_admin"),
  categoryController.deleteCategory,
);

// ==================== SERVICES ROUTES ====================
router.post(
  "/addService",
  auth,
  checkRole("admin", "super_admin"),
  validate(createServiceSchema),
  serviceController.add,
);

export default router;

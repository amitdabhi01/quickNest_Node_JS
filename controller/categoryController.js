import HttpError from "../middleware/HttpError.js";

import Category from "../model/Category.js";

const add = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    const newCategory = new Category({
      name,
      description,
    });

    await newCategory.save();

    res.status(201).json({
      success: true,
      message: "category create successfully",
      newCategory,
    });
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

const getAll = async (req, res, next) => {
  try {
    const categories = await Category.find();

    res
      .status(200)
      .json({ success: true, message: "all categories", categories });
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

const getById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // console.log("id", id);
    
    const category = await Category.findById(id);

    if (!category) {
      return next(new HttpError("Category not found", 404));
    }

    res
      .status(200)
      .json({ success: true, message: "category retrieved", category });
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

const update = async (req, res, next) => {
  try {
    const { id } = req.params;

    let category = await Category.findById(id);

    if (!category) {
      return next(new HttpError("category not found", 404));
    }

    if (req.user.role !== "admin" && req.user.role !== "supper_admin") {
      return next(new HttpError("unauthorized access", 401));
    }

    const updates = Object.keys(req.body);

    const allowedField = ["name", "description"];

    const isValid = updates.every((field) => allowedField.includes(field));

    if (!isValid) {
      return next(new HttpError("only allowed fields can be updated", 400));
    }

    if (req.body.name && req.body.name !== category.name) {
      const existingCategory = await Category.findOne({ name: req.body.name });
      if (existingCategory) {
        return next(new HttpError("category name already exists", 400));
      }
    }

    updates.forEach((update) => (category[update] = req.body[update]));

    await category.save();

    res
      .status(200)
      .json({
        success: true,
        message: "category updated successfully",
        category,
      });
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);

    if (!category) {
      return next(new HttpError("category not found", 404));
    }

    await Category.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "category deleted successfully",
    });
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

export default { add, getAll, getById, update, deleteCategory };

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
    const { id } = req.params.id;

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
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params.id;

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

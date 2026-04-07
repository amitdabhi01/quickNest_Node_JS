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

export default { add };

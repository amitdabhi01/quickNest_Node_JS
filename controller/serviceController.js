import HttpError from "../middleware/HttpError.js";

import Category from "../model/Category.js";
import Service from "../model/Service.js";

const add = async (req, res, next) => {
  try {
    const { name, price, description, duration, isActive, category } = req.body;

    const existingService = await Service.findOne({ name });

    if (existingService) {
      return next(new HttpError("service is already exist ", 400));
    }

    const existingCategory = await Category.findById(category);

    if (!existingCategory) {
      return next(new HttpError("category is not exist", 404));
    }

    const newService = new Service({
      name,
      price,
      description,
      duration,
      isActive,
      category
    });

    await newService.save();

    res
      .status(201)
      .json({ success: true, message: "service add successfully", newService });
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

export default { add };

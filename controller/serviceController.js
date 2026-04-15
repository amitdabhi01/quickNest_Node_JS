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
      category,
    });

    await newService.save();

    res
      .status(201)
      .json({ success: true, message: "service add successfully", newService });
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

const getAll = async (req, res, next) => {
  try {
    const services = await Service.find().populate("category");

    res.status(200).json({
      success: true,
      message: "all services fetch successfully",
      services,
    });
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

const getById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const service = await Service.findById(id).populate("category");

    if (!service) {
      return next(new HttpError("service not found", 404));
    }

    res
      .status(200)
      .json({ success: true, message: "service retrieved", service });
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

const update = async (req, res, next) => {
  try {
    const { id } = req.params;

    let service = await Service.findById(id);

    if (!service) {
      return next(new HttpError("service not found", 404));
    }

    if (req.user.role !== "admin" && req.user.role !== "super_admin") {
      return next(new HttpError("unauthorized access", 401));
    }

    const updates = Object.keys(req.body);

    const allowedField = [
      "name",
      "price",
      "duration",
      "description",
      "isActive",
      "category",
    ];

    const isValid = updates.every((field) => allowedField.includes(field));

    if (!isValid) {
      return next(new HttpError("only allowed field can be updated", 400));
    }

    if (req.body.name && req.body.name !== service.name) {
      const existingService = await Service.findOne({ name: req.body.name });
      if (existingService) {
        return next(new HttpError("service name already exist", 400));
      }
    }

    if (
      req.body.category &&
      req.body.category !== service.category.toString()
    ) {
      const existingCategory = await Category.findById(req.body.category);
      if (!existingCategory) {
        return next(new HttpError("category not found", 404));
      }
    }

    updates.forEach((update) => (service[update] = req.body[update]));

    await service.save();

    res.status(200)
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

export default { add, getAll, getById };

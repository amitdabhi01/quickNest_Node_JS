import HttpError from "../middleware/HttpError.js";

import Service from "../model/Service.js";

const add = async (req, res, next) => {
  try {
    const { title, price, description, duration, isActive } = req.body;

    const newService = Service.create({
      title,
      price,
      description,
      duration,
      isActive,
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

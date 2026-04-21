import HttpError from "../middleware/HttpError.js";

import Provider from "../model/Provider.js";
import Service from "../model/Service.js";
import User from "../model/User.js";

const registerAsProvider = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const { document, experience, services } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return next(new HttpError("user not found", 404));
    }

    const existingProvider = await Provider.findById({ userId });

    if (existingProvider) {
      return next(new HttpError("you are already as a provider", 400));
    }

    if (!services || Array.isArray(services) || services.length === 0) {
      return next(new HttpError("at least one service is required", 400));
    }

    const validServices = await Service.find({
      _id: { $in: services },
    });

    if (validServices.length !== services.length) {
      return next(new HttpError("invalid services id", 400));
    }

    const newProvider = new Provider({
      userId,
      document,
      experience,
      services,
    });

    await newProvider.save();

    res.status(201).json({
      success: true,
      message:
        "Registered as provider successfully. Wait for admin verification",
      provider: newProvider,
    });
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

const getProviders = async () => {
  try {
    const { isVerified } = req.query;

    let query = {};

    if (isVerified !== undefined) {
      query.isVerified = isVerified === "true";
    }

    const providers = await Provider.find(query)
      .populate({
        path: "userId",
        select: "name email phone",
      })
      .populate({
        path: "services",
        select: "name",
      });

    if (!providers.length) {
      return next(new HttpError("no provider found", 404));
    }

    res.status(200).json({
      success: true,
      message: "providers details fetched successfully",
      count: providers.length,
      providers,
    });
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

export default { registerAsProvider, getProviders };

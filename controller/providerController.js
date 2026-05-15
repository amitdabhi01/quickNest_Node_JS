import HttpError from "../middleware/HttpError.js";

import Provider from "../model/Provider.js";
import Service from "../model/Service.js";
import User from "../model/User.js";
import Booking from "../model/Booking.js";

import sendEmail from "../utils/sendEmail.js";
import { getProviderRegistrationEmailTemplate } from "../services/emailTemplate.js";

const registerAsProvider = async (req, res, next) => {
  try {
    const userId = req.params._id;

    const user = await User.findById(userId);

    if (!user) {
      return next(new HttpError("User not found", 404));
    }

    const existingProvider = await Provider.findById(userId);

    if (existingProvider) {
      return next(new HttpError("Already registered with this id", 500));
    }

    const { services, experience, documents } = req.body;

    if (!services || Array.isArray(services) || services.length === 0) {
      return next(new HttpError(" Service is required", 404));
    }

    const validServices = await Service.find({
      _id: { $in: services },
    }).select("_id");

    if (validServices.length !== services.length) {
      return next(new HttpError("Invalid service IDs", 400));
    }

    const newProvider = new Provider({
      userId,
      services: validServices,
      experience,
      documents,
    });

    await newProvider.save();

    await sendEmail({
      to: user.email,
      subject: "Provider Registration Received",
      html: getProviderRegistrationEmailTemplate,
    });

    res.status(201).json({
      success: true,
      message:
        "Registered as provider successfully. Wait for admin verification",
      Provider: newProvider,
    });
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

const getProviders = async (req, res, next) => {
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

const getProviderById = async (req, res, next) => {
  try {
    const id = req.params.id;

    const provider = await Provider.findById(id);

    if (!provider) {
      return next(new HttpError("provider not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "provider fetched successfully",
      provider,
    });
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

const getBookingProvider = async (req, res, next) => {
  try {
    const role = req.user.role;

    let bookings;

    if (role === "provider") {
      const provider = await Provider.findOne({ userId: req.user._id });

      if (!provider) {
        return next(new HttpError("Provider not found", 404));
      }

      bookings = await Booking.find({ providerId: provider._id });
    } else if (role === "admin" || role === "super_admin") {
      bookings = await Booking.find(); // admin gets all bookings
    }

    if (!bookings || bookings.length === 0) {
      return next(new HttpError("No bookings found", 404));
    }

    res
      .status(200)
      .json({
        success: true,
        message: "Booking fetched successfully",
        bookings,
      });
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

export default {
  registerAsProvider,
  getProviders,
  getProviderById,
  getBookingProvider,
};

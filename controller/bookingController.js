import HttpError from "../middleware/HttpError.js";

import Booking from "../model/Booking.js";
import Service from "../model/Service.js";

// CREATE BOOKING
const createBooking = async (req, res, next) => {
  try {
    const { serviceId, bookingDate, timeSlot, notes } = req.body;

    const userId = req.user._id;

    const service = await Service.findById(serviceId);

    if (!service) {
      return next(new HttpError("service not found", 404));
    }

    if (!service.isActive) {
      return next(
        new HttpError(
          "service is currently not active please try again after some time",
          404,
        ),
      );
    }

    const startOfDay = new Date(bookingDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(bookingDate);
    endOfDay.setHours(23, 59, 59, 999);

    const existingBooking = await Booking.findOne({
      serviceId,
      bookingDate: { $gte: startOfDay, $lt: endOfDay },
      status: { $in: ["pending", "confirmed"] },
    });

    if (existingBooking) {
      return next(
        new HttpError(
          "This time slot is already booked for the selected service",
          409,
        ),
      );
    }

    const newBooking = new Booking({
      userId,
      serviceId,
      bookingDate: new Date(bookingDate),
      timeSlot,
      notes,
      totalPrice: service.price,
    });

    await newBooking.save();

    await newBooking.populate([
      {
        path: "serviceId",
        select: "name price duration",
      },
      {
        path: "userId",
        select: "name email phone",
      },
    ]);

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      newBooking,
    });
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

// GET ALL BOOKINGS
const getAllBookings = async (req, res, next) => {
  try {
    let bookings;

    let role = req.user.role;

    if (role === "admin" || role === "super_admin") {
      bookings = await Booking.find({}).populate([
        { path: "serviceId", select: "name price description duration" },
        {
          path: "userId",
          select: "name email phone",
        },
      ]);
    } else if (role === "customer") {
      bookings = await Booking.find({ userId: req.user._id }).populate([
        {
          path: "serviceId",
          select: "name price duration",
        },
        {
          path: "userId",
          select: "name email phone",
        },
      ]);
    } else {
      return next(
        new HttpError("You are not authorized to access booking data", 401),
      );
    }

    if (bookings.length === 0) {
      return res
        .status(200)
        .json({ success: true, message: "No bookings available" });
    }

    res.status(200).json({
      success: true,
      message: "Bookings retrieved successfully",
      bookings,
    });
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

// GET ALL BOOKING BY SERVICE ID
const getBookingByServiceId = async (req, res, next) => {
  try {
    const role = req.user.role;

    const serviceId = req.params.id;

    let bookings;

    console.log("service id", serviceId);

    if (role === "admin" || role === "super_admin") {
      bookings = await Booking.find({}).populate([
        {
          path: "serviceId",
          select: "name price duration description",
        },
        {
          path: "userId",
          select: "name email phone",
        },
      ]);
    } else if (role === "customer") {
      bookings = await Booking.find({
        userId: req.user._id,
        serviceId: serviceId,
      }).populate("serviceId", "name price duration");
    } else {
      return next(
        new HttpError("You are not authorized to access this resource", 401),
      );
    }

    if (!bookings || (bookings.length === 0) === 0) {
      return res
        .status(200)
        .json({ success: true, message: "No bookings found for this service" });
    }

    res.status(200).json({
      success: true,
      message: "Service bookings retrieved successfully",
      bookings,
    });
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

// GET BOOKING BY ID
const getBookingById = async (req, res, next) => {
  try {
    const bookingId = req.params.id;

    const booking = await Booking.findById(bookingId).populate([
      {
        path: "serviceId",
        select: "name price duration description",
      },
      {
        path: "userId",
        select: "name email phone",
      },
    ]);

    if (!booking) {
      return next(new HttpError("Booking not found with the provided ID", 404));
    }

    if (
      req.user.role === "customer" &&
      booking.userId._id.toString() !== req.user._id.toString()
    ) {
      return next(
        new HttpError("You are not allowed to access this booking", 401),
      );
    }

    res.status(200).json({
      success: true,
      message: "Booking details retrieved successfully",
      booking,
    });
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

// GET BOOKINGS (Admin → any user | Customer → own only)
const getBookingsByUserId = async (req, res, next) => {
  try {
    const requestedUserId = req.params.id || req.user._id;

    let bookings;

    bookings = await Booking.find({ userId: requestedUserId });

    if (!bookings.length) {
      return next(new HttpError("No bookings found for this user", 404));
    }

    res.status(200).json({
      success: true,
      message: "User bookings retrieved successfully",
      bookings,
    });
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

// AVAILABLE TIME SLOTS
const availableTimeSlots = async (req, res, next) => {
  try {
    const { serviceId, bookingDate } = req.query;

    const service = await Service.findById(serviceId);

    if (!service) {
      return next(new HttpError("Service not found with the provided ID", 404));
    }

    const startOfDay = new Date(bookingDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(bookingDate);
    endOfDay.setHours(23, 59, 59, 999);

    const bookings = await Booking.find({
      serviceId,
      bookingDate: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
      status: {
        $in: ["pending", "confirmed"],
      },
    });

    const bookedSlots = bookings.map((b) => b.timeSlot);

    const allTimeSlots = [
      "09:00 AM - 10:00 AM",
      "10:00 AM - 11:00 AM",
      "11:00 AM - 12:00 PM",
      "12:00 PM - 01:00 PM",
      "02:00 PM - 03:00 PM",
      "03:00 PM - 04:00 PM",
      "04:00 PM - 05:00 PM",
      "05:00 PM - 06:00 PM",
    ];

    const availableTimeSlots = allTimeSlots.filter(
      (slot) => !bookedSlots.includes(slot),
    );

    res.status(200).json({
      success: true,
      message: availableTimeSlots.length
        ? "Available time slots retrieved successfully"
        : "No time slots available for the selected date",
      availableTimeSlots,
    });
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

// CONFIRM BOOKING
const confirmBooking = async (req, res, next) => {
  try {
    const  id = req.params.id;

    const booking = await Booking.findById(id);

    if (!booking) {
      return next(new HttpError("booking not found", 404));
    }

    if (booking.status === "confirmed") {
      return next(new HttpError("this booking is already confirmed", 404));
    }

    if (booking.status === "cancelled") {
      return next(new HttpError("cancelled can not be confirmed", 400));
    }

    booking.status = "confirmed";

    await booking.save();

    res.status(200).json({
      success: true,
      message: "booking confirmed successfully",
      booking,
    });
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

// CANCEL BOOKING
const cancelledBooking = async (req, res, next) => {
  try {
    const id  = req.params.id;

    const booking = await Booking.findById(id);

    if (!booking) {
      return next(new HttpError("booking not found", 404));
    }

    if (booking.status === "cancelled") {
      return next(new HttpError("this booking is already cancelled", 400));
    }

    if (booking.status === "completed") {
      return next(new HttpError("completed booking can not be cancelled", 400));
    }

    booking.status = "cancelled";

    await booking.save();

    res.status(200).json({
      success: true,
      message: "booking cancelled successfully",
      booking,
    });
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

// COMPLETE BOOKING
const completeBooking = async (req, res, next) => {
  try {
    const id  = req.params.id;

    const booking = await Booking.findById(id);

    if (!booking) {
      return next(new HttpError("booking not found", 404));
    }

    if (booking.status === "completed") {
      return next(new HttpError("this booking is already completed", 400));
    }

    if (booking.status === "cancelled") {
      return next(new HttpError("cancelled booking can not bot be completed", 400));
    }

    booking.status = "completed";

    await booking.save();

    res.status(200).json({
      success: true,
      message: "booking marked as completed successfully",
      booking,
    });
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

export default {
  createBooking,
  getAllBookings,
  getBookingByServiceId,
  getBookingById,
  getBookingsByUserId,
  availableTimeSlots,
  confirmBooking,
  cancelledBooking,
  completeBooking,
};

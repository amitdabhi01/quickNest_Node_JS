import HttpError from "../middleware/HttpError.js";

import Booking from "../model/Booking.js";
import Service from "../model/Service.js";

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
        new HttpError("service already bookend for this time slot", 409),
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
      message: "service booked successfully",
      newBooking,
    });
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

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
      bookings = await Booking.find({ userId: req.user._id }).populate(
        "serviceId",
        "name price duration",
      );
    } else {
      return next(new HttpError("unauthorized access", 401));
    }

    if (bookings.length === 0) {
      return res
        .status(200)
        .json({ success: true, message: "no booking data found" });
    }

    res.status(200).json({
      success: true,
      message: "all booking fetched successfully",
      bookings,
    });
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

const getBookingByServiceId = async (req, res, next) => {
  try {
    let bookings;

    let role = req.user.role;

    let serviceId = req.params.id;

    console.log("service id", serviceId);

    if (role === "admin" || role === "super_admin") {
      let bookings = await Booking.find({ serviceId }).populate([
        { path: "serviceId", select: "name price duration" },
        { path: "userId", select: "name email phone" },
      ]);

      console.log("admin data", bookings);
    } else if (role === "customer") {
      bookings = await Booking.find({
        userId: req.user._id,
        serviceId: serviceId,
      }).populate("serviceId", "name price duration");
    } else {
      return next(new HttpError("unauthorized access", 401));
    }

    if (bookings.length === 0) {
      return res
        .status(200)
        .json({ success: true, message: "no booking data found" });
    }

    res.status(200).json({
      success: true,
      message: "all bookings fetched successfully",
      bookings,
    });
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

const getBookingById = async (req, res, next) => {
  try {
    let bookings;

    let bookingId = req.params.id;

    let userId = req.user._id;

    let role = req.user.role;

    if (role === "admin" || role === "super_admin") {
      bookings = await Booking.findById(bookingId).populate([
        { path: "serviceId", select: "name price duration" },
        {
          path: "userId",
          select: "name email phone",
        },
      ]);
    } else {
      bookings = await Booking.findById(bookingId).populate(
        "serviceId",
        "name price duration",
      );
    }

    if (!bookings) {
      return next(new HttpError("no booking data found", 404));
    }

    if (
      role === "customer" &&
      userId.toString() !== bookings.userId.toString()
    ) {
      return next(new HttpError("unauthorized access", 403));
    }

    res.status(200).json({
      success: true,
      message: "booking data fetch successfully",
      bookings,
    });
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

// GET BOOKINGS (Admin → any user | Customer → own only)
const getBookingByUserId = async (req, res, next) => {
  try {
    let booking;

    let loginUser = req.user._id;

    console.log("userId", loginUser);

    const userId = req.params.id;

    if (loginUser) {
      booking = await Booking.find({ userId: loginUser });
    }

    if (userId) {
      booking = await Booking.find({ userId });
    }

    if (!booking.length) {
      return next(new HttpError("no booking data found", 404));
    }

    res.status(200).json({ success: true, message: "" });
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

const availableTimeSlot = async (req, res, next) => {
  try {
    const { serviceId, bookingDate } = req.query;

    const service = await Service.findById(serviceId);

    if (!service) {
      return next(new HttpError("service not found", 404));
    }

    const startOfDay = new Date(bookingDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(bookingDate);
    endOfDay.setHours(23, 59, 59, 999);

    const existingBooking = await Booking.find({
      serviceId,
      bookingDate: { $gte: startOfDay, $lt: endOfDay },
      status: { $in: ["pending", "confirmed"] },
    });

    const bookedTimeSlot = existingBooking.map((b) => b.timeSlot);

    const TotalTimeSlots = [
      "9:00-10:00",
      "10:00-11:00",
      "11:00-12:00",
      "12:00-13:00",
      "13:00-14:00",
      "14:00-15:00",
      "15:00-16:00",
      "16:00-17:00",
      "17:00-18:00",
    ];

    const availableTimeSlot = TotalTimeSlots.filter(
      (b) => !bookedTimeSlot.includes(b),
    );

    if (!availableTimeSlot.length) {
      return res.status(200).json({
        success: true,
        message: "currently no time slots available",
        slots: [],
      });
    }

    res.status(200).json({
      success: true,
      message: availableTimeSlot.length
        ? "Available time slots retrieved successfully"
        : "No time slots available for the selected date",
      availableTimeSlot,
    });
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

const confirmBooking = async (req, res, next) => {
  try {
    const { id } = req.params.id;

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

const cancelledBooking = async (req, res, next) => {
  try {
    const { id } = req.params.id;

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

const completeBooking = async () => {
  try {
    const { id } = req.params.id;

    const booking = await Booking.findById(id);

    if (!booking) {
      return next(new HttpError("booking not found", 404));
    }

    if (booking.status === "completed") {
      return next(new HttpError("this booking is already completed", 400));
    }

    if (booking.status === "cancelled") {
      return next(new HttpError("cancelled booking can bot be completed", 400));
    }

    booking.status = "completed";

    await booking.save();

    res
      .status(200)
      .json({
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
  getBookingByUserId,
  availableTimeSlot,
  confirmBooking,
  cancelledBooking,
  completeBooking,
};

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

    res
      .status(201)
      .json({
        success: true,
        message: "service booked successfully",
        newBooking,
      });
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

export default { createBooking };

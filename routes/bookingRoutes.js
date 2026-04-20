import express from "express";

import auth from "../middleware/auth.js";
import bookingController from "../controller/bookingController.js";
import checkRole from "../middleware/checkRole.js";

const router = express.Router();

router.post("/addBooking", auth, bookingController.createBooking);

// get all booking
router.get("/allBookings", auth, bookingController.getAllBookings);

// Own bookings (customer)
router.get("/user", auth, bookingController.getBookingsByUserId);

router.get("/service/:id", auth, bookingController.getBookingByServiceId);

// get booking byId
router.get("/my/:id", auth, bookingController.getBookingById);

// get booking by userId user (only admin and super_admin)
router.get(
  "/user/:id",
  auth,
  checkRole("admin", "super_admin"),
  bookingController.getBookingsByUserId,
);

// available time slots
router.get("/availableTimeSlots", auth, bookingController.availableTimeSlots);

// confirm booking
router.patch(
  "/confirm/:id",
  auth,
  checkRole("admin", "super_admin"),
  bookingController.confirmBooking,
);

// cancel booking
router.patch(
  "/cancel/:id",
  auth,
  checkRole("admin", "super_admin"),
  bookingController.cancelledBooking,
);

//complete booking
router.patch(
  "/complete/:id",
  auth,
  checkRole("admin", "super_admin"),
  bookingController.completeBooking,
);

export default router;

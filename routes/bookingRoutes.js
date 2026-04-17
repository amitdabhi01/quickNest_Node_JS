import express from "express";

import auth from "../middleware/auth.js";
import bookingController from "../controller/bookingController.js";

const router = express.Router();

router.post("/booking", auth, bookingController.createBooking);

router.get("/allBookings", auth, bookingController.getAllBookings);

router.get(
  "/allBookingByServiceId",
  auth,
  bookingController.getBookingByServiceId,
);

export default router;

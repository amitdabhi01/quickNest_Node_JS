import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  userId: {
    type:mongoose.       
  },
});

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;

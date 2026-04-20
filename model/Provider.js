import { required, types } from "joi";
import mongoose from "mongoose";

const providerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "USer",
      required: true,
      unique: true,
    },

    services: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
        required: true,
      },
    ],

    document: {
      type: String,
      required: true,
      trim: true,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    experience: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true },
);

const Provider = mongoose.model("Provider", providerSchema);

export default Provider;

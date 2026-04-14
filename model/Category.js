import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

categorySchema.virtual("services", {
  ref: "Services",
  localField: "_id",
  foreignField: "category",
});

const Category = mongoose.model("Category", categorySchema);

export default Category;

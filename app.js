import express from "express";
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import HttpError from "./middleware/HttpError.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config({ path: "./.env" });

const app = express();

app.use(express.json());

app.use("/user", userRoutes);

app.get("/", (req, res) => {
  res.status(200).json("Hello From Server");
});

app.use((req, res, next) => {
  next(new HttpError("requested routes not found", 404));
});

app.use((error, req, res, next) => {
  if (req.headerSent) {
    return next(error);
  }
  res
    .status(error.statusCode || 500)
    .json({ message: error.message || "Internal server error" });
});

async function startServer() {
  try {
    await connectDB();

    const port = process.env.PORT || 5000;

    app.listen(port, () => {
      console.log(`Server Running On Port ${port}`);
    });
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
}

startServer();

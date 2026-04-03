import jwt from "jsonwebtoken";

import HttpError from "./HttpError.js";
import User from "../model/User.js";

const auth = async function (req, res, next) {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader) {
      return next(new HttpError("auth header is required", 401));     
    }

    const token = authHeader.replace("Bearer ", "");

    const decode = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({
      _id: decode._id,
      "tokens.token": token,
    });

    if (!user) {
      return next(new HttpError("authentication failed", 401));
    }

    req.user = user;

    req.token = token;

    await user.save();

    next();
  } catch (error) {
    next(new HttpError("please authenticate", 401));
  }
};

export default auth;

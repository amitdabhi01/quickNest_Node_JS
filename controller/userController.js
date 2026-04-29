import cloudinary from "../config/cloudinary.js";

import HttpError from "../middleware/HttpError.js";
import uploads from "../middleware/upload.js";

import User from "../model/User.js";

import sendEmail from "../utils/sendEmail.js";
import { getWelcomeEmailTemplate } from "../services/emailTemplate.js";


const add = async (req, res, next) => {
  try {
    const { name, email, password, phone, role } = req.body;

    const newUser = {
      name,
      email,
      password,
      phone,
      role,
      profilePic: req.file ? req.file.path : "undefined",
      cloudinaryId: req.file ? req.file.filename : "undefined",
    };

    console.log("cloudinaryId", newUser.cloudinaryId);

    const user = new User(newUser);

    await user.save();

    sendEmail({
      to: newUser.email,
      subject: "Welcome to QuickNest",
      html: getWelcomeEmailTemplate(newUser.name),
    });

    res.status(201).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findByCredentials(email, password);

    const token = await user.generateAuthToken();

    if (!user) {
      return next(new HttpError("Unable to login ", 400));
    }

    res
      .status(200)
      .json({ success: true, message: "Login Successfully", user, token });
  } catch (error) {
    next(new HttpError(error.message, 404));
  }
};

const authLogin = async (req, res, next) => {
  try {
    const user = req.user;

    if (!user) {
      return next(new HttpError("Unable to login"));
    }

    res.status(201).json({ success: true, user });
  } catch (error) {
    next(new HttpError(error.message, 404));
  }
};

const logOut = async (req, res, next) => {
  try {
    const token = req.token;

    req.user.tokens = req.user.tokens.filter((t) => {
      return t.token !== token;
    });

    await req.user.save();

    res.status(200).json({
      success: true,
      message: "User LogOut Successfully",
    });
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

const logOutAll = async (req, res, next) => {
  try {
    req.user.tokens = [];

    await req.user.save();

    res
      .status(200)
      .json({ success: true, message: "User Logout from all device" });
  } catch (error) {
    next(new HttpError(error.message, 404));
  }
};

const getAll = async (req, res, next) => {
  try {
    const users = await User.find({});

    if (users.length === 0) {
      res
        .status(200)
        .json({ success: true, message: "No any users are there" });
    }

    res.status(200).json({ success: true, message: "all users", users });
  } catch (error) {
    next(new HttpError(error.message, 404));
  }
};

const update = async (req, res, next) => {
  try {
    let targetUser = req.params.id || req.user._id;

    const user = await User.findById(targetUser);

    if (!user) {
      return next(new HttpError("User not found", 404));
    }

    const update = Object.keys(req.body);

    let allowedFields = ["name", "password", "phone", "profilePic"];

    if (req.user.role === "admin" || req.user.role === "super_admin") {
      allowedFields = [...allowedFields, "role", "isVerified"];
    }

    const isValid = update.every((filed) => allowedFields.includes(filed));

    if (!isValid) {
      return next(new HttpError("Only allowed fields can be updated", 400));
    }

    if (
      !role.user.role === "admin" &&
      !req.user.role === "super_admin" &&
      !req.user.user._id.toString() !== user._id.toString()
    ) {
      return next(new HttpError("Unauthorized Access", 401));
    }

    update.forEach((update) => (user[update] = req.body[update]));

    if (req.file) {
      if (user.cloudinaryId) {
        await cloudinary.destroy(user.cloudinaryId);
      }

      user.profilePic = req.file.path;

      user.cloudinaryId = req.file.path;
    }

    await user.save();

    res
      .status(200)
      .json({ success: true, message: "User updated successfully", user });
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const targetUser = req.params.id || req.user._id;

    const user = await User.findById(targetUser);

    if (!user) {
      return next(new HttpError("User not found", 404));
    }

    if (
      !req.user.role === "admin" &&
      !req.user.role === "super_admin" &&
      !req.user._id.toString() !== user._id.toString()
    ) {
      return next(new HttpError("Unauthorized Access", 401));
    }

    await User.deleteOne(user);

    if (user.cloudinaryId) {
      await cloudinary.uploader.destroy(user.cloudinaryId);
    }

    res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    return next(new HttpError(error.message, 500));
  }
};

export default {
  add,
  login,
  authLogin,
  logOut,
  logOutAll,
  getAll,
  update,
  deleteUser,
};

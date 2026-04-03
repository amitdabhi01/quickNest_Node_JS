import cloudinary from "../config/cloudinary.js";
import HttpError from "../middleware/HttpError.js";
import uploads from "../middleware/upload.js";
import User from "../model/User.js";

const add = async (req, res, next) => {
  try {
    const { name, email, password, phone, roll } = req.body;

    const newUser = {
      name,
      email,
      password,
      phone,
      roll,
      profilePic: req.file ? req.file.path : "undefined",
      cloudinaryId: req.file ? req.file.filename : "undefined",
    };

    console.log("cloudinaryId", newUser.cloudinaryId);

    const user = new User(newUser);

    await user.save();

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
    req.user.tokens = req.user.tokens.filter((t) => {
      return t.token != token;
    });

    await req.user.save();

    res
      .status(200)
      .json({ success: true, message: "User LogOut Successfully" });
  } catch (error) {
    next(new HttpError(error.message, 404));
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
    const user = req.user;

    if (!user) {
      return next(new HttpError("user not found", 404));
    }

    const updates = Object.keys(req.body);

    const allowedField = ["name", "password", "phone"];

    const isValid = updates.every((field) => allowedField.includes(field));

    if (!isValid) {
      return next(new HttpError("only allowed fields can be updated", 400));
    }

    uploads.forEach((update) => (user[update] = req.body[update]));

    if (req.file) {
      await cloudinary.uploader.destroy(user.cloudinaryId);

      user.profilePic = req.file.path;

      user.cloudinaryId = req.file.filename;
    }

    await user.save();

    res
      .status(200)
      .json({ success: true, message: "user update successfully", user });
  } catch (error) {
    next(new HttpError(error.message, 404));
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const user = req.user;

    await User.deleteOne(user);

    await cloudinary.uploader.destroy(user.cloudinaryId);

    res
      .status(200)
      .json({ success: true, message: "user delete successfully" });
  } catch (error) {
    next(new HttpError(error.message, 500));
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

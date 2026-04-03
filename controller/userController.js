import HttpError from "../middleware/HttpError.js";
import User from "../model/User.js";

const addUser = async (req, res, next) => {
  try {
    const { name, email, password, phone, roll } = req.body;

    const newUser = {
      name,
      email,
      password,
      phone,
      roll,
    };

    const user = new User(newUser);

    await user.save();

    res.status(201).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findByCredentials(email, password);

    if (!user) {
      return next(new HttpError("Unable to login ", 400));
    }

    const token = await user.generateAuthToken();

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

    req.user.save();

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
      .json({ success: true, message: "User Logout from all device" });``
  } catch (error) {
    next(new HttpError(error.message, 404));
  }
};

const getAllUsers = async (req, res, next) => {
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

  const updateUser = async (req, res, next) => {
    try {
      const user = req.user;

      if (!user) {
        return next(new HttpError("user not found", 404));
      }

      const update = Object.keys(req.body);

      const allowedFields = ["name", "phone", "password"];

      const isValid = update.every((field) => allowedFields.includes(field));

      if (!isValid) {
                       
      }

    } catch (error) {
      next(new HttpError(error.message, 404));
    }
  };
};

export default {
  addUser,
  loginUser,
  authLogin,
  logOut,
  logOutAll,
  getAllUsers,
};

import HttpError from "../middleware/HttpError.js";
import User from "../model/User.js";

const updateUserData = async (req, res, next) => {
  try {
    const id = req.params.id;

    const user = await User.findById({ id });

    if (!user) {
      return next(new HttpError("user not found with this id", 404));
    }

    const updates = Object.keys(req.body);

    const allowedField = [
      "name",
      "email",
      "password",
      "phone",
      "role",
      "profilePic",
      "isVerified",
    ];

    const isValid = updates.every((field) => allowedField.includes(field));

    if (!isValid) {
      return next(new HttpError("only allow field can updated", 400));
    }

    updates.forEach((update) => (user[update] = req.body[update]));

    await user.save();

    res
      .status(200)
      .json({ success: true, message: "user update successfully", user });
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const id = req.params.id;

    const user = await User.findByIdAndDelete(id);

    res
      .status(200)
      .json({ success: true, message: "user deleted successfully" });
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

export default { updateUserData, deleteUser };

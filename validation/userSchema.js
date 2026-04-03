import Joi from "joi";

const UserSchema = Joi.object({
  name: Joi.string().trim().min(2).label("Name").messages({
    "string.base": "Name must be in string format",
    "string.empty": "name is required",
    "string.min": "name must be at least 2 character long",
  }),

  email: Joi.string().email().label("Email").messages({
    "string.empty": "email is required",
  }),

  password: Joi.string()
    .min(6)
    .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
    .label("Password")
    .messages({
      "string.empty": "password is required",
      "string.min": "password at least must be 6 character long",
    }),

  phone: Joi.number().min(1000000000).max(9999999999).label("Phone").messages({
    "number.empty": "number is required",
  }),

  profilePic: Joi.string()
    .label("profilePic")
    .valid("customer", "provider", "admin", "super_admin")
    .messages({
      "string.base": "url must be in string format",
    }),

  role: Joi.string()
    .valid("customer", "provider", "admin", "super_admin")
    .optional()
    .label("Role")
    .messages({
      "string.empty":
        "role is required from any of these customer, provider, admin, super-admin",
    }),
});

export const createUserSchema = UserSchema.fork(
  ["name", "email", "password", "phone"],
  (fields) => fields.required(),
).messages({
  "any.required": "{#label} is required",
});

export const updateUserSchema = UserSchema.fork(
  ["name", "password", "phone", "profilePic"],
  (fields) => fields.optional(),
)
  .fork(["role", "email"], (fields) => fields.forbidden())
  .or("name", "password", "phone", "profilePic")
  .messages({
    "object.missing":
      "name, password or phone or profilePic any of these field required when updating",
  });

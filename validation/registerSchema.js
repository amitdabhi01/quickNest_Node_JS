import Joi from "joi";

const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .trim()
    .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
    .required()
    .min(6),
  phone: Joi.number().min(1000000000).max(9999999999).required(),
  role: Joi.string().valid("customer", "provider", "admin", "super_admin"),
});

export default registerSchema;

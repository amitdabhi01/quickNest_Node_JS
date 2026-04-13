import Joi from "joi";

const ServiceSchema = Joi.object({
  title: Joi.string().min(2).max(50).trim().label("Service title").messages({
    "string.base": "Service title must be in string format",
    "string.empty": "Service title is required",
    "string.min": "Service title must be at least 2 characters long",
    "string.max": "Service title must not exceed 50 characters",
  }),
  description: Joi.string()
    .max(500)
    .trim()
    .optional()
    .label("Description")
    .messages({
      "string.base": "Description must be in string format",
      "string.max": "Description must not exceed 500 characters",
    }),
  price: Joi.number().positive().precision(2).label("Price").messages({
    "number.base": "Price must be a number",
    "number.positive": "Price must be greater than 0",
  }),
  duration: Joi.number()
    .positive()
    .integer()
    .optional()
    .label("Duration")
    .messages({
      "number.base": "Duration must be a number",
      "number.positive": "Duration must be greater than 0",
      "number.integer": "Duration must be a whole number",
    }),
  category: Joi.string().required().label("Category").messages({
    "string.empty": "Category is required",
    "string.base": "Category must be a valid ID",
    "any.required": "Category is required",
  }),
  isActive: Joi.boolean().optional().label("Active Status").messages({
    "boolean.base": "isActive must be a boolean value",
  }),
});

export const createServiceSchema = ServiceSchema.fork(
  ["title", "price", "category"],
  (fields) => fields.required(),
).messages({
  "any.required": "{#label} is required",
});

export const updateServiceSchema = ServiceSchema.fork(
  ["title", "price", "duration", "description", "category", "isActive"],
  (fields) => fields.optional(),
)
  .or("title", "price", "duration", "description", "category", "isActive")
  .messages({
    "object.missing":
      "title, price, duration, description, category or isActive any of these fields is required when updating",
  });

export default createServiceSchema;

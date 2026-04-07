import Joi from "joi";

const categorySchema = Joi.object({
  name: Joi.string().trim().min(2).label("name").messages({
    "string.base": "name must be in string",
    "string.empty": "name is required",
    "string.min": "name must be greater than 2 characters",
  }),

  description: Joi.string().trim().label("description").messages({
    "string.base": "description must be in string",
  }),
});

// CREATE (all required)
export const createCategorySchema = categorySchema
  .fork(["name", "description"], (field) => field.required())
  .messages({
    "any.required": "{#label} is required",
  });

// UPDATE (all optional BUT at least one required)
export const updateCategorySchema = categorySchema
  .fork(["name", "description"], (field) => field.optional())
  .or("name", "description")
  .messages({
    "object.missing": "At least one field (name or description) is required",
  });

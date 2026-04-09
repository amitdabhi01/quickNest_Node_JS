import Joi from "joi";

const serviceSchema = Joi.object({
  title: Joi.string().trim().min(2).label("title").messages({
    "string.base": "title must be in string",
    "string.empty": "tittle must be required",
    "string.min": "title must be grater than 2 character",
  }),
  price: Joi.number().label("price")
});


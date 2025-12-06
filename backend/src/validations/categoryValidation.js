import Joi from "joi";

export const categorySchema = Joi.object({
  name: Joi.string().min(1).max(30).required(),
  type: Joi.string().valid("income", "expense").required(),
  color: Joi.string().optional(),
  icon: Joi.string().optional(),
});

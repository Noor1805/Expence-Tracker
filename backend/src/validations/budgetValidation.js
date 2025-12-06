import Joi from "joi";

export const budgetSchema = Joi.object({
  overallBudget: Joi.number().min(0).optional(),

  categoryBudgets: Joi.array()
    .items(
      Joi.object({
        category: Joi.string().required(),
        amount: Joi.number().min(0).required(),
      })
    )
    .optional(),

  month: Joi.number().min(0).max(11).required(), // 0 = Jan, 11 = Dec
  year: Joi.number().min(2000).max(2100).required(),
});

import {body} from "express-validator";

export const createTransactionValidation = [
    body("amount")
    .notEmpty()
    .withMessage("Amount is required")
    .isNumeric()
    .withMessage("Amount must be a number")
    .custom(value => value > 0)
    .withMessage("Amount must be greater than 0"),

    body("type")
    .notEmpty()
    .withMessage("Type is required")
    .isIn(["income", "expense"])
    .withMessage("Type must be income or expense"),

    body("category")
    .notEmpty()
    .withMessage("Category is required"),

    body("paymentMethod")
    .optional()
    .isIn(["cash", "card", "upi", "bank", "other"])
    .withMessage("Invalid payment method"),

    body("date")
    .notEmpty()
    .withMessage("Date is required")
    .isISO8601()
    .withMessage("Invalid date format"),

  body("note")
    .optional()
    .isLength({ max: 200 })
    .withMessage("Note cannot exceed 200 characters")

]

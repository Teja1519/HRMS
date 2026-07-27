const { body } = require("express-validator");
const { handleValidationErrors } = require("./validate");

const registerValidation = [
  body("Username")
    .trim()
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 3, max: 100 })
    .withMessage("Username must be between 3 and 100 characters"),

  body("Password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 4 })
    .withMessage("Password must be at least 4 characters long"),

  body("Role")
    .optional()
    .isIn(["Admin", "HR", "Employee", "Manager"])
    .withMessage("Role must be Admin, HR, Employee, or Manager"),

  handleValidationErrors,
];

const loginValidation = [
  body("Username").trim().notEmpty().withMessage("Username is required"),
  body("Password").notEmpty().withMessage("Password is required"),
  handleValidationErrors,
];

const forgotPasswordValidation = [
  body("Username").trim().notEmpty().withMessage("Username is required"),
  handleValidationErrors,
];

const resetPasswordValidation = [
  body("Token").notEmpty().withMessage("Reset token is required"),
  body("NewPassword")
    .notEmpty()
    .withMessage("New password is required")
    .isLength({ min: 4 })
    .withMessage("Password must be at least 4 characters long"),
  handleValidationErrors,
];

module.exports = {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
};

const { body } = require("express-validator");

const registerValidation = [
  body("Username")
    .trim()
    .notEmpty().withMessage("Username is required")
    .isLength({ min: 3, max: 50 }).withMessage("Username must be 3-50 characters"),

  body("Password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),

  body("Role")
    .notEmpty().withMessage("Role is required")
    .isIn(["Admin", "HR", "Employee"]).withMessage("Role must be Admin, HR, or Employee"),
];

const loginValidation = [
  body("Username").trim().notEmpty().withMessage("Username is required"),
  body("Password").notEmpty().withMessage("Password is required"),
];

module.exports = { registerValidation, loginValidation };

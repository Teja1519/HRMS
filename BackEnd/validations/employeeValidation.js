const { body } = require("express-validator");

const employeeValidation = [
  body("EmployeeCode")
    .trim()
    .notEmpty().withMessage("Employee code is required"),

  body("FirstName")
    .trim()
    .notEmpty().withMessage("First name is required")
    .isLength({ max: 100 }).withMessage("First name too long"),

  body("LastName")
    .trim()
    .notEmpty().withMessage("Last name is required")
    .isLength({ max: 100 }).withMessage("Last name too long"),

  body("Email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email address"),

  body("Phone")
    .optional()
    .isMobilePhone().withMessage("Invalid phone number"),

  body("Gender")
    .optional()
    .isIn(["Male", "Female", "Other"]).withMessage("Gender must be Male, Female, or Other"),

  body("Salary")
    .optional()
    .isFloat({ min: 0 }).withMessage("Salary must be a positive number"),

  body("Status")
    .optional()
    .isIn(["Active", "Inactive", "Terminated"]).withMessage("Invalid status"),
];

module.exports = { employeeValidation };

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
    .optional({ nullable: true, checkFalsy: true }),

  body("Gender")
    .optional({ nullable: true, checkFalsy: true })
    .isIn(["Male", "Female", "Other"]).withMessage("Gender must be Male, Female, or Other"),

  body("Salary")
    .optional({ nullable: true })
    .isFloat({ min: 0 }).withMessage("Salary must be a positive number"),

  body("DepartmentId")
    .optional({ nullable: true })
    .isInt().withMessage("Department ID must be an integer"),

  body("Status")
    .optional({ nullable: true })
    .isIn(["Active", "Inactive", "Terminated"]).withMessage("Invalid status"),
];

const employeeUpdateValidation = [
  body("FirstName")
    .optional()
    .trim()
    .notEmpty().withMessage("First name cannot be empty")
    .isLength({ max: 100 }).withMessage("First name too long"),

  body("LastName")
    .optional()
    .trim()
    .notEmpty().withMessage("Last name cannot be empty")
    .isLength({ max: 100 }).withMessage("Last name too long"),

  body("Email")
    .optional()
    .trim()
    .isEmail().withMessage("Invalid email address"),

  body("Phone")
    .optional({ nullable: true, checkFalsy: true }),

  body("Salary")
    .optional({ nullable: true })
    .isFloat({ min: 0 }).withMessage("Salary must be a positive number"),

  body("DepartmentId")
    .optional({ nullable: true }),

  body("Status")
    .optional({ nullable: true })
    .isIn(["Active", "Inactive", "Terminated"]).withMessage("Invalid status"),
];

module.exports = { employeeValidation, employeeUpdateValidation };

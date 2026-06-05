const { body } = require("express-validator");

// ─── Department ───────────────────────────────────────────────────────────────
const departmentValidation = [
  body("DepartmentName")
    .trim()
    .notEmpty().withMessage("Department name is required")
    .isLength({ max: 100 }).withMessage("Department name too long"),

  body("Description")
    .optional()
    .isLength({ max: 500 }).withMessage("Description too long"),
];

// ─── Leave Application ────────────────────────────────────────────────────────
const leaveApplicationValidation = [
  body("LeaveTypeId")
    .notEmpty().withMessage("Leave type is required")
    .isInt().withMessage("Invalid leave type"),

  body("StartDate")
    .notEmpty().withMessage("Start date is required")
    .isDate().withMessage("Invalid start date"),

  body("EndDate")
    .notEmpty().withMessage("End date is required")
    .isDate().withMessage("Invalid end date")
    .custom((endDate, { req }) => {
      if (new Date(endDate) < new Date(req.body.StartDate)) {
        throw new Error("End date must be after start date");
      }
      return true;
    }),

  body("Reason")
    .optional()
    .isLength({ max: 500 }).withMessage("Reason too long"),
];

// ─── Payroll ──────────────────────────────────────────────────────────────────
const payrollValidation = [
  body("EmployeeId")
    .notEmpty().withMessage("Employee ID is required")
    .isInt().withMessage("Invalid employee ID"),

  body("PayrollMonth")
    .notEmpty().withMessage("Payroll month is required")
    .matches(/^\d{4}-(0[1-9]|1[0-2])$/).withMessage("Payroll month format must be YYYY-MM"),

  body("BasicSalary")
    .notEmpty().withMessage("Basic salary is required")
    .isFloat({ min: 0 }).withMessage("Basic salary must be a positive number"),

  body("Allowances")
    .optional()
    .isFloat({ min: 0 }).withMessage("Allowances must be a positive number"),

  body("Bonus")
    .optional()
    .isFloat({ min: 0 }).withMessage("Bonus must be a positive number"),

  body("Deductions")
    .optional()
    .isFloat({ min: 0 }).withMessage("Deductions must be a positive number"),
];

module.exports = {
  departmentValidation,
  leaveApplicationValidation,
  payrollValidation,
};

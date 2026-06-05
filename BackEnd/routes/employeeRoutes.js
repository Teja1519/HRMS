const express = require("express");
const router = express.Router();

const {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} = require("../controllers/employeeController");

const { employeeValidation } = require("../validations/employeeValidation");
const { handleValidationErrors } = require("../validations/validate");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

// All routes require authentication
router.use(protect);

// GET /api/employees  — Admin, HR
router.get("/", authorize("Admin", "HR"), getAllEmployees);

// GET /api/employees/:id  — Admin, HR, Employee (own profile handled in frontend)
router.get("/:id", authorize("Admin", "HR", "Employee"), getEmployeeById);

// POST /api/employees  — Admin, HR
router.post("/", authorize("Admin", "HR"), employeeValidation, handleValidationErrors, createEmployee);

// PUT /api/employees/:id  — Admin, HR
router.put("/:id", authorize("Admin", "HR"), updateEmployee);

// DELETE /api/employees/:id  — Admin only
router.delete("/:id", authorize("Admin"), deleteEmployee);

module.exports = router;

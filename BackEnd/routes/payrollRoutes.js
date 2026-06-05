const express = require("express");
const router = express.Router();

const {
  getAllPayroll,
  getPayrollByEmployee,
  createPayroll,
  updatePayroll,
  deletePayroll,
} = require("../controllers/payrollController");

const { payrollValidation } = require("../validations/otherValidations");
const { handleValidationErrors } = require("../validations/validate");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

router.use(protect);

router.get("/", authorize("Admin", "HR"), getAllPayroll);
router.get("/employee/:employeeId", authorize("Admin", "HR", "Employee"), getPayrollByEmployee);
router.post("/", authorize("Admin", "HR"), payrollValidation, handleValidationErrors, createPayroll);
router.put("/:id", authorize("Admin", "HR"), updatePayroll);
router.delete("/:id", authorize("Admin"), deletePayroll);

module.exports = router;

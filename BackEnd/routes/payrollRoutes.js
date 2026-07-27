const express = require("express");
const router = express.Router();
const payrollController = require("../controllers/payrollController");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

router.use(protect);

router.get("/my-payroll", payrollController.getMyPayroll);
router.get("/:id", payrollController.getPayrollById);
router.get("/employee/:employeeId", payrollController.getPayrollByEmployee);

router.get("/", authorize("Admin", "HR", "Manager"), payrollController.getAllPayroll);
router.post("/", authorize("Admin", "HR", "Manager"), payrollController.createPayroll);
router.put("/:id", authorize("Admin", "HR", "Manager"), payrollController.updatePayroll);
router.delete("/:id", authorize("Admin", "HR"), payrollController.deletePayroll);

module.exports = router;

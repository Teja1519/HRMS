const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportController");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

router.use(protect);
router.use(authorize("Admin", "HR", "Manager"));

router.get("/summary", reportController.getSummaryReport);
router.get("/attendance", reportController.getAttendanceReport);
router.get("/leaves", reportController.getLeaveReport);
router.get("/payroll", reportController.getPayrollReport);
router.get("/employees", reportController.getEmployeeReport);
router.get("/", reportController.getSummaryReport);

module.exports = router;

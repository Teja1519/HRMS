const express = require("express");
const router = express.Router();

const {
  getAdminDashboard,
  getHRDashboard,
  getEmployeeDashboard,
} = require("../controllers/dashboardController");

const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

router.use(protect);

// GET /api/dashboard/admin
router.get("/admin", authorize("Admin"), getAdminDashboard);

// GET /api/dashboard/hr
router.get("/hr", authorize("Admin", "HR"), getHRDashboard);

// GET /api/dashboard/employee/:employeeId
router.get("/employee/:employeeId", authorize("Admin", "HR", "Employee"), getEmployeeDashboard);

module.exports = router;

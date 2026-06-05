const express = require("express");
const router = express.Router();

const {
  checkIn,
  checkOut,
  getAllAttendance,
  getAttendanceByEmployee,
} = require("../controllers/attendanceController");

const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

router.use(protect);

// POST /api/attendance/checkin  — Employee, HR, Admin
router.post("/checkin", authorize("Admin", "HR", "Employee"), checkIn);

// POST /api/attendance/checkout  — Employee, HR, Admin
router.post("/checkout", authorize("Admin", "HR", "Employee"), checkOut);

// GET /api/attendance  — Admin, HR
router.get("/", authorize("Admin", "HR"), getAllAttendance);

// GET /api/attendance/:employeeId  — Admin, HR, Employee
router.get("/:employeeId", authorize("Admin", "HR", "Employee"), getAttendanceByEmployee);

module.exports = router;

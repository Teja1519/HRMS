const express = require("express");
const router = express.Router();
const attendanceController = require("../controllers/attendanceController");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

router.use(protect);

router.post("/checkin", attendanceController.checkIn);
router.post("/checkout", attendanceController.checkOut);
router.get("/today", attendanceController.getTodayStatus);

router.get("/late", authorize("Admin", "HR", "Manager"), attendanceController.getLateReport);
router.get("/absent", authorize("Admin", "HR", "Manager"), attendanceController.getAbsentReport);

router.get("/employee/:employeeId", attendanceController.getAttendanceByEmployee);
router.get("/", authorize("Admin", "HR", "Manager"), attendanceController.getAllAttendance);

module.exports = router;

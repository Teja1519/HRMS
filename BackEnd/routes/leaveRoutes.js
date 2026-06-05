const express = require("express");
const router = express.Router();

const {
  getAllLeaveTypes,
  createLeaveType,
  updateLeaveType,
  deleteLeaveType,
  applyLeave,
  getAllLeaveRequests,
  getMyLeaveRequests,
  approveLeave,
  rejectLeave,
} = require("../controllers/leaveController");

const { leaveApplicationValidation } = require("../validations/otherValidations");
const { handleValidationErrors } = require("../validations/validate");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

router.use(protect);

// ─── Leave Types ──────────────────────────────────────────────────────────────
router.get("/types", authorize("Admin", "HR", "Employee"), getAllLeaveTypes);
router.post("/types", authorize("Admin", "HR"), createLeaveType);
router.put("/types/:id", authorize("Admin", "HR"), updateLeaveType);
router.delete("/types/:id", authorize("Admin"), deleteLeaveType);

// ─── Leave Requests ───────────────────────────────────────────────────────────
// POST /api/leaves/apply  — Employee
router.post("/apply", authorize("Admin", "HR", "Employee"), leaveApplicationValidation, handleValidationErrors, applyLeave);

// GET /api/leaves  — Admin, HR
router.get("/", authorize("Admin", "HR"), getAllLeaveRequests);

// GET /api/leaves/employee/:employeeId
router.get("/employee/:employeeId", authorize("Admin", "HR", "Employee"), getMyLeaveRequests);

// PUT /api/leaves/:id/approve  — Admin, HR
router.put("/:id/approve", authorize("Admin", "HR"), approveLeave);

// PUT /api/leaves/:id/reject  — Admin, HR
router.put("/:id/reject", authorize("Admin", "HR"), rejectLeave);

module.exports = router;

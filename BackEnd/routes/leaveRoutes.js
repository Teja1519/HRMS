const express = require("express");
const router = express.Router();
const leaveController = require("../controllers/leaveController");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

router.use(protect);

router.get("/types", leaveController.getLeaveTypes);
router.post("/apply", leaveController.applyLeave);
router.get("/my-leaves", leaveController.getMyLeaves);
router.get("/stats", leaveController.getLeaveStats);

router.put("/:id/cancel", leaveController.cancelLeave);
router.put("/:id/status", authorize("Admin", "HR", "Manager"), leaveController.updateLeaveStatus);

router.get("/", authorize("Admin", "HR", "Manager"), leaveController.getAllLeaves);

module.exports = router;

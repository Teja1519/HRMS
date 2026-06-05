const express = require("express");
const router = express.Router();

const {
  getNotifications,
  getUnreadNotifications,
  createNotification,
  markAsRead,
  markAllAsRead,
} = require("../controllers/notificationController");

const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

router.use(protect);

// GET /api/notifications  — all notifications for logged-in user
router.get("/", getNotifications);

// GET /api/notifications/unread
router.get("/unread", getUnreadNotifications);

// POST /api/notifications  — Admin, HR can create
router.post("/", authorize("Admin", "HR"), createNotification);

// PUT /api/notifications/read-all
router.put("/read-all", markAllAsRead);

// PUT /api/notifications/:id/read
router.put("/:id/read", markAsRead);

module.exports = router;

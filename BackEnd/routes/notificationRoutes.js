const express = require("express");
const router = express.Router();

const {
  getNotifications,
  getUnreadNotifications,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  markAsRead,
  markAllAsRead,
} = require("../controllers/notificationController");

const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

router.use(protect);

// GET /api/notifications — notifications/announcements for logged-in user
router.get("/", getNotifications);

// GET /api/notifications/unread
router.get("/unread", getUnreadNotifications);

// POST /api/notifications — Admin, HR, Manager can create announcement
router.post("/", authorize("Admin", "HR", "Manager"), createAnnouncement);

// PUT /api/notifications/:id — Admin, HR, Manager can update announcement
router.put("/:id", authorize("Admin", "HR", "Manager"), updateAnnouncement);

// DELETE /api/notifications/:id — Admin, HR, Manager can delete announcement
router.delete("/:id", authorize("Admin", "HR", "Manager"), deleteAnnouncement);

// PUT /api/notifications/read-all
router.put("/read-all", markAllAsRead);

// PUT /api/notifications/:id/read
router.put("/:id/read", markAsRead);

module.exports = router;

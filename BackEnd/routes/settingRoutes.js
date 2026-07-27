const express = require("express");
const router = express.Router();

const { getSettings, updateSettings } = require("../controllers/settingController");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

router.use(protect);

// GET /api/settings — Admin, HR, Employee
router.get("/", getSettings);

// PUT /api/settings — Admin only
router.put("/", authorize("Admin"), updateSettings);

module.exports = router;

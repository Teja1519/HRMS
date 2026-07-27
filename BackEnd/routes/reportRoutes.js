const express = require("express");
const router = express.Router();

const { getSummaryReport } = require("../controllers/reportController");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

router.use(protect);

// GET /api/reports/summary — Admin, HR
router.get("/summary", authorize("Admin", "HR"), getSummaryReport);
router.get("/", authorize("Admin", "HR"), getSummaryReport);

module.exports = router;

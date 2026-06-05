const express = require("express");
const router = express.Router();

const { register, login, getMe } = require("../controllers/authController");
const { registerValidation, loginValidation } = require("../validations/authValidation");
const { handleValidationErrors } = require("../validations/validate");
const { protect } = require("../middleware/authMiddleware");

// POST /api/auth/register
router.post("/register", registerValidation, handleValidationErrors, register);

// POST /api/auth/login
router.post("/login", loginValidation, handleValidationErrors, login);

// GET /api/auth/me  (protected)
router.get("/me", protect, getMe);

module.exports = router;

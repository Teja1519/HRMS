const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
} = require("../validations/authValidation");

// Public authentication endpoints
router.post("/login", loginValidation, authController.login);
router.post("/register", registerValidation, authController.register);
router.post("/refresh", authController.refresh);
router.post("/forgot-password", forgotPasswordValidation, authController.forgotPassword);
router.post("/reset-password", resetPasswordValidation, authController.resetPassword);

// Protected authentication endpoints
router.post("/logout", protect, authController.logout);
router.get("/me", protect, authController.getMe);

module.exports = router;

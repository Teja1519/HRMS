const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profileController");
const { protect } = require("../middleware/authMiddleware");
const { uploadAvatar } = require("../middleware/uploadMiddleware");

router.use(protect);

router.get("/", profileController.getProfile);
router.put("/", profileController.updateProfile);
router.post("/upload-photo", uploadAvatar.single("photo"), profileController.uploadPhoto);
router.delete("/photo", profileController.deletePhoto);
router.put("/change-password", profileController.changePassword);

module.exports = router;

const express = require("express");
const router = express.Router();

const {
  getAllDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} = require("../controllers/departmentController");

const { departmentValidation } = require("../validations/otherValidations");
const { handleValidationErrors } = require("../validations/validate");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

router.use(protect);

router.get("/", authorize("Admin", "HR", "Employee"), getAllDepartments);
router.get("/:id", authorize("Admin", "HR", "Employee"), getDepartmentById);
router.post("/", authorize("Admin", "HR"), departmentValidation, handleValidationErrors, createDepartment);
router.put("/:id", authorize("Admin", "HR"), updateDepartment);
router.delete("/:id", authorize("Admin"), deleteDepartment);

module.exports = router;

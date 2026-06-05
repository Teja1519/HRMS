const departmentService = require("../services/departmentService");
const { successResponse, errorResponse } = require("../utils/responseHelper");

const getAllDepartments = async (req, res, next) => {
  try {
    const departments = await departmentService.getAllDepartments();
    return successResponse(res, "Departments fetched successfully", departments);
  } catch (error) {
    next(error);
  }
};

const getDepartmentById = async (req, res, next) => {
  try {
    const dept = await departmentService.getDepartmentById(req.params.id);
    return successResponse(res, "Department fetched successfully", dept);
  } catch (error) {
    if (error.message === "Department not found") return errorResponse(res, error.message, 404);
    next(error);
  }
};

const createDepartment = async (req, res, next) => {
  try {
    const dept = await departmentService.createDepartment(req.body);
    return successResponse(res, "Department created successfully", dept, 201);
  } catch (error) {
    if (error.message === "Department name already exists") return errorResponse(res, error.message, 409);
    next(error);
  }
};

const updateDepartment = async (req, res, next) => {
  try {
    const dept = await departmentService.updateDepartment(req.params.id, req.body);
    return successResponse(res, "Department updated successfully", dept);
  } catch (error) {
    if (error.message === "Department not found") return errorResponse(res, error.message, 404);
    next(error);
  }
};

const deleteDepartment = async (req, res, next) => {
  try {
    await departmentService.deleteDepartment(req.params.id);
    return successResponse(res, "Department deleted successfully");
  } catch (error) {
    if (error.message === "Department not found") return errorResponse(res, error.message, 404);
    next(error);
  }
};

module.exports = {
  getAllDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
};

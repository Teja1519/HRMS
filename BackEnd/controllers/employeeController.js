const employeeService = require("../services/employeeService");
const { successResponse, errorResponse } = require("../utils/responseHelper");

const getAllEmployees = async (req, res, next) => {
  try {
    const employees = await employeeService.getAllEmployees();
    return successResponse(res, "Employees fetched successfully", employees);
  } catch (error) {
    next(error);
  }
};

const getEmployeeById = async (req, res, next) => {
  try {
    const employee = await employeeService.getEmployeeById(req.params.id);
    return successResponse(res, "Employee fetched successfully", employee);
  } catch (error) {
    if (error.message === "Employee not found") return errorResponse(res, error.message, 404);
    next(error);
  }
};

const createEmployee = async (req, res, next) => {
  try {
    const employee = await employeeService.createEmployee(req.body);
    return successResponse(res, "Employee created successfully", employee, 201);
  } catch (error) {
    if (
      error.message === "Employee code already exists" ||
      error.message === "Email already in use"
    ) {
      return errorResponse(res, error.message, 409);
    }
    next(error);
  }
};

const updateEmployee = async (req, res, next) => {
  try {
    const employee = await employeeService.updateEmployee(req.params.id, req.body);
    return successResponse(res, "Employee updated successfully", employee);
  } catch (error) {
    if (error.message === "Employee not found") return errorResponse(res, error.message, 404);
    if (error.message === "Email already in use") return errorResponse(res, error.message, 409);
    next(error);
  }
};

const deleteEmployee = async (req, res, next) => {
  try {
    await employeeService.deleteEmployee(req.params.id);
    return successResponse(res, "Employee deleted successfully");
  } catch (error) {
    if (error.message === "Employee not found") return errorResponse(res, error.message, 404);
    next(error);
  }
};

module.exports = {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};

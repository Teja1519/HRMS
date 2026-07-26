const payrollService = require("../services/payrollService");
const { successResponse, errorResponse } = require("../utils/responseHelper");

const getAllPayroll = async (req, res, next) => {
  try {
    const records = await payrollService.getAllPayroll();
    return successResponse(res, "Payroll records fetched", records);
  } catch (error) {
    next(error);
  }
};

const getPayrollByEmployee = async (req, res, next) => {
  try {
    const requestedEmployeeId = Number(req.params.employeeId);

    if (req.user.Role === "Employee") {
      if (!req.user.EmployeeId || requestedEmployeeId !== req.user.EmployeeId) {
        return errorResponse(res, "Access denied", 403);
      }
    }

    const records = await payrollService.getPayrollByEmployee(requestedEmployeeId);
    return successResponse(res, "Payroll fetched", records);
  } catch (error) {
    if (error.message === "Employee not found") return errorResponse(res, error.message, 404);
    next(error);
  }
};

const createPayroll = async (req, res, next) => {
  try {
    const payroll = await payrollService.createPayroll(req.body);
    return successResponse(res, "Payroll created successfully", payroll, 201);
  } catch (error) {
    if (error.message === "Employee not found") return errorResponse(res, error.message, 404);
    if (error.message.includes("already exists")) return errorResponse(res, error.message, 409);
    next(error);
  }
};

const updatePayroll = async (req, res, next) => {
  try {
    const payroll = await payrollService.updatePayroll(req.params.id, req.body);
    return successResponse(res, "Payroll updated successfully", payroll);
  } catch (error) {
    if (error.message === "Payroll record not found") return errorResponse(res, error.message, 404);
    next(error);
  }
};

const deletePayroll = async (req, res, next) => {
  try {
    await payrollService.deletePayroll(req.params.id);
    return successResponse(res, "Payroll deleted successfully");
  } catch (error) {
    if (error.message === "Payroll record not found") return errorResponse(res, error.message, 404);
    next(error);
  }
};

module.exports = {
  getAllPayroll,
  getPayrollByEmployee,
  createPayroll,
  updatePayroll,
  deletePayroll,
};

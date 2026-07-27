const payrollService = require("../services/payrollService");
const { successResponse, errorResponse } = require("../utils/responseHelper");
const { User, Employee } = require("../models");
const { associateEmployeeWithUser } = require("../services/authService");

const resolveEmployeeId = async (userContext) => {
  if (!userContext || !userContext.UserId) return null;

  if (userContext.EmployeeId) {
    const existingEmp = await Employee.findByPk(userContext.EmployeeId);
    if (existingEmp) return existingEmp.EmployeeId;
  }

  let user = await User.findByPk(userContext.UserId, {
    include: [{ model: Employee, as: "Employee" }],
  });

  if (!user) return null;

  if (!user.Employee) {
    await associateEmployeeWithUser(user);
    user = await User.findByPk(userContext.UserId, {
      include: [{ model: Employee, as: "Employee" }],
    });
  }

  if (user && user.Employee) {
    userContext.EmployeeId = user.Employee.EmployeeId;
    return user.Employee.EmployeeId;
  }

  return null;
};

const getAllPayroll = async (req, res, next) => {
  try {
    const month = req.query.month || null;
    const records = await payrollService.getAllPayroll(month);
    return successResponse(res, "Payroll records fetched", records);
  } catch (error) {
    next(error);
  }
};

const getMyPayroll = async (req, res, next) => {
  try {
    const employeeId = await resolveEmployeeId(req.user);
    if (!employeeId) return successResponse(res, "Personal payroll fetched", []);

    const records = await payrollService.getPayrollByEmployee(employeeId);
    return successResponse(res, "Personal payroll fetched", records);
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

const getPayrollById = async (req, res, next) => {
  try {
    const record = await payrollService.getPayrollById(req.params.id);
    return successResponse(res, "Salary slip details fetched", record);
  } catch (error) {
    if (error.message === "Payroll record not found") return errorResponse(res, error.message, 404);
    next(error);
  }
};

const createPayroll = async (req, res, next) => {
  try {
    const payroll = await payrollService.createPayroll(req.body);
    return successResponse(res, "Payroll processed successfully", payroll, 201);
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
  getMyPayroll,
  getPayrollByEmployee,
  getPayrollById,
  createPayroll,
  updatePayroll,
  deletePayroll,
};

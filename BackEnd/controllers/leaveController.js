const leaveService = require("../services/leaveService");
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

const applyLeave = async (req, res, next) => {
  try {
    const employeeId = await resolveEmployeeId(req.user);
    if (!employeeId) {
      return errorResponse(res, "Could not resolve employee profile for authenticated user.", 400);
    }

    const result = await leaveService.applyLeave({
      EmployeeId: employeeId,
      LeaveTypeId: req.body.LeaveTypeId,
      StartDate: req.body.StartDate,
      EndDate: req.body.EndDate,
      Reason: req.body.Reason,
    });

    return successResponse(res, "Leave application submitted successfully", result, 201);
  } catch (error) {
    if (error.message.includes("End date cannot be prior") || error.message.includes("Invalid")) {
      return errorResponse(res, error.message, 400);
    }
    next(error);
  }
};

const cancelLeave = async (req, res, next) => {
  try {
    const employeeId = await resolveEmployeeId(req.user);
    const leaveId = Number(req.params.id);
    const result = await leaveService.cancelLeave(leaveId, employeeId);
    return successResponse(res, "Leave application cancelled", result);
  } catch (error) {
    if (error.message.includes("Unauthorized") || error.message.includes("Only pending")) {
      return errorResponse(res, error.message, 400);
    }
    next(error);
  }
};

const updateLeaveStatus = async (req, res, next) => {
  try {
    const leaveId = Number(req.params.id);
    const { Status, Comments } = req.body;
    const result = await leaveService.updateLeaveStatus(leaveId, Status, Comments);
    return successResponse(res, `Leave request ${Status.toLowerCase()}`, result);
  } catch (error) {
    if (error.message.includes("Status must be")) return errorResponse(res, error.message, 400);
    next(error);
  }
};

const getLeaveTypes = async (req, res, next) => {
  try {
    const types = await leaveService.getLeaveTypes();
    return successResponse(res, "Leave types fetched successfully", types);
  } catch (error) {
    next(error);
  }
};

const getAllLeaves = async (req, res, next) => {
  try {
    const status = req.query.status || null;
    const leaves = await leaveService.getAllLeaves(status);
    return successResponse(res, "All leave requests fetched", leaves);
  } catch (error) {
    next(error);
  }
};

const getMyLeaves = async (req, res, next) => {
  try {
    const employeeId = await resolveEmployeeId(req.user);
    if (!employeeId) return successResponse(res, "Personal leaves fetched", []);

    const leaves = await leaveService.getLeavesByEmployee(employeeId);
    return successResponse(res, "Personal leaves fetched", leaves);
  } catch (error) {
    next(error);
  }
};

const getLeaveStats = async (req, res, next) => {
  try {
    const employeeId = req.user.Role === "Employee" ? await resolveEmployeeId(req.user) : null;
    const stats = await leaveService.getLeaveStatistics(employeeId);
    return successResponse(res, "Leave statistics fetched", stats);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  applyLeave,
  cancelLeave,
  updateLeaveStatus,
  getLeaveTypes,
  getAllLeaves,
  getMyLeaves,
  getLeaveStats,
};

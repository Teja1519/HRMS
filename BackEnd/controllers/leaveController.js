const leaveService = require("../services/leaveService");
const { successResponse, errorResponse } = require("../utils/responseHelper");

// ─── Leave Types ──────────────────────────────────────────────────────────────
const getAllLeaveTypes = async (req, res, next) => {
  try {
    const types = await leaveService.getAllLeaveTypes();
    return successResponse(res, "Leave types fetched", types);
  } catch (error) {
    next(error);
  }
};

const createLeaveType = async (req, res, next) => {
  try {
    const lt = await leaveService.createLeaveType(req.body);
    return successResponse(res, "Leave type created", lt, 201);
  } catch (error) {
    if (error.message === "Leave type already exists") return errorResponse(res, error.message, 409);
    next(error);
  }
};

const updateLeaveType = async (req, res, next) => {
  try {
    const lt = await leaveService.updateLeaveType(req.params.id, req.body);
    return successResponse(res, "Leave type updated", lt);
  } catch (error) {
    if (error.message === "Leave type not found") return errorResponse(res, error.message, 404);
    next(error);
  }
};

const deleteLeaveType = async (req, res, next) => {
  try {
    await leaveService.deleteLeaveType(req.params.id);
    return successResponse(res, "Leave type deleted");
  } catch (error) {
    if (error.message === "Leave type not found") return errorResponse(res, error.message, 404);
    next(error);
  }
};

// ─── Leave Requests ───────────────────────────────────────────────────────────
const applyLeave = async (req, res, next) => {
  try {
    const employeeId = req.user.Role === "Employee"
      ? req.user.EmployeeId
      : req.body.EmployeeId || req.user.EmployeeId;

    if (!employeeId) return errorResponse(res, "Employee ID is required", 400);

    const leave = await leaveService.applyLeave(employeeId, req.body);
    return successResponse(res, "Leave application submitted", leave, 201);
  } catch (error) {
    if (error.message === "Employee not found" || error.message === "Invalid leave type") {
      return errorResponse(res, error.message, 404);
    }
    next(error);
  }
};

const getAllLeaveRequests = async (req, res, next) => {
  try {
    const requests = await leaveService.getAllLeaveRequests();
    return successResponse(res, "Leave requests fetched", requests);
  } catch (error) {
    next(error);
  }
};

const getMyLeaveRequests = async (req, res, next) => {
  try {
    const requestedEmployeeId = Number(req.params.employeeId);

    if (req.user.Role === "Employee") {
      if (!req.user.EmployeeId || requestedEmployeeId !== req.user.EmployeeId) {
        return errorResponse(res, "Access denied", 403);
      }
    }

    const requests = await leaveService.getLeaveRequestsByEmployee(requestedEmployeeId);
    return successResponse(res, "Leave requests fetched", requests);
  } catch (error) {
    next(error);
  }
};

const approveLeave = async (req, res, next) => {
  try {
    const leave = await leaveService.approveLeave(req.params.id);
    return successResponse(res, "Leave approved", leave);
  } catch (error) {
    if (error.message === "Leave request not found") return errorResponse(res, error.message, 404);
    if (error.message === "Leave request already processed") return errorResponse(res, error.message, 409);
    next(error);
  }
};

const rejectLeave = async (req, res, next) => {
  try {
    const leave = await leaveService.rejectLeave(req.params.id);
    return successResponse(res, "Leave rejected", leave);
  } catch (error) {
    if (error.message === "Leave request not found") return errorResponse(res, error.message, 404);
    if (error.message === "Leave request already processed") return errorResponse(res, error.message, 409);
    next(error);
  }
};

module.exports = {
  getAllLeaveTypes,
  createLeaveType,
  updateLeaveType,
  deleteLeaveType,
  applyLeave,
  getAllLeaveRequests,
  getMyLeaveRequests,
  approveLeave,
  rejectLeave,
};

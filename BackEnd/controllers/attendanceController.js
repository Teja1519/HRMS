const attendanceService = require("../services/attendanceService");
const { successResponse, errorResponse } = require("../utils/responseHelper");

const checkIn = async (req, res, next) => {
  try {
    const employeeId = req.user.Role === "Employee"
      ? req.user.EmployeeId
      : req.body.EmployeeId || req.user.EmployeeId;

    if (!employeeId) return errorResponse(res, "Employee ID is required", 400);

    const record = await attendanceService.checkIn(employeeId);
    return successResponse(res, "Check-in recorded successfully", record, 201);
  } catch (error) {
    if (error.message === "Already checked in for today") return errorResponse(res, error.message, 409);
    next(error);
  }
};

const checkOut = async (req, res, next) => {
  try {
    const employeeId = req.user.Role === "Employee"
      ? req.user.EmployeeId
      : req.body.EmployeeId || req.user.EmployeeId;

    if (!employeeId) return errorResponse(res, "Employee ID is required", 400);

    const record = await attendanceService.checkOut(employeeId);
    return successResponse(res, "Check-out recorded successfully", record);
  } catch (error) {
    if (error.message === "No check-in found for today") return errorResponse(res, error.message, 404);
    if (error.message === "Already checked out today") return errorResponse(res, error.message, 409);
    next(error);
  }
};

const getAllAttendance = async (req, res, next) => {
  try {
    const records = await attendanceService.getAllAttendance();
    return successResponse(res, "Attendance records fetched", records);
  } catch (error) {
    next(error);
  }
};

const getAttendanceByEmployee = async (req, res, next) => {
  try {
    const requestedEmployeeId = Number(req.params.employeeId);

    if (req.user.Role === "Employee") {
      if (!req.user.EmployeeId || requestedEmployeeId !== req.user.EmployeeId) {
        return errorResponse(res, "Access denied", 403);
      }
    }

    const records = await attendanceService.getAttendanceByEmployee(requestedEmployeeId);
    return successResponse(res, "Attendance fetched", records);
  } catch (error) {
    if (error.message === "Employee not found") return errorResponse(res, error.message, 404);
    next(error);
  }
};

module.exports = { checkIn, checkOut, getAllAttendance, getAttendanceByEmployee };

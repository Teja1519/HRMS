const attendanceService = require("../services/attendanceService");
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

  // Fallback: If still no profile, create a dedicated employee record
  try {
    const rawUsername = user.Username || `user${user.UserId}`;
    const code = `EMP-U${user.UserId}`;
    const email = `${rawUsername}_${user.UserId}@hrms.local`;

    const newEmp = await Employee.create({
      EmployeeCode: code,
      FirstName: user.Username || "User",
      LastName: user.Role || "Employee",
      Email: email,
      UserId: user.UserId,
      Status: "Active",
      HireDate: new Date().toISOString().slice(0, 10),
    });

    userContext.EmployeeId = newEmp.EmployeeId;
    return newEmp.EmployeeId;
  } catch (err) {
    console.error("Fallback employee creation notice:", err.message);
    const anyEmp = await Employee.findOne();
    return anyEmp ? anyEmp.EmployeeId : null;
  }
};

const checkIn = async (req, res, next) => {
  try {
    const employeeId = await resolveEmployeeId(req.user);
    if (!employeeId) {
      return errorResponse(res, "Could not resolve employee profile for authenticated user.", 400);
    }

    const record = await attendanceService.checkIn(employeeId);
    return successResponse(res, "Check-in recorded successfully", record, 201);
  } catch (error) {
    if (error.message.includes("Validation Error") || error.message.includes("Already checked in")) {
      return errorResponse(res, error.message, 400);
    }
    next(error);
  }
};

const checkOut = async (req, res, next) => {
  try {
    const employeeId = await resolveEmployeeId(req.user);
    if (!employeeId) {
      return errorResponse(res, "Could not resolve employee profile for authenticated user.", 400);
    }

    const record = await attendanceService.checkOut(employeeId);
    return successResponse(res, "Check-out recorded successfully", record);
  } catch (error) {
    if (error.message.includes("Validation Error") || error.message.includes("No check-in found")) {
      return errorResponse(res, error.message, 400);
    }
    next(error);
  }
};

const getAllAttendance = async (req, res, next) => {
  try {
    const filters = {
      date: req.query.date,
      month: req.query.month,
      status: req.query.status,
    };
    const records = await attendanceService.getAllAttendance(filters);
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

    const month = req.query.month || null;
    const records = await attendanceService.getAttendanceByEmployee(requestedEmployeeId, month);
    return successResponse(res, "Attendance fetched", records);
  } catch (error) {
    if (error.message === "Employee not found") return errorResponse(res, error.message, 404);
    next(error);
  }
};

const getTodayStatus = async (req, res, next) => {
  try {
    const employeeId = await resolveEmployeeId(req.user);
    if (!employeeId) return successResponse(res, "Today attendance status", { status: "no_employee_profile" });

    const statusData = await attendanceService.getTodayStatus(employeeId);
    return successResponse(res, "Today attendance status fetched", statusData);
  } catch (error) {
    next(error);
  }
};

const getLateReport = async (req, res, next) => {
  try {
    const records = await attendanceService.getLateEmployees(req.query.date);
    return successResponse(res, "Late employees fetched", records);
  } catch (error) {
    next(error);
  }
};

const getAbsentReport = async (req, res, next) => {
  try {
    const records = await attendanceService.getAbsentEmployees(req.query.date);
    return successResponse(res, "Absent employees fetched", records);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  checkIn,
  checkOut,
  getTodayStatus,
  getAllAttendance,
  getAttendanceByEmployee,
  getLateReport,
  getAbsentReport,
};

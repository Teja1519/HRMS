const reportService = require("../services/reportService");
const { successResponse } = require("../utils/responseHelper");

const getSummaryReport = async (req, res, next) => {
  try {
    const data = await reportService.getSummaryReport();
    return successResponse(res, "Summary report metrics fetched", data);
  } catch (error) {
    next(error);
  }
};

const getAttendanceReport = async (req, res, next) => {
  try {
    const filters = {
      date: req.query.date,
      month: req.query.month,
      status: req.query.status,
    };
    const records = await reportService.getAttendanceReport(filters);
    return successResponse(res, "Attendance report fetched", records);
  } catch (error) {
    next(error);
  }
};

const getLeaveReport = async (req, res, next) => {
  try {
    const filters = { status: req.query.status };
    const records = await reportService.getLeaveReport(filters);
    return successResponse(res, "Leave report fetched", records);
  } catch (error) {
    next(error);
  }
};

const getPayrollReport = async (req, res, next) => {
  try {
    const filters = { month: req.query.month };
    const records = await reportService.getPayrollReport(filters);
    return successResponse(res, "Payroll report fetched", records);
  } catch (error) {
    next(error);
  }
};

const getEmployeeReport = async (req, res, next) => {
  try {
    const filters = {
      departmentId: req.query.departmentId,
      status: req.query.status,
    };
    const records = await reportService.getEmployeeReport(filters);
    return successResponse(res, "Employee report fetched", records);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSummaryReport,
  getAttendanceReport,
  getLeaveReport,
  getPayrollReport,
  getEmployeeReport,
};

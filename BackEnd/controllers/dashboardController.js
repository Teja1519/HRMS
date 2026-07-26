const dashboardService = require("../services/dashboardService");
const { successResponse } = require("../utils/responseHelper");

const getAdminDashboard = async (req, res, next) => {
  try {
    const data = await dashboardService.getAdminDashboard();
    return successResponse(res, "Admin dashboard data fetched", data);
  } catch (error) {
    next(error);
  }
};

const getHRDashboard = async (req, res, next) => {
  try {
    const data = await dashboardService.getHRDashboard();
    return successResponse(res, "HR dashboard data fetched", data);
  } catch (error) {
    next(error);
  }
};

const getEmployeeDashboard = async (req, res, next) => {
  try {
    const requestedEmployeeId = Number(req.params.employeeId);

    if (req.user.Role === "Employee") {
      if (!req.user.EmployeeId || requestedEmployeeId !== req.user.EmployeeId) {
        return res.status(403).json({ success: false, message: "Access denied" });
      }
    }

    if (!requestedEmployeeId) {
      return res.status(400).json({ success: false, message: "Employee ID is required" });
    }

    const data = await dashboardService.getEmployeeDashboard(requestedEmployeeId);
    return successResponse(res, "Employee dashboard data fetched", data);
  } catch (error) {
    next(error);
  }
};

module.exports = { getAdminDashboard, getHRDashboard, getEmployeeDashboard };

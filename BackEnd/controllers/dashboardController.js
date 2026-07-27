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

const { User } = require("../models");
const { associateEmployeeWithUser } = require("../services/authService");

const resolveEmployeeId = async (userContext) => {
  if (userContext.EmployeeId) return userContext.EmployeeId;

  const user = await User.findByPk(userContext.UserId);
  if (user) {
    await associateEmployeeWithUser(user);
    if (user.Employee) {
      userContext.EmployeeId = user.Employee.EmployeeId;
      return user.Employee.EmployeeId;
    }
  }
  return null;
};

const getEmployeeDashboard = async (req, res, next) => {
  try {
    let requestedEmployeeId = req.params.employeeId && !isNaN(req.params.employeeId)
      ? Number(req.params.employeeId)
      : await resolveEmployeeId(req.user);

    if (req.user.Role === "Employee") {
      const myId = await resolveEmployeeId(req.user);
      if (!myId || (requestedEmployeeId && requestedEmployeeId !== myId)) {
        return res.status(403).json({ success: false, message: "Access denied" });
      }
      requestedEmployeeId = myId;
    }

    if (!requestedEmployeeId) {
      return res.status(400).json({ success: false, message: "Could not resolve employee profile for authenticated user." });
    }

    const data = await dashboardService.getEmployeeDashboard(requestedEmployeeId);
    return successResponse(res, "Employee dashboard data fetched", data);
  } catch (error) {
    next(error);
  }
};

module.exports = { getAdminDashboard, getHRDashboard, getEmployeeDashboard };

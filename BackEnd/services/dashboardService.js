const { Employee, Department, LeaveRequest, Attendance, Payroll } = require("../models");
const { Op } = require("sequelize");

const getAdminDashboard = async () => {
  const totalEmployees = await Employee.count();
  const activeEmployees = await Employee.count({ where: { Status: "Active" } });
  const totalDepartments = await Department.count();
  const pendingLeaveRequests = await LeaveRequest.count({ where: { Status: "Pending" } });

  return {
    totalEmployees,
    activeEmployees,
    totalDepartments,
    pendingLeaveRequests,
  };
};

const getHRDashboard = async () => {
  const today = new Date().toISOString().split("T")[0];

  const todayAttendanceCount = await Attendance.count({
    where: { AttendanceDate: today },
  });

  const pendingLeaveRequests = await LeaveRequest.count({
    where: { Status: "Pending" },
  });

  const payrollRecordsCount = await Payroll.count();

  return {
    todayAttendanceCount,
    pendingLeaveRequests,
    payrollRecordsCount,
  };
};

const getEmployeeDashboard = async (employeeId) => {
  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
  const today = new Date().toISOString().split("T")[0];

  // Attendance this month
  const attendanceThisMonth = await Attendance.count({
    where: {
      EmployeeId: employeeId,
      AttendanceDate: {
        [Op.like]: `${currentMonth}%`,
      },
    },
  });

  // Leave status summary
  const pendingLeaves = await LeaveRequest.count({
    where: { EmployeeId: employeeId, Status: "Pending" },
  });
  const approvedLeaves = await LeaveRequest.count({
    where: { EmployeeId: employeeId, Status: "Approved" },
  });

  // Latest payroll
  const latestPayroll = await Payroll.findOne({
    where: { EmployeeId: employeeId },
    order: [["PayrollMonth", "DESC"]],
    attributes: ["PayrollMonth", "BasicSalary", "NetSalary"],
  });

  return {
    attendanceThisMonth,
    leaveStatus: { pending: pendingLeaves, approved: approvedLeaves },
    latestPayroll: latestPayroll || null,
  };
};

module.exports = { getAdminDashboard, getHRDashboard, getEmployeeDashboard };

const { Employee, Department, LeaveRequest, Attendance, Payroll, Notification } = require("../models");
const { Op } = require("sequelize");
const { toAttendanceDTO } = require("../dtos/AttendanceDTO");
const { toLeaveDTO } = require("../dtos/LeaveDTO");
const { toPayrollDTO } = require("../dtos/PayrollDTO");
const { toNotificationDTO } = require("../dtos/NotificationDTO");

const getLocalDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getAdminDashboard = async () => {
  const today = getLocalDate();
  const currentMonth = today.slice(0, 7);

  // 1. Employee stats
  const totalEmployees = await Employee.count();
  const activeEmployees = await Employee.count({ where: { Status: "Active" } });

  // 2. Department list & count
  const departments = await Department.findAll({
    attributes: ["DepartmentId", "DepartmentName"],
    order: [["DepartmentName", "ASC"]],
  });

  // 3. Leave stats
  const totalLeaves = await LeaveRequest.count();
  const pendingLeaves = await LeaveRequest.count({ where: { Status: "Pending" } });
  const approvedLeaves = await LeaveRequest.count({ where: { Status: "Approved" } });
  const rejectedLeaves = await LeaveRequest.count({ where: { Status: "Rejected" } });

  // 4. Today's Attendance stats
  const presentCount = await Attendance.count({ where: { AttendanceDate: today, Status: "Present" } });
  const lateCount = await Attendance.count({ where: { AttendanceDate: today, Status: "Late" } });
  const totalPunched = presentCount + lateCount;
  const absentCount = Math.max(0, activeEmployees - totalPunched);

  // 5. Payroll stats
  const payrolls = await Payroll.findAll({ where: { PayrollMonth: { [Op.like]: `${currentMonth}%` } } });
  const totalDisbursed = payrolls.reduce((sum, p) => sum + Number(p.NetSalary || 0), 0);

  // 6. Recent Notifications
  const notifications = await Notification.findAll({
    limit: 5,
    order: [["CreatedAt", "DESC"]],
  });

  return {
    totalEmployees,
    activeEmployees,
    departmentsCount: departments.length,
    departments: departments.map((d) => d.toJSON()),
    leaves: { total: totalLeaves, pending: pendingLeaves, approved: approvedLeaves, rejected: rejectedLeaves },
    attendance: { present: presentCount, late: lateCount, absent: absentCount, totalPunched },
    payroll: { totalDisbursed: Math.round(totalDisbursed * 100) / 100, count: payrolls.length },
    notifications: notifications.map(toNotificationDTO),
  };
};

const getHRDashboard = async () => {
  const today = getLocalDate();

  // 1. Pending Leave Requests (detailed)
  const pendingLeaveRequests = await LeaveRequest.findAll({
    where: { Status: "Pending" },
    include: [
      { model: Employee, as: "Employee" },
      { model: LeaveRequest.sequelize.models.LeaveType, as: "LeaveType" },
    ],
    order: [["createdAt", "DESC"]],
    limit: 5,
  });

  // 2. Today's Attendance summary
  const presentCount = await Attendance.count({ where: { AttendanceDate: today, Status: "Present" } });
  const lateCount = await Attendance.count({ where: { AttendanceDate: today, Status: "Late" } });
  const activeCount = await Employee.count({ where: { Status: "Active" } });
  const absentCount = Math.max(0, activeCount - (presentCount + lateCount));

  // 3. Payroll Summary
  const allPayrolls = await Payroll.findAll();
  const totalNet = allPayrolls.reduce((sum, p) => sum + Number(p.NetSalary || 0), 0);
  const totalGross = allPayrolls.reduce((sum, p) => sum + (Number(p.BasicSalary || 0) + Number(p.HRA || 0) + Number(p.Allowances || 0) + Number(p.Bonus || 0)), 0);
  const totalDeductions = allPayrolls.reduce((sum, p) => sum + (Number(p.PF || 0) + Number(p.Tax || 0) + Number(p.Deductions || 0)), 0);

  return {
    pendingLeaveRequests: pendingLeaveRequests.map(toLeaveDTO),
    todayAttendance: { present: presentCount, late: lateCount, absent: absentCount },
    payrollSummary: {
      totalNet: Math.round(totalNet * 100) / 100,
      totalGross: Math.round(totalGross * 100) / 100,
      totalDeductions: Math.round(totalDeductions * 100) / 100,
      count: allPayrolls.length,
    },
  };
};

const getEmployeeDashboard = async (employeeId, userId) => {
  const today = getLocalDate();

  // 1. Today's Attendance status
  const todayRecord = await Attendance.findOne({
    where: { EmployeeId: employeeId, AttendanceDate: today },
  });

  // 2. Upcoming / Active Leaves
  const upcomingLeaves = await LeaveRequest.findAll({
    where: {
      EmployeeId: employeeId,
      EndDate: { [Op.gte]: today },
    },
    include: [{ model: LeaveRequest.sequelize.models.LeaveType, as: "LeaveType" }],
    order: [["StartDate", "ASC"]],
    limit: 5,
  });

  // 3. Notifications feed
  const notifications = await Notification.findAll({
    limit: 5,
    order: [["CreatedAt", "DESC"]],
  });

  // 4. Recent Payslips (Last 3)
  const recentPayslips = await Payroll.findAll({
    where: { EmployeeId: employeeId },
    order: [["PayrollMonth", "DESC"]],
    limit: 3,
  });

  return {
    todayAttendance: todayRecord ? toAttendanceDTO(todayRecord) : null,
    upcomingLeaves: upcomingLeaves.map(toLeaveDTO),
    notifications: notifications.map(toNotificationDTO),
    recentPayslips: recentPayslips.map(toPayrollDTO),
  };
};

module.exports = { getAdminDashboard, getHRDashboard, getEmployeeDashboard };

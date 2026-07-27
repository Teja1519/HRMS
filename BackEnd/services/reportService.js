const { Employee, Department, Attendance, Payroll, LeaveRequest, LeaveType } = require("../models");
const { Op } = require("sequelize");
const { toAttendanceDTO } = require("../dtos/AttendanceDTO");
const { toLeaveDTO } = require("../dtos/LeaveDTO");
const { toPayrollDTO } = require("../dtos/PayrollDTO");
const { toEmployeeDTO } = require("../dtos/EmployeeDTO");

const getAttendanceReport = async (filters = {}) => {
  const where = {};
  if (filters.date) where.AttendanceDate = filters.date;
  if (filters.month) where.AttendanceDate = { [Op.like]: `${filters.month}%` };
  if (filters.status && filters.status !== "all") where.Status = filters.status;

  const records = await Attendance.findAll({
    where,
    include: [{ model: Employee, as: "Employee", include: [{ model: Department, as: "Department" }] }],
    order: [["AttendanceDate", "DESC"]],
  });

  return records.map(toAttendanceDTO);
};

const getLeaveReport = async (filters = {}) => {
  const where = {};
  if (filters.status && filters.status !== "all") where.Status = filters.status;

  const records = await LeaveRequest.findAll({
    where,
    include: [
      { model: Employee, as: "Employee", include: [{ model: Department, as: "Department" }] },
      { model: LeaveType, as: "LeaveType" },
    ],
    order: [["createdAt", "DESC"]],
  });

  return records.map(toLeaveDTO);
};

const getPayrollReport = async (filters = {}) => {
  const where = {};
  if (filters.month && filters.month !== "all") where.PayrollMonth = filters.month;

  const records = await Payroll.findAll({
    where,
    include: [{ model: Employee, as: "Employee", include: [{ model: Department, as: "Department" }] }],
    order: [["PayrollMonth", "DESC"]],
  });

  return records.map(toPayrollDTO);
};

const getEmployeeReport = async (filters = {}) => {
  const where = {};
  if (filters.departmentId && filters.departmentId !== "all") where.DepartmentId = Number(filters.departmentId);
  if (filters.status && filters.status !== "all") where.Status = filters.status;

  const records = await Employee.findAll({
    where,
    include: [{ model: Department, as: "Department" }],
    order: [["EmployeeCode", "ASC"]],
  });

  return records.map(toEmployeeDTO);
};

const getSummaryReport = async () => {
  const [employeesCount, activeCount, departmentsCount, attendanceRecords, payrollRecords, leaveRequests] = await Promise.all([
    Employee.count(),
    Employee.count({ where: { Status: "Active" } }),
    Department.count(),
    Attendance.findAll({ attributes: ["AttendanceDate", "Status"] }),
    Payroll.findAll({ attributes: ["PayrollMonth", "BasicSalary", "HRA", "Allowances", "Bonus", "PF", "Tax", "Deductions", "NetSalary"] }),
    LeaveRequest.findAll({ attributes: ["Status", "AppliedDate"] }),
  ]);

  const totalPayrollDisbursed = payrollRecords.reduce((sum, p) => sum + Number(p.NetSalary || 0), 0);
  const totalGrossDisbursed = payrollRecords.reduce((sum, p) => sum + (Number(p.BasicSalary || 0) + Number(p.HRA || 0) + Number(p.Allowances || 0) + Number(p.Bonus || 0)), 0);
  const totalDeductions = payrollRecords.reduce((sum, p) => sum + (Number(p.PF || 0) + Number(p.Tax || 0) + Number(p.Deductions || 0)), 0);

  const approvedLeavesCount = leaveRequests.filter((l) => l.Status === "Approved").length;
  const pendingLeavesCount = leaveRequests.filter((l) => l.Status === "Pending").length;
  const rejectedLeavesCount = leaveRequests.filter((l) => l.Status === "Rejected").length;

  const presentCount = attendanceRecords.filter((a) => a.Status === "Present").length;
  const lateCount = attendanceRecords.filter((a) => a.Status === "Late").length;

  return {
    employees: { total: employeesCount, active: activeCount },
    departmentsCount,
    payroll: {
      totalDisbursed: Math.round(totalPayrollDisbursed * 100) / 100,
      totalGross: Math.round(totalGrossDisbursed * 100) / 100,
      totalDeductions: Math.round(totalDeductions * 100) / 100,
      count: payrollRecords.length,
    },
    leaves: { approved: approvedLeavesCount, pending: pendingLeavesCount, rejected: rejectedLeavesCount, total: leaveRequests.length },
    attendance: { present: presentCount, late: lateCount, totalPunched: attendanceRecords.length },
  };
};

module.exports = {
  getAttendanceReport,
  getLeaveReport,
  getPayrollReport,
  getEmployeeReport,
  getSummaryReport,
};

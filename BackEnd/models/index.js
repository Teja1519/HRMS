// models/index.js - Central file that loads all models and sets up associations

const User = require("./User");
const Department = require("./Department");
const Employee = require("./Employee");
const Attendance = require("./Attendance");
const LeaveType = require("./LeaveType");
const LeaveRequest = require("./LeaveRequest");
const Payroll = require("./Payroll");
const Report = require("./Report");
const Notification = require("./Notification");
const Setting = require("./Setting");

// ─── Associations ─────────────────────────────────────────────────────────────

// Department <-> Employee
Department.hasMany(Employee, { foreignKey: "DepartmentId", as: "Employees" });
Employee.belongsTo(Department, { foreignKey: "DepartmentId", as: "Department" });

// User <-> Employee
User.hasOne(Employee, { foreignKey: "UserId", as: "Employee" });
Employee.belongsTo(User, { foreignKey: "UserId", as: "User" });

// Employee <-> Attendance
Employee.hasMany(Attendance, { foreignKey: "EmployeeId", as: "Attendances" });
Attendance.belongsTo(Employee, { foreignKey: "EmployeeId", as: "Employee" });

// Employee <-> LeaveRequest
Employee.hasMany(LeaveRequest, { foreignKey: "EmployeeId", as: "LeaveRequests" });
LeaveRequest.belongsTo(Employee, { foreignKey: "EmployeeId", as: "Employee" });

// LeaveType <-> LeaveRequest
LeaveType.hasMany(LeaveRequest, { foreignKey: "LeaveTypeId", as: "LeaveRequests" });
LeaveRequest.belongsTo(LeaveType, { foreignKey: "LeaveTypeId", as: "LeaveType" });

// Employee <-> Payroll
Employee.hasMany(Payroll, { foreignKey: "EmployeeId", as: "Payrolls" });
Payroll.belongsTo(Employee, { foreignKey: "EmployeeId", as: "Employee" });

// User <-> Notification
User.hasMany(Notification, { foreignKey: "UserId", as: "Notifications" });
Notification.belongsTo(User, { foreignKey: "UserId", as: "User" });

// Department <-> Notification
Department.hasMany(Notification, { foreignKey: "DepartmentId", as: "Notifications" });
Notification.belongsTo(Department, { foreignKey: "DepartmentId", as: "Department" });

// User (Creator) <-> Notification
User.hasMany(Notification, { foreignKey: "CreatedBy", as: "CreatedAnnouncements" });
Notification.belongsTo(User, { foreignKey: "CreatedBy", as: "Creator" });

// ─── Export all models ────────────────────────────────────────────────────────
module.exports = {
  User,
  Department,
  Employee,
  Attendance,
  LeaveType,
  LeaveRequest,
  Payroll,
  Report,
  Notification,
  Setting,
};

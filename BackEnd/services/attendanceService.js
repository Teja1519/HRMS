const { Attendance, Employee } = require("../models");
const { Op } = require("sequelize");

// Office start time for "Late" determination (9:00 AM)
const OFFICE_START_TIME = "09:00:00";

const checkIn = async (employeeId) => {
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  const now = new Date().toTimeString().split(" ")[0];   // HH:MM:SS

  // Prevent duplicate check-in
  const existing = await Attendance.findOne({
    where: { EmployeeId: employeeId, AttendanceDate: today },
  });
  if (existing) throw new Error("Already checked in for today");

  // Determine status
  const status = now > OFFICE_START_TIME ? "Late" : "Present";

  return await Attendance.create({
    EmployeeId: employeeId,
    AttendanceDate: today,
    CheckIn: now,
    Status: status,
  });
};

const checkOut = async (employeeId) => {
  const today = new Date().toISOString().split("T")[0];
  const now = new Date().toTimeString().split(" ")[0];

  const record = await Attendance.findOne({
    where: { EmployeeId: employeeId, AttendanceDate: today },
  });
  if (!record) throw new Error("No check-in found for today");
  if (record.CheckOut) throw new Error("Already checked out today");

  await record.update({ CheckOut: now });
  return record;
};

const getAllAttendance = async () => {
  return await Attendance.findAll({
    include: [{ model: Employee, as: "Employee", attributes: ["EmployeeId", "FirstName", "LastName", "EmployeeCode"] }],
    order: [["AttendanceDate", "DESC"]],
  });
};

const getAttendanceByEmployee = async (employeeId) => {
  const employee = await Employee.findByPk(employeeId);
  if (!employee) throw new Error("Employee not found");

  return await Attendance.findAll({
    where: { EmployeeId: employeeId },
    order: [["AttendanceDate", "DESC"]],
  });
};

module.exports = { checkIn, checkOut, getAllAttendance, getAttendanceByEmployee };

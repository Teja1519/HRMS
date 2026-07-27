const { Attendance, Employee, Department, Setting } = require("../models");
const { Op } = require("sequelize");
const { toAttendanceDTO } = require("../dtos/AttendanceDTO");

const getLocalDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getLocalTime = () => {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
};

const getOfficeStartTime = async () => {
  try {
    const setting = await Setting.findOne({ where: { SettingName: "office_start_time" } });
    if (setting && setting.SettingValue) {
      return setting.SettingValue.length === 5 ? `${setting.SettingValue}:00` : setting.SettingValue;
    }
  } catch (error) {
    console.error("Error fetching office start time:", error.message);
  }
  return "09:00:00";
};

const calculateWorkingHours = (checkInTime, checkOutTime) => {
  if (!checkInTime || !checkOutTime) return "0.0";
  const [inH, inM, inS] = checkInTime.split(":").map(Number);
  const [outH, outM, outS] = checkOutTime.split(":").map(Number);
  const inMinutes = inH * 60 + inM + (inS || 0) / 60;
  const outMinutes = outH * 60 + outM + (outS || 0) / 60;
  const diffMinutes = Math.max(0, outMinutes - inMinutes);
  return (diffMinutes / 60).toFixed(1);
};

const checkIn = async (employeeId) => {
  const today = getLocalDate();
  const now = getLocalTime();
  const officeStartTime = await getOfficeStartTime();

  const emp = await Employee.findByPk(employeeId);
  if (!emp) throw new Error("Employee record not found in database");

  // Rule 1: No multiple check-ins on the same day
  const existing = await Attendance.findOne({
    where: { EmployeeId: employeeId, AttendanceDate: today },
  });
  if (existing) {
    throw new Error("Validation Error: Multiple check-ins are not allowed on the same day");
  }

  // Determine status (Late vs Present)
  const status = now > officeStartTime ? "Late" : "Present";

  const record = await Attendance.create({
    EmployeeId: employeeId,
    AttendanceDate: today,
    CheckIn: now,
    Status: status,
  });

  const fullRecord = await Attendance.findByPk(record.AttendanceId, {
    include: [{ model: Employee, as: "Employee", include: [{ model: Department, as: "Department" }] }],
  });

  return toAttendanceDTO(fullRecord);
};

const checkOut = async (employeeId) => {
  const today = getLocalDate();
  const now = getLocalTime();

  // Rule 2: No checkout before check-in
  const record = await Attendance.findOne({
    where: { EmployeeId: employeeId, AttendanceDate: today },
  });
  if (!record || !record.CheckIn) {
    throw new Error("Validation Error: Cannot check out without a valid check-in today");
  }
  if (record.CheckOut) {
    throw new Error("Validation Error: Already checked out for today");
  }

  await record.update({ CheckOut: now });

  const fullRecord = await Attendance.findByPk(record.AttendanceId, {
    include: [{ model: Employee, as: "Employee", include: [{ model: Department, as: "Department" }] }],
  });

  return toAttendanceDTO(fullRecord);
};

const getTodayStatus = async (employeeId) => {
  const today = getLocalDate();
  const record = await Attendance.findOne({
    where: { EmployeeId: employeeId, AttendanceDate: today },
  });

  if (!record) {
    return {
      status: "not_checked_in",
      checkIn: null,
      checkOut: null,
      workingHours: "0.0",
      isLate: false,
    };
  }

  const officeStartTime = await getOfficeStartTime();
  const workingHours = record.CheckOut
    ? calculateWorkingHours(record.CheckIn, record.CheckOut)
    : calculateWorkingHours(record.CheckIn, getLocalTime());

  return {
    status: record.CheckOut ? "checked_out" : "checked_in",
    checkIn: record.CheckIn,
    checkOut: record.CheckOut,
    attendanceStatus: record.Status,
    workingHours,
    isLate: record.CheckIn > officeStartTime,
  };
};

const getAllAttendance = async (filters = {}) => {
  const where = {};
  if (filters.date) {
    where.AttendanceDate = filters.date;
  } else if (filters.month) {
    where.AttendanceDate = { [Op.like]: `${filters.month}%` };
  }

  if (filters.status) {
    where.Status = filters.status;
  }

  const records = await Attendance.findAll({
    where,
    include: [{ model: Employee, as: "Employee", include: [{ model: Department, as: "Department" }] }],
    order: [["AttendanceDate", "DESC"]],
  });

  return records.map(toAttendanceDTO);
};

const getAttendanceByEmployee = async (employeeId, month = null) => {
  const where = { EmployeeId: employeeId };
  if (month) {
    where.AttendanceDate = { [Op.like]: `${month}%` };
  }

  const records = await Attendance.findAll({
    where,
    include: [{ model: Employee, as: "Employee", include: [{ model: Department, as: "Department" }] }],
    order: [["AttendanceDate", "DESC"]],
  });

  return records.map(toAttendanceDTO);
};

const getLateEmployees = async (date = null) => {
  const targetDate = date || getLocalDate();
  const records = await Attendance.findAll({
    where: { AttendanceDate: targetDate, Status: "Late" },
    include: [{ model: Employee, as: "Employee", include: [{ model: Department, as: "Department" }] }],
  });
  return records.map(toAttendanceDTO);
};

const getAbsentEmployees = async (date = null) => {
  const targetDate = date || getLocalDate();
  
  // Find employees who checked in on targetDate
  const presentRecords = await Attendance.findAll({
    where: { AttendanceDate: targetDate },
    attributes: ["EmployeeId"],
  });
  const presentIds = presentRecords.map((r) => r.EmployeeId);

  // Find all active employees not in presentIds
  const absentEmps = await Employee.findAll({
    where: {
      Status: "Active",
      EmployeeId: { [Op.notIn]: presentIds.length > 0 ? presentIds : [0] },
    },
    include: [{ model: Department, as: "Department" }],
  });

  return absentEmps.map((emp) => ({
    EmployeeId: emp.EmployeeId,
    EmployeeCode: emp.EmployeeCode,
    EmployeeName: `${emp.FirstName || ""} ${emp.LastName || ""}`.trim(),
    DepartmentName: emp.Department ? emp.Department.DepartmentName : "Unassigned",
    AttendanceDate: targetDate,
    Status: "Absent",
  }));
};

module.exports = {
  checkIn,
  checkOut,
  getTodayStatus,
  getAllAttendance,
  getAttendanceByEmployee,
  getLateEmployees,
  getAbsentEmployees,
};

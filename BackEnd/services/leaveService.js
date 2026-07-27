const { LeaveRequest, LeaveType, Employee, Department } = require("../models");
const { toLeaveDTO } = require("../dtos/LeaveDTO");

const applyLeave = async ({ EmployeeId, LeaveTypeId, StartDate, EndDate, Reason }) => {
  if (!EmployeeId) {
    throw new Error("Employee profile not found for authenticated user");
  }

  const start = new Date(StartDate);
  const end = new Date(EndDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw new Error("Invalid start or end date format");
  }

  if (end < start) {
    throw new Error("End date cannot be prior to start date");
  }

  const leaveType = await LeaveType.findByPk(LeaveTypeId);
  if (!leaveType) {
    throw new Error("Invalid leave type selected");
  }

  const emp = await Employee.findByPk(EmployeeId);
  if (!emp) {
    throw new Error("Employee record not found in database");
  }

  const leave = await LeaveRequest.create({
    EmployeeId,
    LeaveTypeId,
    StartDate,
    EndDate,
    Reason,
    Status: "Pending",
    AppliedDate: new Date().toISOString().slice(0, 10),
  });

  const fullLeave = await LeaveRequest.findByPk(leave.LeaveId, {
    include: [
      { model: Employee, as: "Employee", include: [{ model: Department, as: "Department" }] },
      { model: LeaveType, as: "LeaveType" },
    ],
  });

  return toLeaveDTO(fullLeave);
};

const cancelLeave = async (leaveId, employeeId) => {
  const leave = await LeaveRequest.findByPk(leaveId);
  if (!leave) {
    throw new Error("Leave request not found");
  }

  if (employeeId && leave.EmployeeId !== employeeId) {
    throw new Error("Unauthorized to cancel this leave application");
  }

  if (leave.Status !== "Pending") {
    throw new Error("Only pending leave applications can be cancelled");
  }

  await leave.update({ Status: "Cancelled" });

  const fullLeave = await LeaveRequest.findByPk(leave.LeaveId, {
    include: [
      { model: Employee, as: "Employee" },
      { model: LeaveType, as: "LeaveType" },
    ],
  });

  return toLeaveDTO(fullLeave);
};

const updateLeaveStatus = async (leaveId, status, comments = null) => {
  const validStatuses = ["Approved", "Rejected"];
  if (!validStatuses.includes(status)) {
    throw new Error("Status must be either Approved or Rejected");
  }

  const leave = await LeaveRequest.findByPk(leaveId);
  if (!leave) {
    throw new Error("Leave request not found");
  }

  await leave.update({
    Status: status,
    Comments: comments || null,
  });

  const fullLeave = await LeaveRequest.findByPk(leave.LeaveId, {
    include: [
      { model: Employee, as: "Employee", include: [{ model: Department, as: "Department" }] },
      { model: LeaveType, as: "LeaveType" },
    ],
  });

  return toLeaveDTO(fullLeave);
};

const getLeaveTypes = async () => {
  return await LeaveType.findAll({ order: [["LeaveTypeId", "ASC"]] });
};

const getAllLeaves = async (status = null) => {
  const where = {};
  if (status && status !== "all") {
    where.Status = status;
  }

  const leaves = await LeaveRequest.findAll({
    where,
    include: [
      { model: Employee, as: "Employee", include: [{ model: Department, as: "Department" }] },
      { model: LeaveType, as: "LeaveType" },
    ],
    order: [["createdAt", "DESC"]],
  });

  return leaves.map(toLeaveDTO);
};

const getLeavesByEmployee = async (employeeId) => {
  const leaves = await LeaveRequest.findAll({
    where: { EmployeeId: employeeId },
    include: [
      { model: Employee, as: "Employee" },
      { model: LeaveType, as: "LeaveType" },
    ],
    order: [["createdAt", "DESC"]],
  });

  return leaves.map(toLeaveDTO);
};

const getLeaveStatistics = async (employeeId = null) => {
  const where = employeeId ? { EmployeeId: employeeId } : {};
  const leaves = await LeaveRequest.findAll({ where });

  return {
    total: leaves.length,
    pending: leaves.filter((l) => l.Status === "Pending").length,
    approved: leaves.filter((l) => l.Status === "Approved").length,
    rejected: leaves.filter((l) => l.Status === "Rejected").length,
    cancelled: leaves.filter((l) => l.Status === "Cancelled").length,
  };
};

module.exports = {
  applyLeave,
  cancelLeave,
  updateLeaveStatus,
  getLeaveTypes,
  getAllLeaves,
  getLeavesByEmployee,
  getLeaveStatistics,
};

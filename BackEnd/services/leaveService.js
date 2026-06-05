const { LeaveRequest, LeaveType, Employee } = require("../models");

// ─── Leave Types ──────────────────────────────────────────────────────────────
const getAllLeaveTypes = async () => await LeaveType.findAll();

const createLeaveType = async (data) => {
  const existing = await LeaveType.findOne({ where: { LeaveTypeName: data.LeaveTypeName } });
  if (existing) throw new Error("Leave type already exists");
  return await LeaveType.create(data);
};

const updateLeaveType = async (id, data) => {
  const lt = await LeaveType.findByPk(id);
  if (!lt) throw new Error("Leave type not found");
  await lt.update(data);
  return lt;
};

const deleteLeaveType = async (id) => {
  const lt = await LeaveType.findByPk(id);
  if (!lt) throw new Error("Leave type not found");
  await lt.destroy();
};

// ─── Leave Requests ───────────────────────────────────────────────────────────
const applyLeave = async (employeeId, data) => {
  const employee = await Employee.findByPk(employeeId);
  if (!employee) throw new Error("Employee not found");

  const leaveType = await LeaveType.findByPk(data.LeaveTypeId);
  if (!leaveType) throw new Error("Invalid leave type");

  const today = new Date().toISOString().split("T")[0];

  return await LeaveRequest.create({
    EmployeeId: employeeId,
    LeaveTypeId: data.LeaveTypeId,
    StartDate: data.StartDate,
    EndDate: data.EndDate,
    Reason: data.Reason || null,
    Status: "Pending",
    AppliedDate: today,
  });
};

const getAllLeaveRequests = async () => {
  return await LeaveRequest.findAll({
    include: [
      { model: Employee, as: "Employee", attributes: ["EmployeeId", "FirstName", "LastName"] },
      { model: LeaveType, as: "LeaveType", attributes: ["LeaveTypeId", "LeaveTypeName"] },
    ],
    order: [["AppliedDate", "DESC"]],
  });
};

const getLeaveRequestsByEmployee = async (employeeId) => {
  return await LeaveRequest.findAll({
    where: { EmployeeId: employeeId },
    include: [{ model: LeaveType, as: "LeaveType" }],
    order: [["AppliedDate", "DESC"]],
  });
};

const approveLeave = async (leaveId) => {
  const leave = await LeaveRequest.findByPk(leaveId);
  if (!leave) throw new Error("Leave request not found");
  if (leave.Status !== "Pending") throw new Error("Leave request already processed");
  await leave.update({ Status: "Approved" });
  return leave;
};

const rejectLeave = async (leaveId) => {
  const leave = await LeaveRequest.findByPk(leaveId);
  if (!leave) throw new Error("Leave request not found");
  if (leave.Status !== "Pending") throw new Error("Leave request already processed");
  await leave.update({ Status: "Rejected" });
  return leave;
};

module.exports = {
  getAllLeaveTypes,
  createLeaveType,
  updateLeaveType,
  deleteLeaveType,
  applyLeave,
  getAllLeaveRequests,
  getLeaveRequestsByEmployee,
  approveLeave,
  rejectLeave,
};

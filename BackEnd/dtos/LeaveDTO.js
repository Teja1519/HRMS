const toLeaveDTO = (leave) => {
  if (!leave) return null;
  const raw = leave.toJSON ? leave.toJSON() : leave;

  let days = 1;
  if (raw.StartDate && raw.EndDate) {
    const start = new Date(raw.StartDate);
    const end = new Date(raw.EndDate);
    const diffTime = Math.abs(end - start);
    days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  }

  return {
    LeaveId: raw.LeaveId,
    EmployeeId: raw.EmployeeId,
    EmployeeName: raw.Employee ? `${raw.Employee.FirstName || ""} ${raw.Employee.LastName || ""}`.trim() : "Unknown",
    EmployeeCode: raw.Employee ? raw.Employee.EmployeeCode : "",
    LeaveTypeId: raw.LeaveTypeId,
    LeaveTypeName: raw.LeaveType ? raw.LeaveType.LeaveTypeName : "Leave",
    StartDate: raw.StartDate,
    EndDate: raw.EndDate,
    Days: days,
    Reason: raw.Reason || "",
    Status: raw.Status || "Pending",
    AppliedDate: raw.AppliedDate || raw.createdAt,
  };
};

module.exports = { toLeaveDTO };

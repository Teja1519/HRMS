const toAttendanceDTO = (record) => {
  if (!record) return null;
  const raw = record.toJSON ? record.toJSON() : record;
  
  let workingHours = "0.0";
  if (raw.CheckIn && raw.CheckOut) {
    const [inH, inM, inS] = raw.CheckIn.split(":").map(Number);
    const [outH, outM, outS] = raw.CheckOut.split(":").map(Number);
    const inMin = inH * 60 + inM + (inS || 0) / 60;
    const outMin = outH * 60 + outM + (outS || 0) / 60;
    workingHours = (Math.max(0, outMin - inMin) / 60).toFixed(1);
  }

  return {
    AttendanceId: raw.AttendanceId,
    EmployeeId: raw.EmployeeId,
    EmployeeName: raw.Employee ? `${raw.Employee.FirstName || ""} ${raw.Employee.LastName || ""}`.trim() : "Unknown",
    EmployeeCode: raw.Employee ? raw.Employee.EmployeeCode : "",
    DepartmentName: raw.Employee && raw.Employee.Department ? raw.Employee.Department.DepartmentName : "Unassigned",
    AttendanceDate: raw.AttendanceDate,
    CheckIn: raw.CheckIn || "-",
    CheckOut: raw.CheckOut || "-",
    Status: raw.Status || "Present",
    WorkingHours: workingHours,
  };
};

module.exports = { toAttendanceDTO };

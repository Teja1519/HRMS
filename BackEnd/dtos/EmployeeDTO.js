const toEmployeeDTO = (emp) => {
  if (!emp) return null;
  const raw = emp.toJSON ? emp.toJSON() : emp;
  return {
    EmployeeId: raw.EmployeeId,
    EmployeeCode: raw.EmployeeCode,
    FirstName: raw.FirstName,
    LastName: raw.LastName,
    FullName: `${raw.FirstName || ""} ${raw.LastName || ""}`.trim(),
    Email: raw.Email,
    Phone: raw.Phone || "",
    Gender: raw.Gender || "",
    DateOfBirth: raw.DateOfBirth || null,
    Address: raw.Address || "",
    Designation: raw.Designation || "",
    HireDate: raw.HireDate || null,
    Salary: raw.Salary ? Number(raw.Salary) : 0,
    DepartmentId: raw.DepartmentId || null,
    DepartmentName: raw.Department ? raw.Department.DepartmentName : (raw.DepartmentName || "Unassigned"),
    Status: raw.Status || "Active",
    UserId: raw.UserId || null,
  };
};

module.exports = { toEmployeeDTO };

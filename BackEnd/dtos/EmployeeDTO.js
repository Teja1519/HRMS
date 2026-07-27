const toEmployeeDTO = (emp) => {
  if (!emp) return null;
  const raw = emp.toJSON ? emp.toJSON() : emp;

  const rawAccount = raw.BankAccountNumber ? String(raw.BankAccountNumber) : "";
  const maskedAccount = rawAccount ? `•••• •••• ${rawAccount.slice(-4)}` : "";

  return {
    EmployeeId: raw.EmployeeId,
    EmployeeCode: raw.EmployeeCode,
    FirstName: raw.FirstName || "",
    LastName: raw.LastName || "",
    FullName: `${raw.FirstName || ""} ${raw.LastName || ""}`.trim(),
    Email: raw.Email || "",
    Phone: raw.Phone || "",
    AlternatePhone: raw.AlternatePhone || "",
    Gender: raw.Gender || "",
    DateOfBirth: raw.DateOfBirth || null,
    BloodGroup: raw.BloodGroup || "",
    MaritalStatus: raw.MaritalStatus || "",
    Nationality: raw.Nationality || "",
    Address: raw.Address || "",
    City: raw.City || "",
    State: raw.State || "",
    Country: raw.Country || "",
    PinCode: raw.PinCode || "",
    Designation: raw.Designation || "",
    ReportingManager: raw.ReportingManager || "",
    EmploymentType: raw.EmploymentType || "Full-Time",
    HireDate: raw.HireDate || null,
    Salary: raw.Salary ? Number(raw.Salary) : 0,
    DepartmentId: raw.DepartmentId || null,
    DepartmentName: raw.Department ? raw.Department.DepartmentName : (raw.DepartmentName || "Unassigned"),
    Status: raw.Status || "Active",
    EmergencyContactName: raw.EmergencyContactName || "",
    EmergencyContactRelation: raw.EmergencyContactRelation || "",
    EmergencyContactPhone: raw.EmergencyContactPhone || "",
    BankName: raw.BankName || "",
    BankAccountHolder: raw.BankAccountHolder || "",
    BankAccountNumber: raw.BankAccountNumber || "",
    MaskedBankAccountNumber: maskedAccount,
    BankIFSC: raw.BankIFSC || "",
    BankBranch: raw.BankBranch || "",
    ProfilePicture: raw.ProfilePicture || null,
    UserId: raw.UserId || null,
  };
};

module.exports = { toEmployeeDTO };

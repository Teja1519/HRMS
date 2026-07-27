const toPayrollDTO = (payroll) => {
  if (!payroll) return null;
  const raw = payroll.toJSON ? payroll.toJSON() : payroll;

  const basic = Number(raw.BasicSalary) || 0;
  const allowances = Number(raw.Allowances) || 0;
  const bonus = Number(raw.Bonus) || 0;
  const deductions = Number(raw.Deductions) || 0;
  const net = Math.round((basic + allowances + bonus - deductions) * 100) / 100;

  return {
    PayrollId: raw.PayrollId,
    EmployeeId: raw.EmployeeId,
    EmployeeName: raw.Employee ? `${raw.Employee.FirstName || ""} ${raw.Employee.LastName || ""}`.trim() : "Unknown",
    EmployeeCode: raw.Employee ? raw.Employee.EmployeeCode : "",
    DepartmentName: raw.Employee && raw.Employee.Department ? raw.Employee.Department.DepartmentName : "Unassigned",
    PayrollMonth: raw.PayrollMonth,
    BasicSalary: basic,
    Allowances: allowances,
    Bonus: bonus,
    Deductions: deductions,
    NetSalary: net,
    Status: "Processed",
  };
};

module.exports = { toPayrollDTO };

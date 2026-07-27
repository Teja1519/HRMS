const toPayrollDTO = (payroll) => {
  if (!payroll) return null;
  const raw = payroll.toJSON ? payroll.toJSON() : payroll;

  const basic = Math.round((Number(raw.BasicSalary) || 0) * 100) / 100;
  const hra = Math.round((Number(raw.HRA) || 0) * 100) / 100;
  const allowances = Math.round((Number(raw.Allowances) || 0) * 100) / 100;
  const bonus = Math.round((Number(raw.Bonus) || 0) * 100) / 100;

  const pf = Math.round((Number(raw.PF) || 0) * 100) / 100;
  const tax = Math.round((Number(raw.Tax) || 0) * 100) / 100;
  const otherDeductions = Math.round((Number(raw.Deductions) || 0) * 100) / 100;

  const grossSalary = Math.round((basic + hra + allowances + bonus) * 100) / 100;
  const totalDeductions = Math.round((pf + tax + otherDeductions) * 100) / 100;
  const netSalary = Math.round((grossSalary - totalDeductions) * 100) / 100;

  return {
    PayrollId: raw.PayrollId,
    EmployeeId: raw.EmployeeId,
    EmployeeName: raw.Employee ? `${raw.Employee.FirstName || ""} ${raw.Employee.LastName || ""}`.trim() : "Unknown",
    EmployeeCode: raw.Employee ? raw.Employee.EmployeeCode : "",
    Designation: raw.Employee ? raw.Employee.Designation || "Employee" : "Employee",
    DepartmentName: raw.Employee && raw.Employee.Department ? raw.Employee.Department.DepartmentName : "Unassigned",
    PayrollMonth: raw.PayrollMonth,
    BasicSalary: basic,
    HRA: hra,
    Allowances: allowances,
    Bonus: bonus,
    GrossSalary: grossSalary,
    PF: pf,
    Tax: tax,
    Deductions: otherDeductions,
    TotalDeductions: totalDeductions,
    NetSalary: netSalary,
    Status: "Processed",
  };
};

module.exports = { toPayrollDTO };

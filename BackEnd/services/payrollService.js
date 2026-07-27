const { Payroll, Employee, Department } = require("../models");
const { toPayrollDTO } = require("../dtos/PayrollDTO");

const getAllPayroll = async (month = null) => {
  const where = {};
  if (month) {
    where.PayrollMonth = month;
  }

  const records = await Payroll.findAll({
    where,
    include: [{ model: Employee, as: "Employee", include: [{ model: Department, as: "Department" }] }],
    order: [["PayrollMonth", "DESC"], ["createdAt", "DESC"]],
  });

  return records.map(toPayrollDTO);
};

const getPayrollByEmployee = async (employeeId) => {
  const employee = await Employee.findByPk(employeeId);
  if (!employee) throw new Error("Employee not found");

  const records = await Payroll.findAll({
    where: { EmployeeId: employeeId },
    include: [{ model: Employee, as: "Employee", include: [{ model: Department, as: "Department" }] }],
    order: [["PayrollMonth", "DESC"]],
  });

  return records.map(toPayrollDTO);
};

const getPayrollById = async (id) => {
  const record = await Payroll.findByPk(id, {
    include: [{ model: Employee, as: "Employee", include: [{ model: Department, as: "Department" }] }],
  });
  if (!record) throw new Error("Payroll record not found");
  return toPayrollDTO(record);
};

const createPayroll = async (data) => {
  const { EmployeeId, PayrollMonth, BasicSalary, HRA, Allowances, Bonus, PF, Tax, Deductions } = data;

  const employee = await Employee.findByPk(EmployeeId);
  if (!employee) throw new Error("Employee not found");

  // Prevent duplicate payroll for same month
  const existing = await Payroll.findOne({
    where: { EmployeeId, PayrollMonth },
  });
  if (existing) {
    throw new Error(`Payroll record for month ${PayrollMonth} already exists for this employee`);
  }

  const record = await Payroll.create({
    EmployeeId,
    PayrollMonth,
    BasicSalary: Number(BasicSalary) || 0,
    HRA: Number(HRA) || 0,
    Allowances: Number(Allowances) || 0,
    Bonus: Number(Bonus) || 0,
    PF: Number(PF) || 0,
    Tax: Number(Tax) || 0,
    Deductions: Number(Deductions) || 0,
  });

  const fullRecord = await Payroll.findByPk(record.PayrollId, {
    include: [{ model: Employee, as: "Employee", include: [{ model: Department, as: "Department" }] }],
  });

  return toPayrollDTO(fullRecord);
};

const updatePayroll = async (id, data) => {
  const payroll = await Payroll.findByPk(id);
  if (!payroll) throw new Error("Payroll record not found");

  await payroll.update({
    BasicSalary: data.BasicSalary !== undefined ? Number(data.BasicSalary) : payroll.BasicSalary,
    HRA: data.HRA !== undefined ? Number(data.HRA) : payroll.HRA,
    Allowances: data.Allowances !== undefined ? Number(data.Allowances) : payroll.Allowances,
    Bonus: data.Bonus !== undefined ? Number(data.Bonus) : payroll.Bonus,
    PF: data.PF !== undefined ? Number(data.PF) : payroll.PF,
    Tax: data.Tax !== undefined ? Number(data.Tax) : payroll.Tax,
    Deductions: data.Deductions !== undefined ? Number(data.Deductions) : payroll.Deductions,
  });

  const fullRecord = await Payroll.findByPk(payroll.PayrollId, {
    include: [{ model: Employee, as: "Employee", include: [{ model: Department, as: "Department" }] }],
  });

  return toPayrollDTO(fullRecord);
};

const deletePayroll = async (id) => {
  const payroll = await Payroll.findByPk(id);
  if (!payroll) throw new Error("Payroll record not found");
  await payroll.destroy();
  return true;
};

module.exports = {
  getAllPayroll,
  getPayrollByEmployee,
  getPayrollById,
  createPayroll,
  updatePayroll,
  deletePayroll,
};

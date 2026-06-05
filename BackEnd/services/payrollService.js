const { Payroll, Employee } = require("../models");

const getAllPayroll = async () => {
  return await Payroll.findAll({
    include: [{ model: Employee, as: "Employee", attributes: ["EmployeeId", "FirstName", "LastName", "EmployeeCode"] }],
    order: [["PayrollMonth", "DESC"]],
  });
};

const getPayrollByEmployee = async (employeeId) => {
  const employee = await Employee.findByPk(employeeId);
  if (!employee) throw new Error("Employee not found");

  return await Payroll.findAll({
    where: { EmployeeId: employeeId },
    order: [["PayrollMonth", "DESC"]],
  });
};

const createPayroll = async (data) => {
  const employee = await Employee.findByPk(data.EmployeeId);
  if (!employee) throw new Error("Employee not found");

  // Check duplicate payroll for same month
  const existing = await Payroll.findOne({
    where: { EmployeeId: data.EmployeeId, PayrollMonth: data.PayrollMonth },
  });
  if (existing) throw new Error(`Payroll for ${data.PayrollMonth} already exists for this employee`);

  return await Payroll.create(data); // NetSalary auto-calculated via hook
};

const updatePayroll = async (id, data) => {
  const payroll = await Payroll.findByPk(id);
  if (!payroll) throw new Error("Payroll record not found");
  await payroll.update(data); // Hook recalculates NetSalary
  return payroll;
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
  createPayroll,
  updatePayroll,
  deletePayroll,
};

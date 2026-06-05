const { Employee, Department } = require("../models");
const { Op } = require("sequelize");

const getAllEmployees = async () => {
  return await Employee.findAll({
    include: [{ model: Department, as: "Department", attributes: ["DepartmentId", "DepartmentName"] }],
    order: [["createdAt", "DESC"]],
  });
};

const getEmployeeById = async (id) => {
  const employee = await Employee.findByPk(id, {
    include: [{ model: Department, as: "Department" }],
  });
  if (!employee) throw new Error("Employee not found");
  return employee;
};

const createEmployee = async (data) => {
  // Check unique EmployeeCode
  const codeExists = await Employee.findOne({ where: { EmployeeCode: data.EmployeeCode } });
  if (codeExists) throw new Error("Employee code already exists");

  // Check unique Email
  const emailExists = await Employee.findOne({ where: { Email: data.Email } });
  if (emailExists) throw new Error("Email already in use");

  return await Employee.create(data);
};

const updateEmployee = async (id, data) => {
  const employee = await Employee.findByPk(id);
  if (!employee) throw new Error("Employee not found");

  // If updating email, check uniqueness
  if (data.Email && data.Email !== employee.Email) {
    const emailExists = await Employee.findOne({
      where: { Email: data.Email, EmployeeId: { [Op.ne]: id } },
    });
    if (emailExists) throw new Error("Email already in use");
  }

  await employee.update(data);
  return employee;
};

const deleteEmployee = async (id) => {
  const employee = await Employee.findByPk(id);
  if (!employee) throw new Error("Employee not found");
  await employee.destroy();
  return true;
};

module.exports = {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};

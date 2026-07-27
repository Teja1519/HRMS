const bcrypt = require("bcryptjs");
const { Employee, Department, User } = require("../models");
const { Op } = require("sequelize");

const DEFAULT_EMPLOYEE_PASSWORD = process.env.DEFAULT_EMPLOYEE_PASSWORD || "Welcome@123";

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
  const codeExists = await Employee.findOne({ where: { EmployeeCode: data.EmployeeCode } });
  if (codeExists) throw new Error("Employee code already exists");

  const emailExists = await Employee.findOne({ where: { Email: data.Email } });
  if (emailExists) throw new Error("Email already in use");

  const employee = await Employee.create(data);

  const existingUser = await User.findOne({ where: { Username: data.Email } });
  if (existingUser) {
    await employee.update({ UserId: existingUser.UserId });
  } else {
    const hashedPassword = await bcrypt.hash(DEFAULT_EMPLOYEE_PASSWORD, 10);
    const user = await User.create({
      Username: data.Email,
      Password: hashedPassword,
      Role: "Employee",
    });
    await employee.update({ UserId: user.UserId });
  }

  return employee;
};

const updateEmployee = async (id, data) => {
  const employee = await Employee.findByPk(id);
  if (!employee) throw new Error("Employee not found");

  if (data.Email && data.Email !== employee.Email) {
    const emailExists = await Employee.findOne({
      where: { Email: data.Email, EmployeeId: { [Op.ne]: id } },
    });
    if (emailExists) throw new Error("Email already in use");
  }

  if (data.EmployeeCode && data.EmployeeCode !== employee.EmployeeCode) {
    const codeExists = await Employee.findOne({
      where: { EmployeeCode: data.EmployeeCode, EmployeeId: { [Op.ne]: id } },
    });
    if (codeExists) throw new Error("Employee code already exists");
  }

  await employee.update(data);

  return await Employee.findByPk(id, {
    include: [{ model: Department, as: "Department", attributes: ["DepartmentId", "DepartmentName"] }],
  });
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

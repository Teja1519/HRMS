const { Department, Employee } = require("../models");

const getAllDepartments = async () => {
  return await Department.findAll({
    include: [
      {
        model: Employee,
        as: "Employees",
        attributes: ["EmployeeId", "FirstName", "LastName", "Status"],
      },
    ],
    order: [["DepartmentName", "ASC"]],
  });
};

const getDepartmentById = async (id) => {
  const dept = await Department.findByPk(id, {
    include: [{ model: Employee, as: "Employees" }],
  });
  if (!dept) throw new Error("Department not found");
  return dept;
};

const createDepartment = async (data) => {
  const existing = await Department.findOne({ where: { DepartmentName: data.DepartmentName } });
  if (existing) throw new Error("Department name already exists");
  return await Department.create(data);
};

const updateDepartment = async (id, data) => {
  const dept = await Department.findByPk(id);
  if (!dept) throw new Error("Department not found");
  await dept.update(data);
  return dept;
};

const deleteDepartment = async (id) => {
  const dept = await Department.findByPk(id);
  if (!dept) throw new Error("Department not found");
  await dept.destroy();
  return true;
};

module.exports = {
  getAllDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
};

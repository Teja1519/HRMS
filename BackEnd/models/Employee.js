const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Employee = sequelize.define(
  "Employee",
  {
    EmployeeId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    EmployeeCode: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    FirstName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    LastName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    Email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    Phone: {
      type: DataTypes.STRING(15),
      allowNull: true,
    },
    Gender: {
      type: DataTypes.ENUM("Male", "Female", "Other"),
      allowNull: true,
    },
    DateOfBirth: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    Address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    Designation: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    HireDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    Salary: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
      defaultValue: 0.0,
    },
    DepartmentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Departments",
        key: "DepartmentId",
      },
    },
    Status: {
      type: DataTypes.ENUM("Active", "Inactive", "Terminated"),
      defaultValue: "Active",
    },
  },
  {
    tableName: "Employees",
    timestamps: true,
  }
);

module.exports = Employee;

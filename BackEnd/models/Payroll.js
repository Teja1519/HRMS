const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Payroll = sequelize.define(
  "Payroll",
  {
    PayrollId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    EmployeeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Employees",
        key: "EmployeeId",
      },
    },
    PayrollMonth: {
      type: DataTypes.STRING(20), // e.g., "2024-01"
      allowNull: false,
    },
    BasicSalary: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0.0,
    },
    Allowances: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0.0,
    },
    Bonus: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0.0,
    },
    Deductions: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0.0,
    },
    NetSalary: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0.0,
    },
  },
  {
    tableName: "Payroll",
    timestamps: true,
    hooks: {
      // Auto-calculate NetSalary before saving
      beforeCreate: (payroll) => {
        payroll.NetSalary =
          parseFloat(payroll.BasicSalary || 0) +
          parseFloat(payroll.Allowances || 0) +
          parseFloat(payroll.Bonus || 0) -
          parseFloat(payroll.Deductions || 0);
      },
      beforeUpdate: (payroll) => {
        payroll.NetSalary =
          parseFloat(payroll.BasicSalary || 0) +
          parseFloat(payroll.Allowances || 0) +
          parseFloat(payroll.Bonus || 0) -
          parseFloat(payroll.Deductions || 0);
      },
    },
  }
);

module.exports = Payroll;

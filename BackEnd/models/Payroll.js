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
      type: DataTypes.STRING(20), // e.g., "2026-07"
      allowNull: false,
    },
    BasicSalary: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0.0,
    },
    HRA: {
      type: DataTypes.DECIMAL(12, 2),
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
    PF: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0.0,
    },
    Tax: {
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
      beforeCreate: (payroll) => {
        const basic = parseFloat(payroll.BasicSalary || 0);
        const hra = parseFloat(payroll.HRA || 0);
        const allowances = parseFloat(payroll.Allowances || 0);
        const bonus = parseFloat(payroll.Bonus || 0);
        const pf = parseFloat(payroll.PF || 0);
        const tax = parseFloat(payroll.Tax || 0);
        const deductions = parseFloat(payroll.Deductions || 0);

        const gross = basic + hra + allowances + bonus;
        const totalDeductions = pf + tax + deductions;
        const net = gross - totalDeductions;

        payroll.NetSalary = Math.round(net * 100) / 100;
      },
      beforeUpdate: (payroll) => {
        const basic = parseFloat(payroll.BasicSalary || 0);
        const hra = parseFloat(payroll.HRA || 0);
        const allowances = parseFloat(payroll.Allowances || 0);
        const bonus = parseFloat(payroll.Bonus || 0);
        const pf = parseFloat(payroll.PF || 0);
        const tax = parseFloat(payroll.Tax || 0);
        const deductions = parseFloat(payroll.Deductions || 0);

        const gross = basic + hra + allowances + bonus;
        const totalDeductions = pf + tax + deductions;
        const net = gross - totalDeductions;

        payroll.NetSalary = Math.round(net * 100) / 100;
      },
    },
  }
);

module.exports = Payroll;

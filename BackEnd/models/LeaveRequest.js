const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const LeaveRequest = sequelize.define(
  "LeaveRequest",
  {
    LeaveId: {
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
    LeaveTypeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "LeaveTypes",
        key: "LeaveTypeId",
      },
    },
    StartDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    EndDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    Reason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    Status: {
      type: DataTypes.ENUM("Pending", "Approved", "Rejected"),
      defaultValue: "Pending",
    },
    AppliedDate: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "LeaveRequests",
    timestamps: true,
  }
);

module.exports = LeaveRequest;

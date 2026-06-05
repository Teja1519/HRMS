const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const LeaveType = sequelize.define(
  "LeaveType",
  {
    LeaveTypeId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    LeaveTypeName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    MaxDays: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    tableName: "LeaveTypes",
    timestamps: true,
  }
);

module.exports = LeaveType;

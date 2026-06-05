const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Attendance = sequelize.define(
  "Attendance",
  {
    AttendanceId: {
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
    AttendanceDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    CheckIn: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    CheckOut: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    Status: {
      type: DataTypes.ENUM("Present", "Absent", "Late", "Half-Day"),
      defaultValue: "Present",
    },
  },
  {
    tableName: "Attendance",
    timestamps: true,
  }
);

module.exports = Attendance;

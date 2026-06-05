const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Report = sequelize.define(
  "Report",
  {
    ReportId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ReportName: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    ReportType: {
      type: DataTypes.ENUM("Attendance", "Payroll", "Leave", "Employee"),
      allowNull: false,
    },
    GeneratedDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "Reports",
    timestamps: true,
  }
);

module.exports = Report;

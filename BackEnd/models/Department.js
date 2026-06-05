const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Department = sequelize.define(
  "Department",
  {
    DepartmentId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    DepartmentName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    Description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "Departments",
    timestamps: true,
  }
);

module.exports = Department;

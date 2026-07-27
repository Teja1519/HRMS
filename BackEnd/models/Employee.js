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
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    AlternatePhone: {
      type: DataTypes.STRING(20),
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
    BloodGroup: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    MaritalStatus: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    Nationality: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    Address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    City: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    State: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    Country: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    PinCode: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    Designation: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    ReportingManager: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    EmploymentType: {
      type: DataTypes.STRING(50),
      defaultValue: "Full-Time",
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
    EmergencyContactName: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    EmergencyContactRelation: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    EmergencyContactPhone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    BankName: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    BankAccountHolder: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    BankAccountNumber: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    BankIFSC: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    BankBranch: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    ProfilePicture: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: true,
      references: {
        model: "Users",
        key: "UserId",
      },
    },
  },
  {
    tableName: "Employees",
    timestamps: true,
  }
);

module.exports = Employee;

const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
    logging: process.env.NODE_ENV === "development" ? console.log : false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

const seedInitialData = async () => {
  try {
    const { LeaveType, Department, Setting } = require("../models");

    // Seed LeaveTypes
    const leaveTypeCount = await LeaveType.count();
    if (leaveTypeCount === 0) {
      await LeaveType.bulkCreate([
        { LeaveTypeName: "Casual Leave", MaxDays: 12 },
        { LeaveTypeName: "Sick Leave", MaxDays: 10 },
        { LeaveTypeName: "Paid Leave", MaxDays: 15 },
        { LeaveTypeName: "Unpaid Leave", MaxDays: 30 },
      ]);
      console.log("🌱 Default LeaveTypes seeded");
    }

    // Seed Departments
    const deptCount = await Department.count();
    if (deptCount === 0) {
      await Department.bulkCreate([
        { DepartmentName: "Engineering", Description: "Software development and IT" },
        { DepartmentName: "Human Resources", Description: "HR and people operations" },
        { DepartmentName: "Finance", Description: "Accounts, payroll, and budgeting" },
        { DepartmentName: "Marketing", Description: "Brand and growth" },
        { DepartmentName: "Operations", Description: "Day-to-day business operations" },
      ]);
      console.log("🌱 Default Departments seeded");
    }

    // Seed Settings
    const settingCount = await Setting.count();
    if (settingCount === 0) {
      await Setting.bulkCreate([
        { SettingName: "company_name", SettingValue: "HRMS Corp" },
        { SettingName: "office_start_time", SettingValue: "09:00" },
        { SettingName: "office_end_time", SettingValue: "18:00" },
        { SettingName: "currency", SettingValue: "INR" },
      ]);
      console.log("🌱 Default Settings seeded");
    }
  } catch (error) {
    console.error("⚠️ Error seeding initial data:", error.message);
  }
};

const ensureSchemaUpToDate = async () => {
  try {
    const [empCols] = await sequelize.query(`
      SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'Employees' AND COLUMN_NAME = 'UserId'
    `);
    if (empCols.length === 0) {
      await sequelize.query("ALTER TABLE Employees ADD COLUMN UserId INT NULL UNIQUE");
      console.log("🛠️ Added missing UserId column to Employees table in MySQL");
    }

    const [notifCols] = await sequelize.query(`
      SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'Notifications' AND COLUMN_NAME = 'Title'
    `);
    if (notifCols.length === 0) {
      await sequelize.query("ALTER TABLE Notifications ADD COLUMN Title VARCHAR(150) DEFAULT 'Announcement'");
      await sequelize.query("ALTER TABLE Notifications ADD COLUMN Priority VARCHAR(20) DEFAULT 'Normal'");
      await sequelize.query("ALTER TABLE Notifications ADD COLUMN Audience VARCHAR(20) DEFAULT 'All'");
      await sequelize.query("ALTER TABLE Notifications ADD COLUMN DepartmentId INT NULL");
      await sequelize.query("ALTER TABLE Notifications ADD COLUMN CreatedBy INT NULL");
      console.log("🛠️ Added missing announcement columns to Notifications table in MySQL");
    }
  } catch (err) {
    console.error("⚠️ Schema update check warning:", err.message);
  }
};

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ MySQL connected via Sequelize");

    await ensureSchemaUpToDate();

    // Sync models
    await sequelize.sync({ alter: false });
    console.log("✅ Database synced");

    const { runMigrations } = require("./migrator");
    await runMigrations();

    await seedInitialData();
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };

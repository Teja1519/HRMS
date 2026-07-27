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
    const queryInterface = sequelize.getQueryInterface();

    // 1. Check Users table columns
    const userCols = await queryInterface.describeTable("Users").catch(() => ({}));
    if (!userCols.ResetPasswordToken) {
      await sequelize.query("ALTER TABLE Users ADD COLUMN ResetPasswordToken VARCHAR(255) NULL");
      console.log("🛠️ Added ResetPasswordToken to Users table");
    }
    if (!userCols.ResetPasswordExpires) {
      await sequelize.query("ALTER TABLE Users ADD COLUMN ResetPasswordExpires DATETIME NULL");
      console.log("🛠️ Added ResetPasswordExpires to Users table");
    }
    if (!userCols.RefreshToken) {
      await sequelize.query("ALTER TABLE Users ADD COLUMN RefreshToken VARCHAR(500) NULL");
      console.log("🛠️ Added RefreshToken to Users table");
    }

    // 2. Check Employees table columns
    const empCols = await queryInterface.describeTable("Employees").catch(() => ({}));
    if (!empCols.UserId) {
      await sequelize.query("ALTER TABLE Employees ADD COLUMN UserId INT NULL UNIQUE");
      console.log("🛠️ Added UserId to Employees table");
    }

    const newEmpFields = [
      { name: "BloodGroup", type: "VARCHAR(10) NULL" },
      { name: "MaritalStatus", type: "VARCHAR(20) NULL" },
      { name: "Nationality", type: "VARCHAR(50) NULL" },
      { name: "AlternatePhone", type: "VARCHAR(20) NULL" },
      { name: "City", type: "VARCHAR(100) NULL" },
      { name: "State", type: "VARCHAR(100) NULL" },
      { name: "Country", type: "VARCHAR(100) NULL" },
      { name: "PinCode", type: "VARCHAR(20) NULL" },
      { name: "ReportingManager", type: "VARCHAR(100) NULL" },
      { name: "EmploymentType", type: "VARCHAR(50) DEFAULT 'Full-Time'" },
      { name: "EmergencyContactName", type: "VARCHAR(100) NULL" },
      { name: "EmergencyContactRelation", type: "VARCHAR(50) NULL" },
      { name: "EmergencyContactPhone", type: "VARCHAR(20) NULL" },
      { name: "BankName", type: "VARCHAR(100) NULL" },
      { name: "BankAccountHolder", type: "VARCHAR(100) NULL" },
      { name: "BankAccountNumber", type: "VARCHAR(50) NULL" },
      { name: "BankIFSC", type: "VARCHAR(20) NULL" },
      { name: "BankBranch", type: "VARCHAR(100) NULL" },
      { name: "ProfilePicture", type: "VARCHAR(255) NULL" },
    ];

    for (const field of newEmpFields) {
      if (!empCols[field.name]) {
        await sequelize.query(`ALTER TABLE Employees ADD COLUMN ${field.name} ${field.type}`).catch(() => {});
        console.log(`🛠️ Added ${field.name} to Employees table`);
      }
    }

    // 3. Check Payroll table columns
    const payrollCols = await queryInterface.describeTable("Payroll").catch(() => ({}));
    if (!payrollCols.HRA) {
      await sequelize.query("ALTER TABLE Payroll ADD COLUMN HRA DECIMAL(12,2) DEFAULT 0.00");
      console.log("🛠️ Added HRA to Payroll table");
    }
    if (!payrollCols.PF) {
      await sequelize.query("ALTER TABLE Payroll ADD COLUMN PF DECIMAL(12,2) DEFAULT 0.00");
      console.log("🛠️ Added PF to Payroll table");
    }
    if (!payrollCols.Tax) {
      await sequelize.query("ALTER TABLE Payroll ADD COLUMN Tax DECIMAL(12,2) DEFAULT 0.00");
      console.log("🛠️ Added Tax to Payroll table");
    }

    // 4. Check Notifications table columns
    try {
      await sequelize.query("ALTER TABLE Notifications MODIFY COLUMN UserId INT NULL");
      await sequelize.query("ALTER TABLE Notifications MODIFY COLUMN DepartmentId INT NULL");
      await sequelize.query("ALTER TABLE Notifications MODIFY COLUMN CreatedBy INT NULL");
    } catch (e) {}
    const notifCols = await queryInterface.describeTable("Notifications").catch(() => ({}));
    if (!notifCols.Title) {
      await sequelize.query("ALTER TABLE Notifications ADD COLUMN Title VARCHAR(150) DEFAULT 'Announcement'");
      console.log("🛠️ Added Title to Notifications table");
    }
    if (!notifCols.Priority) {
      await sequelize.query("ALTER TABLE Notifications ADD COLUMN Priority VARCHAR(20) DEFAULT 'Normal'");
      console.log("🛠️ Added Priority to Notifications table");
    }
    if (!notifCols.Audience) {
      await sequelize.query("ALTER TABLE Notifications ADD COLUMN Audience VARCHAR(20) DEFAULT 'All'");
      console.log("🛠️ Added Audience to Notifications table");
    }
    if (!notifCols.DepartmentId) {
      await sequelize.query("ALTER TABLE Notifications ADD COLUMN DepartmentId INT NULL");
      console.log("🛠️ Added DepartmentId to Notifications table");
    }
    if (!notifCols.CreatedBy) {
      await sequelize.query("ALTER TABLE Notifications ADD COLUMN CreatedBy INT NULL");
      console.log("🛠️ Added CreatedBy to Notifications table");
    }
    if (!notifCols.CreatedAt && !notifCols.createdAt) {
      await sequelize.query("ALTER TABLE Notifications ADD COLUMN CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP");
      console.log("🛠️ Added CreatedAt to Notifications table");
    }
    if (!notifCols.UpdatedAt && !notifCols.updatedAt) {
      await sequelize.query("ALTER TABLE Notifications ADD COLUMN UpdatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP");
      console.log("🛠️ Added UpdatedAt to Notifications table");
    }

    // 5. Check LeaveRequests table columns
    const leaveCols = await queryInterface.describeTable("LeaveRequests").catch(() => ({}));
    if (!leaveCols.Comments) {
      await sequelize.query("ALTER TABLE LeaveRequests ADD COLUMN Comments TEXT NULL");
      console.log("🛠️ Added Comments to LeaveRequests table");
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

    // Sync models safely
    await sequelize.sync({ alter: false });
    console.log("✅ Database synced");

    const { runMigrations } = require("./migrator");
    await runMigrations().catch((err) => console.log("Migration notice:", err.message));

    await seedInitialData();
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };

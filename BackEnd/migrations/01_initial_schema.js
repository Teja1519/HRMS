const { DataTypes } = require("sequelize");

module.exports = {
  async up({ context: queryInterface }) {
    // 1. Users
    await queryInterface.createTable("Users", {
      UserId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      Username: { type: DataTypes.STRING(100), allowNull: false, unique: true },
      Password: { type: DataTypes.STRING(255), allowNull: false },
      Role: { type: DataTypes.ENUM("Admin", "HR", "Employee"), allowNull: false, defaultValue: "Employee" },
      createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    });

    // 2. Departments
    await queryInterface.createTable("Departments", {
      DepartmentId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      DepartmentName: { type: DataTypes.STRING(100), allowNull: false, unique: true },
      Description: { type: DataTypes.TEXT, allowNull: true },
      createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    });

    // 3. Employees
    await queryInterface.createTable("Employees", {
      EmployeeId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      EmployeeCode: { type: DataTypes.STRING(20), allowNull: false, unique: true },
      FirstName: { type: DataTypes.STRING(100), allowNull: false },
      LastName: { type: DataTypes.STRING(100), allowNull: false },
      Email: { type: DataTypes.STRING(150), allowNull: false, unique: true },
      Phone: { type: DataTypes.STRING(15), allowNull: true },
      Gender: { type: DataTypes.ENUM("Male", "Female", "Other"), allowNull: true },
      DateOfBirth: { type: DataTypes.DATEONLY, allowNull: true },
      Address: { type: DataTypes.TEXT, allowNull: true },
      Designation: { type: DataTypes.STRING(100), allowNull: true },
      HireDate: { type: DataTypes.DATEONLY, allowNull: true },
      Salary: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0.00 },
      DepartmentId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: "Departments", key: "DepartmentId" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      Status: { type: DataTypes.ENUM("Active", "Inactive", "Terminated"), defaultValue: "Active" },
      UserId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        unique: true,
        references: { model: "Users", key: "UserId" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    });

    // 4. Attendance
    await queryInterface.createTable("Attendance", {
      AttendanceId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      EmployeeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "Employees", key: "EmployeeId" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      AttendanceDate: { type: DataTypes.DATEONLY, allowNull: false },
      CheckIn: { type: DataTypes.TIME, allowNull: true },
      CheckOut: { type: DataTypes.TIME, allowNull: true },
      Status: { type: DataTypes.ENUM("Present", "Absent", "Late", "Half-Day"), defaultValue: "Present" },
      createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    });

    await queryInterface.addIndex("Attendance", ["EmployeeId", "AttendanceDate"], {
      unique: true,
      name: "idx_attendance_emp_date",
    });

    // 5. LeaveTypes
    await queryInterface.createTable("LeaveTypes", {
      LeaveTypeId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      LeaveTypeName: { type: DataTypes.STRING(100), allowNull: false, unique: true },
      MaxDays: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    });

    // 6. LeaveRequests
    await queryInterface.createTable("LeaveRequests", {
      LeaveId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      EmployeeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "Employees", key: "EmployeeId" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      LeaveTypeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "LeaveTypes", key: "LeaveTypeId" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      StartDate: { type: DataTypes.DATEONLY, allowNull: false },
      EndDate: { type: DataTypes.DATEONLY, allowNull: false },
      Reason: { type: DataTypes.TEXT, allowNull: true },
      Status: { type: DataTypes.ENUM("Pending", "Approved", "Rejected"), defaultValue: "Pending" },
      AppliedDate: { type: DataTypes.DATEONLY, defaultValue: DataTypes.NOW },
      createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    });

    // 7. Payroll
    await queryInterface.createTable("Payroll", {
      PayrollId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      EmployeeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "Employees", key: "EmployeeId" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      PayrollMonth: { type: DataTypes.STRING(20), allowNull: false },
      BasicSalary: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0.00 },
      Allowances: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0.00 },
      Bonus: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0.00 },
      Deductions: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0.00 },
      NetSalary: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0.00 },
      createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    });

    await queryInterface.addIndex("Payroll", ["EmployeeId", "PayrollMonth"], {
      unique: true,
      name: "idx_payroll_emp_month",
    });

    // 8. Notifications
    await queryInterface.createTable("Notifications", {
      NotificationId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      Title: { type: DataTypes.STRING(150), allowNull: false, defaultValue: "Announcement" },
      Message: { type: DataTypes.TEXT, allowNull: false },
      Priority: { type: DataTypes.ENUM("Normal", "Important", "Urgent"), defaultValue: "Normal" },
      Audience: { type: DataTypes.ENUM("All", "Department", "User"), defaultValue: "All" },
      DepartmentId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: "Departments", key: "DepartmentId" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      UserId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: "Users", key: "UserId" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      CreatedBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: "Users", key: "UserId" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      IsRead: { type: DataTypes.BOOLEAN, defaultValue: false },
      CreatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      UpdatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    });

    // 9. Settings
    await queryInterface.createTable("Settings", {
      SettingId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      SettingName: { type: DataTypes.STRING(100), allowNull: false, unique: true },
      SettingValue: { type: DataTypes.TEXT, allowNull: true },
      createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    });
  },

  async down({ context: queryInterface }) {
    await queryInterface.dropTable("Settings");
    await queryInterface.dropTable("Notifications");
    await queryInterface.dropTable("Payroll");
    await queryInterface.dropTable("LeaveRequests");
    await queryInterface.dropTable("LeaveTypes");
    await queryInterface.dropTable("Attendance");
    await queryInterface.dropTable("Employees");
    await queryInterface.dropTable("Departments");
    await queryInterface.dropTable("Users");
  },
};

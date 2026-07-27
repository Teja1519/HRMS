-- ============================================================
--  HRMS Database Schema
--  Run this in MySQL Workbench or CLI before starting the server
-- ============================================================

CREATE DATABASE IF NOT EXISTS hrms_db;
USE hrms_db;

-- Users
CREATE TABLE IF NOT EXISTS Users (
  UserId     INT AUTO_INCREMENT PRIMARY KEY,
  Username   VARCHAR(100) NOT NULL UNIQUE,
  Password   VARCHAR(255) NOT NULL,
  Role       ENUM('Admin', 'HR', 'Employee') NOT NULL DEFAULT 'Employee',
  createdAt  DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt  DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Departments
CREATE TABLE IF NOT EXISTS Departments (
  DepartmentId    INT AUTO_INCREMENT PRIMARY KEY,
  DepartmentName  VARCHAR(100) NOT NULL UNIQUE,
  Description     TEXT,
  createdAt       DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt       DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Employees
CREATE TABLE IF NOT EXISTS Employees (
  EmployeeId    INT AUTO_INCREMENT PRIMARY KEY,
  EmployeeCode  VARCHAR(20) NOT NULL UNIQUE,
  FirstName     VARCHAR(100) NOT NULL,
  LastName      VARCHAR(100) NOT NULL,
  Email         VARCHAR(150) NOT NULL UNIQUE,
  Phone         VARCHAR(15),
  Gender        ENUM('Male', 'Female', 'Other'),
  DateOfBirth   DATE,
  Address       TEXT,
  Designation   VARCHAR(100),
  HireDate      DATE,
  Salary        DECIMAL(12,2) DEFAULT 0.00,
  DepartmentId  INT,
  Status        ENUM('Active', 'Inactive', 'Terminated') DEFAULT 'Active',
  UserId        INT UNIQUE,
  createdAt     DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt     DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (DepartmentId) REFERENCES Departments(DepartmentId) ON DELETE SET NULL,
  FOREIGN KEY (UserId) REFERENCES Users(UserId) ON DELETE SET NULL
);

-- Attendance
CREATE TABLE IF NOT EXISTS Attendance (
  AttendanceId    INT AUTO_INCREMENT PRIMARY KEY,
  EmployeeId      INT NOT NULL,
  AttendanceDate  DATE NOT NULL,
  CheckIn         TIME,
  CheckOut        TIME,
  Status          ENUM('Present', 'Absent', 'Late', 'Half-Day') DEFAULT 'Present',
  createdAt       DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt       DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_attendance (EmployeeId, AttendanceDate),
  FOREIGN KEY (EmployeeId) REFERENCES Employees(EmployeeId) ON DELETE CASCADE
);

-- Leave Types
CREATE TABLE IF NOT EXISTS LeaveTypes (
  LeaveTypeId    INT AUTO_INCREMENT PRIMARY KEY,
  LeaveTypeName  VARCHAR(100) NOT NULL UNIQUE,
  MaxDays        INT NOT NULL DEFAULT 0,
  createdAt      DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Leave Requests
CREATE TABLE IF NOT EXISTS LeaveRequests (
  LeaveId      INT AUTO_INCREMENT PRIMARY KEY,
  EmployeeId   INT NOT NULL,
  LeaveTypeId  INT NOT NULL,
  StartDate    DATE NOT NULL,
  EndDate      DATE NOT NULL,
  Reason       TEXT,
  Status       ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
  AppliedDate  DATE DEFAULT (CURDATE()),
  createdAt    DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt    DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (EmployeeId)  REFERENCES Employees(EmployeeId)  ON DELETE CASCADE,
  FOREIGN KEY (LeaveTypeId) REFERENCES LeaveTypes(LeaveTypeId) ON DELETE CASCADE
);

-- Payroll
CREATE TABLE IF NOT EXISTS Payroll (
  PayrollId     INT AUTO_INCREMENT PRIMARY KEY,
  EmployeeId    INT NOT NULL,
  PayrollMonth  VARCHAR(20) NOT NULL,
  BasicSalary   DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  Allowances    DECIMAL(12,2) DEFAULT 0.00,
  Bonus         DECIMAL(12,2) DEFAULT 0.00,
  Deductions    DECIMAL(12,2) DEFAULT 0.00,
  NetSalary     DECIMAL(12,2) DEFAULT 0.00,
  createdAt     DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt     DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_payroll (EmployeeId, PayrollMonth),
  FOREIGN KEY (EmployeeId) REFERENCES Employees(EmployeeId) ON DELETE CASCADE
);

-- Reports
CREATE TABLE IF NOT EXISTS Reports (
  ReportId       INT AUTO_INCREMENT PRIMARY KEY,
  ReportName     VARCHAR(150) NOT NULL,
  ReportType     ENUM('Attendance', 'Payroll', 'Leave', 'Employee') NOT NULL,
  GeneratedDate  DATETIME DEFAULT CURRENT_TIMESTAMP,
  createdAt      DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Notifications
CREATE TABLE IF NOT EXISTS Notifications (
  NotificationId  INT AUTO_INCREMENT PRIMARY KEY,
  Title           VARCHAR(150) NOT NULL DEFAULT 'Announcement',
  Message         TEXT NOT NULL,
  Priority        ENUM('Normal', 'Important', 'Urgent') DEFAULT 'Normal',
  Audience        ENUM('All', 'Department', 'User') DEFAULT 'All',
  DepartmentId    INT NULL,
  UserId          INT NULL,
  CreatedBy       INT NULL,
  IsRead          BOOLEAN DEFAULT FALSE,
  CreatedAt       DATETIME DEFAULT CURRENT_TIMESTAMP,
  UpdatedAt       DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (DepartmentId) REFERENCES Departments(DepartmentId) ON DELETE SET NULL,
  FOREIGN KEY (UserId) REFERENCES Users(UserId) ON DELETE CASCADE,
  FOREIGN KEY (CreatedBy) REFERENCES Users(UserId) ON DELETE SET NULL
);

-- Settings
CREATE TABLE IF NOT EXISTS Settings (
  SettingId     INT AUTO_INCREMENT PRIMARY KEY,
  SettingName   VARCHAR(100) NOT NULL UNIQUE,
  SettingValue  TEXT,
  createdAt     DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt     DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ─── Seed Data (optional, useful for testing) ─────────────────────────────────

INSERT IGNORE INTO Departments (DepartmentName, Description) VALUES
  ('Engineering',     'Software development and IT'),
  ('Human Resources', 'HR and people operations'),
  ('Finance',         'Accounts, payroll, and budgeting'),
  ('Marketing',       'Brand and growth'),
  ('Operations',      'Day-to-day business operations');

INSERT IGNORE INTO LeaveTypes (LeaveTypeName, MaxDays) VALUES
  ('Casual Leave',    12),
  ('Sick Leave',      10),
  ('Earned Leave',    15),
  ('Maternity Leave', 90),
  ('Paternity Leave', 15);

INSERT IGNORE INTO Settings (SettingName, SettingValue) VALUES
  ('company_name',      'HRMS Corp'),
  ('office_start_time', '09:00'),
  ('office_end_time',   '18:00'),
  ('currency',          'INR');

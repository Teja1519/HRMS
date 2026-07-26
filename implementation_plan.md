# Implementation Plan — Priority 1: User-Employee Linkage and Auth Context Security

## Goal Description
Establish a formal database relationship between the authentication credentials (`Users` table) and the HR profile details (`Employees` table). 

This solves the **Context Linkage Gap** by allowing the server to dynamically identify the logged-in employee's ID (`EmployeeId`) from their active JWT session, resolving the core dependencies for attendance tracking, leave applications, payroll reviews, and personal dashboards. It also closes the **IDOR (Insecure Direct Object Reference)** vulnerabilities where employees could spoof or query other users' data.

---

## User Review Required

> [!IMPORTANT]
> **Database Structure Alteration**
> * We will add a nullable, unique `UserId` foreign key to the `Employees` table pointing to `Users.UserId`. This enables a 1-to-1 relationship.
> * We must apply this update to the MySQL schema. Since Sequelize is set to `{ alter: false }` by default in `database.js`, we will temporarily enable `{ alter: true }` once or run an explicit SQL migration statement, and update the base `schema.sql` file.

> [!WARNING]
> **Impact on User Creation & Seeding**
> * Currently, `/api/auth/register` creates a `User` in isolation.
> * Moving forward, we should map them:
>   * When HR creates an `Employee` profile, they should also have a `User` account created (or vice-versa).
>   * Alternatively, we can link them by matching `User.Username` with `Employee.Email` or `EmployeeCode`.
>   * **Proposed Design**: We will link them programmatically by matching `Employees.Email` with `Users.Username` if they match, or by auto-creating a User when an Employee is created. For existing seed data and register calls, we will auto-associate an `Employee` profile if the username matches an employee email, or link them during registration.

---

## Open Questions

1. **How should we handle User credentials for existing/new Employees?**
   * *Option A (Recommended)*: When a new Employee profile is created in the admin portal, the backend automatically generates a corresponding login `User` with the `Username` set to their email, their role set to `Employee`, and a default password (e.g. `Welcome@123`).
   * *Option B*: Registration is done separately, and the user must enter an `EmployeeCode` to link their login to their existing Employee profile.
   
   *We will implement Option A because it is the standard enterprise practice.*

---

## Proposed Changes

### Database Layer

#### [MODIFY] [schema.sql](file:///d:/HRMS/BackEnd/config/schema.sql)
* Update the `Employees` table definition to include `UserId INT UNIQUE` and a foreign key constraint referencing `Users(UserId) ON DELETE SET NULL`.

### Sequelize Models

#### [MODIFY] [Employee.js](file:///d:/HRMS/BackEnd/models/Employee.js)
* Add `UserId` property to the Employee model properties mapping to the database schema.

#### [MODIFY] [User.js](file:///d:/HRMS/BackEnd/models/User.js)
* Ensure user exports are compatible.

#### [MODIFY] [index.js](file:///d:/HRMS/BackEnd/models/index.js)
* Define the 1-to-1 association:
  ```javascript
  User.hasOne(Employee, { foreignKey: "UserId", as: "Employee" });
  Employee.belongsTo(User, { foreignKey: "UserId", as: "User" });
  ```

### Authentication & Authorization Middleware

#### [MODIFY] [authMiddleware.js](file:///d:/HRMS/BackEnd/middleware/authMiddleware.js)
* Update token decoding to fetch the User *including* their associated Employee profile:
  ```javascript
  const user = await User.findByPk(decoded.UserId, {
    include: [{ model: Employee, as: "Employee", attributes: ["EmployeeId", "EmployeeCode"] }]
  });
  ```
* Attach `EmployeeId` and `EmployeeCode` to `req.user`:
  ```javascript
  req.user = {
    UserId: user.UserId,
    Username: user.Username,
    Role: user.Role,
    EmployeeId: user.Employee ? user.Employee.EmployeeId : null,
    EmployeeCode: user.Employee ? user.Employee.EmployeeCode : null,
  };
  ```

### Services & Controllers

#### [MODIFY] [authService.js](file:///d:/HRMS/BackEnd/services/authService.js)
* Link a new User to an Employee profile if an Employee record exists with the same email as the username.

#### [MODIFY] [employeeService.js](file:///d:/HRMS/BackEnd/services/employeeService.js)
* When creating an Employee, auto-create a login `User` record with their email as the username, default password, and role "Employee". Link `UserId` in the Employee record.

#### [MODIFY] [attendanceController.js](file:///d:/HRMS/BackEnd/controllers/attendanceController.js)
* Enforce `employeeId = req.user.EmployeeId` for Employee roles during Check-In / Check-Out.
* Enforce that `Employee` role users can only access `getAttendanceByEmployee` matching their own `req.user.EmployeeId`.

#### [MODIFY] [leaveController.js](file:///d:/HRMS/BackEnd/controllers/leaveController.js)
* Enforce `employeeId = req.user.EmployeeId` for Employee roles during Leave Application.
* Enforce that `Employee` role users can only query leaves matching their own `req.user.EmployeeId`.

#### [MODIFY] [payrollController.js](file:///d:/HRMS/BackEnd/controllers/payrollController.js)
* Enforce that `Employee` role users can only view payroll matching their own `req.user.EmployeeId`.

#### [MODIFY] [dashboardController.js](file:///d:/HRMS/BackEnd/controllers/dashboardController.js)
* Enforce that `Employee` role users can only view employee dashboards matching their own `req.user.EmployeeId`.

---

## Verification Plan

### Automated Tests
* We will verify using custom integration tests or HTTP requests (via a scratch script) simulating requests with Admin, HR, and Employee tokens.

### Manual Verification
1. **Database Schema**: Verify using MySQL CLI/tooling that the column `UserId` is added to `Employees` with proper FK constraints.
2. **Employee Creation**: Create a new Employee via service/controller and verify a `User` account is automatically generated and linked.
3. **Spoofing prevention**:
   * Log in as an Employee.
   * Send a POST to `/api/attendance/checkin` with another Employee's ID in the body. Verify it records attendance for the *logged-in* Employee, not the spoofed ID.
   * Attempt to fetch `/api/payroll/employee/X` where `X` belongs to a different employee. Verify it returns `403 Forbidden` or `401 Unauthorized` (or filters results).

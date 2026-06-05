# Human Resource Management System (HRMS)

## Overview

Human Resource Management System (HRMS) is a web-based application developed as a B.Tech academic team project to streamline and automate core Human Resource operations within an organization. The system provides a centralized platform for managing employees, attendance, leave requests, payroll, departments, notifications, and administrative activities.

The application reduces manual effort, improves data accuracy, and enhances organizational efficiency through role-based access control and automated HR workflows.

## Features

### User Authentication & Authorization

* Secure login using JWT (JSON Web Tokens)
* Password encryption using bcrypt
* Role-Based Access Control (RBAC)
* Separate access levels for:

  * Admin
  * HR
  * Employee

### Employee Management

* Add, update, view, and delete employee records
* Employee profile management
* Department assignment
* Employee status tracking (Active/Inactive)

### Department Management

* Create and manage departments
* Department-wise employee organization
* Department information maintenance

### Attendance Management

* Employee check-in and check-out
* Daily attendance tracking
* Attendance status management
* Attendance history records

### Leave Management

* Leave application submission
* Leave type management
* Leave approval and rejection workflow
* Leave history tracking

### Payroll Management

* Salary management
* Allowances and bonus tracking
* Deduction management
* Automatic net salary calculation
* Payroll record maintenance

### Dashboard & Reporting

* Admin dashboard
* HR dashboard
* Employee dashboard
* Organization statistics and summaries

### Notification System

* User-specific notifications
* Read/Unread notification tracking
* System-generated alerts

### System Settings

* Application configuration management
* Customizable system settings

---

## Technology Stack

### Frontend

* React.js
* TypeScript
* Tailwind CSS
* Axios

### Backend

* Node.js
* Express.js
* RESTful APIs

### Database

* MySQL
* Sequelize ORM

### Security

* JWT Authentication
* bcrypt Password Hashing
* Role-Based Authorization

### Development Tools

* Git
* GitHub
* Postman

---

## Database Modules

The system consists of the following database modules:

* Users
* Employees
* Departments
* Attendance
* Leave Types
* Leave Requests
* Payroll
* Reports
* Notifications
* Settings

---

## Project Objective

The primary objective of this project is to automate routine Human Resource activities and provide an efficient platform for managing employee-related information. The system aims to:

* Reduce manual HR workload
* Improve employee record management
* Automate attendance and leave processes
* Simplify payroll administration
* Enhance organizational productivity
* Provide secure role-based access to users

---

## Project Type

Academic Team Project (B.Tech)

This project demonstrates full-stack web application development concepts including frontend development, backend API development, relational database management, authentication, authorization, and CRUD operations using modern web technologies.

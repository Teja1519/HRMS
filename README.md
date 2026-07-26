# 🚀 HRMS — Enterprise Human Resource Management System

[![Node.js Version](https://img.shields.shields.shields.shields.shields.shields.shields.io/badge/node.js-%3E%3D%2018.0.0-green.svg)](https://nodejs.org/)
[![Database](https://img.shields.shields.shields.shields.shields.shields.io/badge/database-MySQL%208.0%2B-blue.svg)](https://www.mysql.com/)
[![ORM](https://img.shields.shields.shields.shields.shields.shields.io/badge/orm-Sequelize%20v6-blueviolet.svg)](https://sequelize.org/)
[![Frontend Compiler](https://img.shields.shields.shields.shields.shields.shields.io/badge/compiler-Vite%20%2B%20esbuild-yellow.svg)](https://vitejs.dev/)
[![Styling](https://img.shields.shields.shields.shields.shields.shields.io/badge/styling-Tailwind%20CSS-38bdf8.svg)](https://tailwindcss.com/)
[![License](https://img.shields.shields.shields.shields.shields.shields.shields.shields.io/badge/license-MIT-green.svg)](#)

An enterprise-grade **Human Resource Management System (HRMS)** built on a modern, decoupled architecture. This application provides organizations with an intuitive platform to handle employee records, manage departments, log attendance, request and approve leaves, process payroll with automatic base salary lookup, and display real-time user notification logs.

---

## 🎯 Key Project Highlights (For Recruiters & Interviewers)

* **Clean Decoupled Architecture**: Separation of concerns with a robust Node.js/Express REST API backend and a responsive React/Vite frontend.
* **Database & ORM Integration**: Uses **Sequelize ORM** with **MySQL** for relational integrity. Features automatic model syncing on server startup (`alter: false`), removing the need for manual migration files.
* **Granular Role-Based Access Control (RBAC)**: Secure route protection on both frontend and backend. Views adapt dynamically for `Admin`, `HR`, and `Employee` roles.
* **Dynamic Calculations**: The "Process Payroll" dialog interacts directly with employee databases, automatically loading basic salaries and calculating allowances/deductions/bonuses in real-time.
* **Clean Build System**: The frontend has been migrated to JSX/JS, achieving **0 warnings and 0 errors** during production build compilation (`npm run build`).
* **UX Enhancements**: Custom styled Radix UI Tooltips, badge counters, and real-time Bell notifications with unread counts and individual mark-read controls.

---

## 📂 System Directory Structure

```text
HRMS/
├── BackEnd/
│   ├── config/          # DB connection configurations (Sequelize)
│   ├── controllers/     # MVC controller functions handling requests
│   ├── middleware/      # JWT guards and RBAC role validation checks
│   ├── models/          # Sequelize schemas (Employee, Department, Leave, Payroll, etc.)
│   ├── routes/          # Express API route endpoints definitions
│   ├── server.js        # Server entry point
│   └── .env             # Backend secret environment variables
│
└── FrontEnd/
    ├── src/
    │   ├── app/
    │   │   ├── components/ # Shared UI elements (layout, dialogs, badges, tooltips)
    │   │   ├── lib/        # API client configs (Axios intercepts)
    │   │   └── pages/      # Core views (Employees, Payroll, Leaves, Reports, auth)
    │   ├── main.jsx        # App mounting point
    │   └── index.css       # Core design systems and tailwind directives
    ├── vite.config.js      # Vite compilation scripts
    └── package.json
```

---

## 💻 Tech Stack

* **Backend**: Node.js, Express.js, Sequelize ORM
* **Database**: MySQL 8.0+
* **Frontend**: React (JSX), Vite Compiler, Tailwind CSS, Lucide Icons, Shadcn/Radix UI Primitives

---

## 🛠️ Step-by-Step Installation & Setup

Even if you have never set up a full-stack Node/React project before, you can run this application on your local machine by following these instructions.

### 1. Prerequisites
Ensure you have the following software installed on your machine:
* [Node.js](https://nodejs.org/) (version 18 or higher)
* [Git](https://git-scm.com/) (to clone or track files)
* **MySQL Server** (either via [MySQL Installer](https://dev.mysql.com/downloads/installer/), [XAMPP](https://www.apachefriends.org/), or Docker)

---

### 2. Set Up the MySQL Database
Before starting the backend, you must create an empty database schema in MySQL.

1. Open your terminal or MySQL command-line client.
2. Log into your MySQL server:
   ```bash
   mysql -u root -p
   ```
3. Enter your MySQL password when prompted.
4. Run the following command to create the database:
   ```sql
   CREATE DATABASE hrms_db;
   ```
5. You can verify that it was created successfully:
   ```sql
   SHOW DATABASES;
   ```
6. Exit the MySQL shell:
   ```sql
   EXIT;
   ```

---

### 3. Configure the Backend Server

1. Open your terminal and navigate to the `BackEnd` directory:
   ```bash
   cd BackEnd
   ```
2. Install the backend node dependencies:
   ```bash
   npm install
   ```
3. Open the `.env` file in the `BackEnd` directory using any text editor. If it does not exist, create it:
   ```env
   # Server Connection Settings
   PORT=5000
   NODE_ENV=development

   # Database Connection Settings
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=hrms_db
   DB_USER=root
   DB_PASSWORD=your_mysql_password_here

   # Authentication Settings
   JWT_SECRET=hrms_super_secret_jwt_key_2024
   JWT_EXPIRES_IN=7d
   BCRYPT_SALT_ROUNDS=10
   ```
   > [!IMPORTANT]  
   > Replace `your_mysql_password_here` with your actual MySQL password. If your root account has no password, leave it empty: `DB_PASSWORD=`.

4. Start the backend development server:
   ```bash
   npm run dev
   ```
   * The terminal will output `🚀 HRMS Server running on http://localhost:5000`.
   * Under the hood, Sequelize will automatically establish a connection, compile all models, and **automatically create all necessary tables** in your `hrms_db` database.

---

### 4. Configure the Frontend Client

1. Open a new terminal window or tab, and navigate to the `FrontEnd` directory:
   ```bash
   cd FrontEnd
   ```
2. Install the frontend dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   * The terminal will output `➜ Local: http://localhost:5173/`.
4. Open your web browser and go to: **[http://localhost:5173/](http://localhost:5173/)**

---

## 🔑 Application Walkthrough (First Run)

1. **Create an Account**:
   * Navigate to `http://localhost:5173/`.
   * On the landing page, click the **Register** toggle switch to convert the form.
   * Enter a Username, Password, and select your role (e.g. `Admin` or `HR` or `Employee`).
   * Click **Register** to insert the credentials directly into the database.
2. **Log In**:
   * Toggle back to **Login** mode, input your new credentials, and click submit.
   * You will be redirected to the `/dashboard`.
3. **Add Employees & Departments**:
   * If logged in as an `Admin` or `HR`, go to the **Employees** page and click **Add Employee** to create your first worker.
   * Go to the **Departments** page and add a new department (e.g., Engineering).
4. **Interactive Actions**:
   * **Paging**: The employee table features active client-side pagination (5 records per view).
   * **Exports**: Download full CSV summaries from the Employees, Payroll, Leaves, and Reports pages.
   * **Tooltips**: Hover over icons (like Help or Bell) to view custom styled descriptions.

---

## 📡 Core API Endpoints Reference

| Method | Endpoint | Description | Access Level |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/auth/register` | Registers a new user account | Public |
| **POST** | `/api/auth/login` | Validates credentials and returns JWT token | Public |
| **GET** | `/api/employees` | Retrieves list of all employees | Admin, HR |
| **POST** | `/api/employees` | Creates a new employee record | Admin, HR |
| **PUT** | `/api/employees/:id` | Modifies employee information | Admin, HR |
| **DELETE** | `/api/employees/:id` | Deletes an employee record | Admin, HR |
| **GET** | `/api/departments` | Retrieves list of organizational units | Admin, HR |
| **PUT** | `/api/departments/:id` | Edits department name and description | Admin, HR |
| **GET** | `/api/leaves` | Retrieves leave request listings | Admin, HR, Employee |
| **POST** | `/api/leaves/apply` | Submits a new leave request | Admin, HR, Employee |
| **PUT** | `/api/leaves/:id/approve` | Approves a pending request | Admin, HR |
| **POST** | `/api/payroll` | Creates and logs a payslip disbursement | Admin, HR |
| **GET** | `/api/notifications` | Returns user notifications log | Admin, HR, Employee |
| **PUT** | `/api/notifications/read-all`| Marks all user notifications as read | Admin, HR, Employee |

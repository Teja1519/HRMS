# HRMS Enterprise Portal - Human Resource Management System

A full-stack, enterprise-grade **Human Resource Management System (HRMS)** built with React, Vite, Node.js, Express.js, Sequelize ORM, and MySQL.

The application features role-based access control (**Admin**, **HR**, and **Employee**), automated payroll calculation, daily attendance punch tracking, leave application workflows, company announcements, profile management, and comprehensive reporting exports (PDF/CSV).

---

## 🚀 System Features & Modules

### 1. 🔑 Authentication & Security
- **Role-Based Access Control (RBAC)**: Enforces access rules for `Admin`, `HR`, and `Employee`.
- **Secure JWT Tokens**: Access tokens (1-hour expiry) and Refresh tokens with automated token verification.
- **Bcrypt Encryption**: Hashed passwords using `bcryptjs` (salt rounds = 10).
- **Password Security**: Self-service password change modal enforcing uppercase, lowercase, numeric, special character, and minimum length rules.

### 2. 📊 Interactive Dashboard
- **Admin Dashboard**: Total employee count, department distribution, pending leaves, today's attendance metrics, monthly payroll totals, and announcement feeds.
- **HR Dashboard**: Pending leave approvals, today's team attendance, quick employee directory lookup.
- **Employee Dashboard**: Interactive **Check-In / Check-Out** punch card, working hours calculation, upcoming leaves, and quick payslip view.

### 3. 👥 Employee Management
- Complete CRUD operations for employee records.
- Department assignment, employment designation, contact details, status management (`Active`, `Inactive`, `Terminated`).
- Dynamic search filtering by name, code, designation, or department.

### 4. 🏢 Department Management
- Create, view, update, and delete company departments.
- Headcount metrics and department overview cards.

### 5. ⏱️ Attendance Tracking
- **Daily Punch Check-In / Check-Out**: Prevents duplicate check-ins or checking out before checking in.
- **Auto-Calculated Working Hours**: Formatted as hours and minutes (`8 hrs 30 mins`).
- **Monthly Attendance History**: Interactive attendance calendar showing Present, Late, Absent, and Half-Day statuses.

### 6. 🌴 Leave Management
- **Dynamic Leave Types**: Casual Leave, Sick Leave, Paid Leave, Unpaid Leave.
- **Employee Portal**: Apply for leave with start date, end date, and reason. Automatic working days calculation.
- **HR Approval Workflow**: Approve or reject leave applications with optional comments.

### 7. 💰 Payroll System
- **Formula-Driven Calculations**:
  - `Gross Salary` = Basic + HRA + Allowances + Bonus
  - `HRA` = 40% of Basic
  - `PF (Provident Fund)` = 12% of Basic
  - `Tax` = 10% of Basic
  - `Net Salary` = Gross - (PF + Tax + Deductions)
- **Salary Slips**: Detailed earnings and deductions breakdown, printable payslips, and PDF export.

### 8. 👤 Employee Profile Module (`/profile`)
- **Profile Header**: Avatar, name, ID, designation, department, email, phone, status badge.
- **Personal & Contact Info**: DOB, blood group, marital status, nationality, alternate phone, full street address, city, state, country, pin code.
- **Employment Information**: Read-only employee code, department, joining date, reporting manager, employment type.
- **Emergency Contact**: Contact name, relationship, and emergency phone.
- **Bank Information**: Bank name, account holder, IFSC code, branch, and masked account number (`•••• •••• 1234`) with a toggle eye icon for secure viewing.
- **Profile Picture**: Upload, preview, replace, and remove avatar images (JPG/JPEG/PNG, max 5MB).

### 9. 📢 Company Announcements & Notifications
- Broadcast announcements by priority level (`Normal`, `Important`, `Urgent`).
- Real-time unread badge count in top navbar.
- 1-click notification bell header redirection directly to `/announcements`.

### 10. 📈 Reports & Analytics
- Attendance Reports, Leave Summaries, Payroll Reports, and Employee Rosters.
- Export options: **CSV / Excel** and **Printable PDF**.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend UI** | React 18, Vite 6, Tailwind CSS, Lucide React, Shadcn UI Components |
| **State & Router** | Custom Auth Context, React Hooks, Axios API Client, Sonner Toasts |
| **Backend Engine** | Node.js, Express.js REST API |
| **Database ORM** | Sequelize 6, Umzug Migrations |
| **Database Engine** | MySQL 8.0 / MariaDB |
| **File Storage** | Multer (5MB image upload validation, disk storage) |
| **Security & Auth** | JsonWebToken (JWT), BcryptJS |

---

## 📁 Project Directory Structure

```
HRMS/
├── BackEnd/
│   ├── config/             # Database connection & automated schema synchronizer
│   ├── controllers/        # Express route controllers
│   ├── dtos/               # Data Transfer Objects (EmployeeDTO, NotificationDTO)
│   ├── middleware/         # Auth, RBAC, error, and upload middlewares
│   ├── models/             # Sequelize ORM models (User, Employee, Attendance, etc.)
│   ├── routes/             # REST API endpoint definitions
│   ├── services/           # Core business logic layer
│   ├── utils/              # JWT helpers, response formatters, password utilities
│   ├── uploads/            # Static storage for avatar images
│   ├── .env                # Backend environment configuration
│   ├── package.json        # Node.js dependencies
│   └── server.js           # Server startup script
│
└── FrontEnd/
    ├── src/
    │   ├── app/
    │   │   ├── components/  # Reusable UI cards, Navbar, Sidebar, Modals
    │   │   ├── pages/       # Dashboard, Attendance, Leave, Payroll, Reports, Settings
    │   │   ├── lib/         # Axios API instance
    │   │   └── App.jsx      # Main application router
    │   ├── features/
    │   │   └── profile/     # Modular Profile feature (components, hooks, pages, services)
    │   └── context/         # AuthContext provider
    ├── package.json         # Frontend dependencies
    └── vite.config.js       # Vite configuration
```

---

## ⚙️ Installation & Setup Guide

### 📋 Prerequisites
Make sure you have the following installed on your system:
- **Node.js** (v18.0.0 or higher) — [Download Node.js](https://nodejs.org/)
- **npm** (v9.0.0 or higher)
- **MySQL Server** (v8.0 or higher) — [Download MySQL](https://dev.mysql.com/downloads/installer/)

---

### Step 1: Clone or Download the Repository

```bash
git clone https://github.com/YourUsername/HRMS.
cd HRMS
```

---

### Step 2: Database Setup (MySQL)

1. Open MySQL Workbench, MySQL CLI, or phpMyAdmin.
2. Create a new database named `hrms_db`:
   ```sql
   CREATE DATABASE hrms_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

---

### Step 3: Backend Configuration & Setup

1. Navigate to the `BackEnd` directory:
   ```bash
   cd BackEnd
   ```

2. Install backend dependencies:
   ```bash
   npm install
   ```

3. Create or update the `.env` file in `BackEnd/.env`:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # MySQL Database Configuration
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=hrms_db
   DB_USER=root
   DB_PASSWORD=your_mysql_password

   # JWT Tokens
   JWT_SECRET=hrms_super_secret_jwt_key_2026
   JWT_REFRESH_SECRET=hrms_super_secret_jwt_refresh_key_2026
   JWT_EXPIRES_IN=1h
   JWT_REFRESH_EXPIRES_IN=7d

   # Security
   BCRYPT_SALT_ROUNDS=10
   ```

4. Seed initial database tables and initial demo accounts:
   ```bash
   node -e "require('./config/database').connectDB().then(() => process.exit(0))"
   ```

5. Start the backend server:
   ```bash
   npm start
   ```
   *The backend server will run on `http://localhost:5000`.*

---

### Step 4: Frontend Setup

1. Open a new terminal window and navigate to the `FrontEnd` directory:
   ```bash
   cd FrontEnd
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The frontend application will run on `http://localhost:5173`.*

---

## 🔐 Pre-configured Test Accounts

You can log in to the application using any of the seeded credentials:

| Username | Password | Role | Employee Name | Department | Designation |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `admin` | **`password123`** | **Admin** | System Admin | Human Resources | System Administrator |
| `hr_manager` | **`password123`** | **HR** | Sarah Jenkins | Human Resources | HR Director |
| `hr_specialist` | **`password123`** | **HR** | Priya Sharma | Human Resources | HR Operations Lead |
| `john_dev` | **`password123`** | **Employee** | John Doe | Engineering | Senior Software Engineer |
| `alex_qa` | **`password123`** | **Employee** | Alex Rivera | Engineering | QA Lead Engineer |
| `emily_fin` | **`password123`** | **Employee** | Emily Watson | Finance & Accounts | Senior Financial Analyst |
| `michael_mkt` | **`password123`** | **Employee** | Michael Scott | Marketing & Growth | Regional Marketing Manager |

---

## 📡 REST API Endpoint Reference

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Log in user and receive JWT access token | Public |
| `GET` | `/api/auth/me` | Fetch authenticated user context | Private |
| `POST` | `/api/auth/logout` | Revoke user session | Private |
| `GET` | `/api/employees` | List all employees (search/filter/pagination) | Admin / HR |
| `POST` | `/api/employees` | Create new employee profile | Admin / HR |
| `GET` | `/api/attendance/today` | Fetch today's punch status | Authenticated |
| `POST` | `/api/attendance/check-in` | Punch daily check-in | Employee |
| `POST` | `/api/attendance/check-out` | Punch daily check-out | Employee |
| `GET` | `/api/leaves` | List leave requests | Authenticated |
| `POST` | `/api/leaves` | Submit new leave application | Employee |
| `PUT` | `/api/leaves/:id/approve` | Approve leave application | Admin / HR |
| `PUT` | `/api/leaves/:id/reject` | Reject leave application | Admin / HR |
| `GET` | `/api/payroll` | List monthly payroll records | Authenticated |
| `POST` | `/api/payroll/generate` | Generate monthly payroll batch | Admin / HR |
| `GET` | `/api/profile` | Fetch logged-in user profile | Authenticated |
| `PUT` | `/api/profile` | Update personal, contact, emergency & bank details | Authenticated |
| `POST` | `/api/profile/upload-photo` | Upload/replace profile avatar photo | Authenticated |
| `DELETE` | `/api/profile/photo` | Remove profile avatar photo | Authenticated |
| `PUT` | `/api/profile/change-password` | Update account password securely | Authenticated |
| `GET` | `/api/notifications` | Fetch announcements and notifications | Authenticated |
| `POST` | `/api/notifications` | Publish new company announcement | Admin / HR |

---

## 📄 License & Attribution
Distributed under the MIT License. Developed for enterprise HR management and demonstration.

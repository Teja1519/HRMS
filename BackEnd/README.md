# HRMS Backend API

> Human Resource Management System — Node.js + Express.js + MySQL + Sequelize ORM

---

## Tech Stack

| Layer          | Technology                     |
|----------------|--------------------------------|
| Runtime        | Node.js                        |
| Framework      | Express.js                     |
| Database       | MySQL                          |
| ORM            | Sequelize                      |
| Authentication | JWT (jsonwebtoken)             |
| Passwords      | bcryptjs                       |
| Validation     | express-validator              |
| Environment    | dotenv                         |
| CORS           | cors                           |

---

## Folder Structure

```
backend/
├── config/
│   ├── database.js          # Sequelize connection
│   └── schema.sql           # Raw SQL schema + seed data
├── models/
│   ├── index.js             # All associations
│   ├── User.js
│   ├── Employee.js
│   ├── Department.js
│   ├── Attendance.js
│   ├── LeaveType.js
│   ├── LeaveRequest.js
│   ├── Payroll.js
│   ├── Report.js
│   ├── Notification.js
│   └── Setting.js
├── controllers/             # Handle req/res
├── services/                # Business logic
├── routes/                  # Express routers
├── middleware/
│   ├── authMiddleware.js    # JWT verification
│   ├── roleMiddleware.js    # Role-based access
│   └── errorMiddleware.js   # Global error handler
├── validations/             # express-validator rules
├── utils/
│   ├── jwtHelper.js
│   └── responseHelper.js
├── app.js                   # Express app setup
├── server.js                # Entry point
└── .env                     # Environment variables
```

---

## Step-by-Step Setup

### 1. Install MySQL and create the database

```sql
-- In MySQL CLI or Workbench:
CREATE DATABASE hrms_db;
```

Then run the full schema:
```bash
mysql -u root -p hrms_db < config/schema.sql
```

### 2. Configure environment variables

Edit `.env` with your actual MySQL credentials:

```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=3306
DB_NAME=hrms_db
DB_USER=root
DB_PASSWORD=yourpassword

JWT_SECRET=hrms_super_secret_jwt_key_2024
JWT_EXPIRES_IN=7d

BCRYPT_SALT_ROUNDS=10
```

### 3. Install dependencies

```bash
cd backend
npm install
```

### 4. Start the server

```bash
# Development (auto-restart on file changes)
npm run dev

# Production
npm start
```

You should see:
```
✅ MySQL connected via Sequelize
✅ Database synced
🚀 HRMS Server running on http://localhost:5000
```

### 5. Test with Postman

Import `HRMS_API.postman_collection.json` into Postman.

**Quick start flow:**
1. **Register** → `POST /api/auth/register` (create Admin user)
2. **Login** → `POST /api/auth/login` (token is auto-saved to collection variable)
3. Use any protected route — the token is sent automatically via `Bearer {{token}}`

---

## API Reference

### Auth
| Method | Endpoint              | Access | Description          |
|--------|-----------------------|--------|----------------------|
| POST   | /api/auth/register    | Public | Register a new user  |
| POST   | /api/auth/login       | Public | Login and get token  |
| GET    | /api/auth/me          | All    | Get current user     |

### Employees
| Method | Endpoint              | Access      | Description           |
|--------|-----------------------|-------------|-----------------------|
| GET    | /api/employees        | Admin, HR   | List all employees    |
| GET    | /api/employees/:id    | All         | Get employee by ID    |
| POST   | /api/employees        | Admin, HR   | Create employee       |
| PUT    | /api/employees/:id    | Admin, HR   | Update employee       |
| DELETE | /api/employees/:id    | Admin       | Delete employee       |

### Departments
| Method | Endpoint                | Access      | Description          |
|--------|-------------------------|-------------|----------------------|
| GET    | /api/departments        | All         | List all departments |
| GET    | /api/departments/:id    | All         | Get department       |
| POST   | /api/departments        | Admin, HR   | Create department    |
| PUT    | /api/departments/:id    | Admin, HR   | Update department    |
| DELETE | /api/departments/:id    | Admin       | Delete department    |

### Attendance
| Method | Endpoint                       | Access      | Description              |
|--------|--------------------------------|-------------|--------------------------|
| POST   | /api/attendance/checkin        | All         | Mark check-in            |
| POST   | /api/attendance/checkout       | All         | Mark check-out           |
| GET    | /api/attendance                | Admin, HR   | All attendance records   |
| GET    | /api/attendance/:employeeId    | All         | Employee attendance      |

### Leaves
| Method | Endpoint                     | Access      | Description          |
|--------|------------------------------|-------------|----------------------|
| GET    | /api/leaves/types            | All         | Get leave types      |
| POST   | /api/leaves/types            | Admin, HR   | Create leave type    |
| POST   | /api/leaves/apply            | All         | Apply for leave      |
| GET    | /api/leaves                  | Admin, HR   | All leave requests   |
| GET    | /api/leaves/employee/:id     | All         | Employee's leaves    |
| PUT    | /api/leaves/:id/approve      | Admin, HR   | Approve leave        |
| PUT    | /api/leaves/:id/reject       | Admin, HR   | Reject leave         |

### Payroll
| Method | Endpoint                        | Access      | Description            |
|--------|---------------------------------|-------------|------------------------|
| GET    | /api/payroll                    | Admin, HR   | All payroll records    |
| GET    | /api/payroll/employee/:id       | All         | Employee payroll       |
| POST   | /api/payroll                    | Admin, HR   | Create payroll         |
| PUT    | /api/payroll/:id                | Admin, HR   | Update payroll         |
| DELETE | /api/payroll/:id                | Admin       | Delete payroll         |

### Notifications
| Method | Endpoint                          | Access      | Description              |
|--------|-----------------------------------|-------------|--------------------------|
| GET    | /api/notifications                | All         | Get my notifications     |
| GET    | /api/notifications/unread         | All         | Get unread notifications |
| POST   | /api/notifications                | Admin, HR   | Create notification      |
| PUT    | /api/notifications/:id/read       | All         | Mark one as read         |
| PUT    | /api/notifications/read-all       | All         | Mark all as read         |

### Dashboard
| Method | Endpoint                            | Access      | Description              |
|--------|-------------------------------------|-------------|--------------------------|
| GET    | /api/dashboard/admin                | Admin       | Admin stats              |
| GET    | /api/dashboard/hr                   | Admin, HR   | HR stats                 |
| GET    | /api/dashboard/employee/:id         | All         | Employee stats           |

---

## API Response Format

All endpoints return a consistent JSON structure:

**Success:**
```json
{
  "success": true,
  "message": "Employee created successfully",
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "message": "Email already in use"
}
```

**Validation Error:**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "field": "Email", "message": "Invalid email address" }
  ]
}
```

---

## Role Permissions Summary

| Feature              | Admin | HR  | Employee |
|----------------------|-------|-----|----------|
| Manage employees     | ✅    | ✅  | ❌        |
| Delete employees     | ✅    | ❌  | ❌        |
| Manage departments   | ✅    | ✅  | View only |
| Attendance (all)     | ✅    | ✅  | Own only |
| Approve/Reject leave | ✅    | ✅  | ❌        |
| Manage payroll       | ✅    | ✅  | View own |
| Send notifications   | ✅    | ✅  | ❌        |
| Admin dashboard      | ✅    | ❌  | ❌        |
| HR dashboard         | ✅    | ✅  | ❌        |
| Employee dashboard   | ✅    | ✅  | Own only |

---

## Notes for Viva / Interview

- **Why Sequelize over raw SQL?** ORM provides abstraction, type safety, and easy relationship management. Raw SQL queries still run underneath.
- **Why JWT?** Stateless authentication — no sessions needed. Token carries role info so we can authorize without a DB hit.
- **Why bcrypt?** One-way hashing with salt — even if the DB is leaked, passwords can't be reversed.
- **Service layer pattern** — Controllers stay thin (only req/res handling). Business logic lives in Services, making it testable and reusable.
- **NetSalary calculation** is done via Sequelize `beforeCreate`/`beforeUpdate` hooks — so it's always accurate regardless of which layer calls the save.
- **Duplicate attendance** is prevented at the service level (same EmployeeId + AttendanceDate check) and reinforced by the DB UNIQUE constraint.

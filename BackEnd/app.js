const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

// Load all models (ensures associations are registered)
require("./models");

const app = express();

// ─── Core Middleware ──────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded avatar images statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth",          require("./routes/authRoutes"));
app.use("/api/employees",     require("./routes/employeeRoutes"));
app.use("/api/departments",   require("./routes/departmentRoutes"));
app.use("/api/attendance",    require("./routes/attendanceRoutes"));
app.use("/api/leaves",        require("./routes/leaveRoutes"));
app.use("/api/payroll",       require("./routes/payrollRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));
app.use("/api/dashboard",     require("./routes/dashboardRoutes"));
app.use("/api/settings",      require("./routes/settingRoutes"));
app.use("/api/reports",       require("./routes/reportRoutes"));
app.use("/api/profile",       require("./routes/profileRoutes"));

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "HRMS API is running", timestamp: new Date() });
});

// ─── Error Middleware ─────────────────────────────────────────────────────────
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
app.use(notFound);
app.use(errorHandler);

module.exports = app;

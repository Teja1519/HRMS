const { Employee, Department, Attendance, Payroll, LeaveRequest } = require("../models");

const getSummaryReport = async () => {
  const [employeesCount, departmentsCount, attendanceRecords, payrollRecords, leaveRequests] = await Promise.all([
    Employee.count(),
    Department.count(),
    Attendance.findAll({ attributes: ["AttendanceDate", "Status"] }),
    Payroll.findAll({ attributes: ["PayrollMonth", "NetSalary"] }),
    LeaveRequest.findAll({ attributes: ["Status", "AppliedDate"] }),
  ]);

  const totalPayrollYtd = payrollRecords.reduce((sum, p) => sum + Number(p.NetSalary || 0), 0);
  const approvedLeavesCount = leaveRequests.filter((l) => l.Status === "Approved").length;
  const pendingLeavesCount = leaveRequests.filter((l) => l.Status === "Pending").length;
  const presentCount = attendanceRecords.filter((a) => a.Status === "Present").length;

  return {
    totalEmployees: employeesCount,
    totalDepartments: departmentsCount,
    totalPayrollYtd,
    approvedLeavesCount,
    pendingLeavesCount,
    presentCount,
  };
};

module.exports = { getSummaryReport };

const bcrypt = require("bcryptjs");
const { User, Employee, Department, LeaveType, LeaveRequest, Payroll, Notification, Setting } = require("../models");

const seedDemoData = async () => {
  try {
    console.log("🌱 Seeding comprehensive demo departments, HRs, and employees...");

    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10;
    const defaultPasswordHash = await bcrypt.hash("password123", saltRounds);

    // 1. Seed Departments
    const deptData = [
      { DepartmentName: "Engineering", Description: "Software development, DevOps, and IT Infrastructure" },
      { DepartmentName: "Human Resources", Description: "Talent acquisition, HR operations, and employee wellness" },
      { DepartmentName: "Finance & Accounts", Description: "Payroll processing, tax compliance, and auditing" },
      { DepartmentName: "Marketing & Growth", Description: "Brand management, digital marketing, and sales" },
      { DepartmentName: "Operations", Description: "Business operations, logistics, and quality assurance" },
    ];

    const departments = [];
    for (const d of deptData) {
      const [dept] = await Department.findOrCreate({
        where: { DepartmentName: d.DepartmentName },
        defaults: d,
      });
      departments.push(dept);
    }

    const engDept = departments.find((d) => d.DepartmentName === "Engineering");
    const hrDept = departments.find((d) => d.DepartmentName === "Human Resources");
    const finDept = departments.find((d) => d.DepartmentName === "Finance & Accounts");
    const mktDept = departments.find((d) => d.DepartmentName === "Marketing & Growth");

    // 2. Seed Users & Employee Profiles
    const usersToSeed = [
      {
        Username: "admin",
        Password: defaultPasswordHash,
        Role: "Admin",
        EmployeeCode: "EMP-ADMIN01",
        FirstName: "System",
        LastName: "Admin",
        Email: "admin@hrms.local",
        Designation: "System Administrator",
        Salary: 120000.00,
        DepartmentId: hrDept?.DepartmentId,
      },
      {
        Username: "hr_manager",
        Password: defaultPasswordHash,
        Role: "HR",
        EmployeeCode: "EMP-HR01",
        FirstName: "Sarah",
        LastName: "Jenkins",
        Email: "sarah.jenkins@hrms.local",
        Designation: "HR Director",
        Salary: 95000.00,
        DepartmentId: hrDept?.DepartmentId,
      },
      {
        Username: "hr_specialist",
        Password: defaultPasswordHash,
        Role: "HR",
        EmployeeCode: "EMP-HR02",
        FirstName: "Priya",
        LastName: "Sharma",
        Email: "priya.sharma@hrms.local",
        Designation: "HR Operations Lead",
        Salary: 75000.00,
        DepartmentId: hrDept?.DepartmentId,
      },
      {
        Username: "john_dev",
        Password: defaultPasswordHash,
        Role: "Employee",
        EmployeeCode: "EMP-ENG01",
        FirstName: "John",
        LastName: "Doe",
        Email: "john.doe@hrms.local",
        Designation: "Senior Software Engineer",
        Salary: 90000.00,
        DepartmentId: engDept?.DepartmentId,
      },
      {
        Username: "alex_qa",
        Password: defaultPasswordHash,
        Role: "Employee",
        EmployeeCode: "EMP-ENG02",
        FirstName: "Alex",
        LastName: "Rivera",
        Email: "alex.rivera@hrms.local",
        Designation: "QA Lead Engineer",
        Salary: 72000.00,
        DepartmentId: engDept?.DepartmentId,
      },
      {
        Username: "emily_fin",
        Password: defaultPasswordHash,
        Role: "Employee",
        EmployeeCode: "EMP-FIN01",
        FirstName: "Emily",
        LastName: "Watson",
        Email: "emily.watson@hrms.local",
        Designation: "Senior Financial Analyst",
        Salary: 82000.00,
        DepartmentId: finDept?.DepartmentId,
      },
      {
        Username: "michael_mkt",
        Password: defaultPasswordHash,
        Role: "Employee",
        EmployeeCode: "EMP-MKT01",
        FirstName: "Michael",
        LastName: "Scott",
        Email: "michael.scott@hrms.local",
        Designation: "Regional Marketing Manager",
        Salary: 85000.00,
        DepartmentId: mktDept?.DepartmentId,
      },
    ];

    const seededEmployees = [];

    for (const u of usersToSeed) {
      let [user] = await User.findOrCreate({
        where: { Username: u.Username },
        defaults: {
          Username: u.Username,
          Password: u.Password,
          Role: u.Role,
        },
      });

      await user.update({ Password: defaultPasswordHash, Role: u.Role });

      let [employee] = await Employee.findOrCreate({
        where: { EmployeeCode: u.EmployeeCode },
        defaults: {
          EmployeeCode: u.EmployeeCode,
          FirstName: u.FirstName,
          LastName: u.LastName,
          Email: u.Email,
          Phone: "555-019-2834",
          Gender: "Male",
          Designation: u.Designation,
          Salary: u.Salary,
          DepartmentId: u.DepartmentId,
          UserId: user.UserId,
          Status: "Active",
          HireDate: "2024-01-15",
        },
      });

      if (!employee.UserId) {
        await employee.update({ UserId: user.UserId });
      }

      seededEmployees.push(employee);
    }

    console.log(`✅ Seeded ${usersToSeed.length} users and employee profiles`);

    // 3. Seed Sample Leave Requests
    const casualType = await LeaveType.findOne({ where: { LeaveTypeName: "Casual Leave" } });
    const sickType = await LeaveType.findOne({ where: { LeaveTypeName: "Sick Leave" } });

    const johnEmp = seededEmployees.find((e) => e.FirstName === "John");
    const alexEmp = seededEmployees.find((e) => e.FirstName === "Alex");

    if (johnEmp && casualType) {
      await LeaveRequest.findOrCreate({
        where: { EmployeeId: johnEmp.EmployeeId, StartDate: "2026-08-01" },
        defaults: {
          EmployeeId: johnEmp.EmployeeId,
          LeaveTypeId: casualType.LeaveTypeId,
          StartDate: "2026-08-01",
          EndDate: "2026-08-02",
          Reason: "Attending family wedding event",
          Status: "Approved",
          AppliedDate: new Date().toISOString().slice(0, 10),
        },
      });
    }

    if (alexEmp && sickType) {
      await LeaveRequest.findOrCreate({
        where: { EmployeeId: alexEmp.EmployeeId, StartDate: "2026-08-05" },
        defaults: {
          EmployeeId: alexEmp.EmployeeId,
          LeaveTypeId: sickType.LeaveTypeId,
          StartDate: "2026-08-05",
          EndDate: "2026-08-05",
          Reason: "Medical checkup and dental appointment",
          Status: "Pending",
          AppliedDate: new Date().toISOString().slice(0, 10),
        },
      });
    }

    // 4. Seed Announcements
    await Notification.findOrCreate({
      where: { Title: "Q3 All-Hands Corporate Townhall" },
      defaults: {
        Title: "Q3 All-Hands Corporate Townhall",
        Message: "Join our executive leadership team this Friday at 3:00 PM EST for quarterly growth metrics and team recognition awards.",
        Priority: "Important",
        Audience: "All",
        IsRead: false,
      },
    });

    await Notification.findOrCreate({
      where: { Title: "Updated Comprehensive Health Benefits 2026" },
      defaults: {
        Title: "Updated Comprehensive Health Benefits 2026",
        Message: "Enhanced dental and outpatient medical coverage details are now active in the employee insurance portal.",
        Priority: "Normal",
        Audience: "All",
        IsRead: false,
      },
    });

    // 5. Seed Sample Monthly Payroll Entries
    const currentMonth = new Date().toISOString().slice(0, 7);
    for (const emp of seededEmployees) {
      const basic = Number(emp.Salary || 50000);
      const hra = Math.round(basic * 0.4 * 100) / 100;
      const allowances = 5000.0;
      const bonus = 2000.0;
      const pf = Math.round(basic * 0.12 * 100) / 100;
      const tax = Math.round(basic * 0.1 * 100) / 100;

      await Payroll.findOrCreate({
        where: { EmployeeId: emp.EmployeeId, PayrollMonth: currentMonth },
        defaults: {
          EmployeeId: emp.EmployeeId,
          PayrollMonth: currentMonth,
          BasicSalary: basic,
          HRA: hra,
          Allowances: allowances,
          Bonus: bonus,
          PF: pf,
          Tax: tax,
          Deductions: 0.0,
        },
      });
    }

    console.log("🎉 Complete demo data seeded successfully!");
  } catch (error) {
    console.error("⚠️ Error seeding demo data:", error.message);
  }
};

module.exports = { seedDemoData };

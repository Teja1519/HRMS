import { useEffect, useMemo, useState } from "react";
import { BarChart3, Download, Printer, Search, Users, Calendar, IndianRupee, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import api from "../lib/api";
import { toast } from "sonner";

const formatCurrency = (value) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value || 0);
};

export function Reports() {
  const [activeTab, setActiveTab] = useState("attendance");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [summary, setSummary] = useState(null);

  const [attendanceReport, setAttendanceReport] = useState([]);
  const [leaveReport, setLeaveReport] = useState([]);
  const [payrollReport, setPayrollReport] = useState([]);
  const [employeeReport, setEmployeeReport] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadAllReports = async () => {
    try {
      setLoading(true);
      const [sumRes, attRes, leaveRes, payRes, empRes] = await Promise.all([
        api.get("/reports/summary").catch(() => ({ data: { data: null } })),
        api.get("/reports/attendance").catch(() => ({ data: { data: [] } })),
        api.get("/reports/leaves").catch(() => ({ data: { data: [] } })),
        api.get("/reports/payroll").catch(() => ({ data: { data: [] } })),
        api.get("/reports/employees").catch(() => ({ data: { data: [] } })),
      ]);

      setSummary(sumRes.data?.data || null);
      setAttendanceReport(attRes.data?.data || []);
      setLeaveReport(leaveRes.data?.data || []);
      setPayrollReport(payRes.data?.data || []);
      setEmployeeReport(empRes.data?.data || []);
    } catch (error) {
      console.error("Failed to load reports", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadAllReports();
  }, []);

  // Filtered Datasets based on Search & Status
  const filteredAttendance = useMemo(() => {
    return attendanceReport.filter((r) => {
      const matchesSearch =
        (r.EmployeeName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (r.DepartmentName || "").toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || (r.Status || "").toLowerCase() === statusFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    });
  }, [attendanceReport, searchQuery, statusFilter]);

  const filteredLeaves = useMemo(() => {
    return leaveReport.filter((r) => {
      const matchesSearch =
        (r.EmployeeName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (r.LeaveTypeName || "").toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || (r.Status || "").toLowerCase() === statusFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    });
  }, [leaveReport, searchQuery, statusFilter]);

  const filteredPayroll = useMemo(() => {
    return payrollReport.filter((r) => {
      return (
        (r.EmployeeName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (r.DepartmentName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (r.PayrollMonth || "").toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [payrollReport, searchQuery]);

  const filteredEmployees = useMemo(() => {
    return employeeReport.filter((r) => {
      const matchesSearch =
        (r.FullName || `${r.FirstName} ${r.LastName}`).toLowerCase().includes(searchQuery.toLowerCase()) ||
        (r.DepartmentName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (r.EmployeeCode || "").toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || (r.Status || "").toLowerCase() === statusFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    });
  }, [employeeReport, searchQuery, statusFilter]);

  // CSV Export Handler
  const handleExportCSV = () => {
    try {
      let csvHeaders = [];
      let csvRows = [];
      let filename = "report.csv";

      if (activeTab === "attendance") {
        filename = "attendance_report.csv";
        csvHeaders = ["Attendance ID,Employee Name,Department,Date,Check In,Check Out,Status,Work Hours"];
        csvRows = filteredAttendance.map((r) =>
          `"${r.AttendanceId}","${r.EmployeeName}","${r.DepartmentName}","${r.AttendanceDate}","${r.CheckIn}","${r.CheckOut}","${r.Status}","${r.WorkingHours}"`
        );
      } else if (activeTab === "leave") {
        filename = "leave_report.csv";
        csvHeaders = ["Leave ID,Employee Name,Leave Type,Start Date,End Date,Days,Status,Reason"];
        csvRows = filteredLeaves.map((r) =>
          `"${r.LeaveId}","${r.EmployeeName}","${r.LeaveTypeName}","${r.StartDate}","${r.EndDate}","${r.Days}","${r.Status}","${r.Reason}"`
        );
      } else if (activeTab === "payroll") {
        filename = "payroll_report.csv";
        csvHeaders = ["Payroll ID,Employee Name,Department,Month,Basic,HRA,Allowances,Bonus,Gross,PF,Tax,Deductions,Net Salary"];
        csvRows = filteredPayroll.map((r) =>
          `"${r.PayrollId}","${r.EmployeeName}","${r.DepartmentName}","${r.PayrollMonth}","${r.BasicSalary}","${r.HRA}","${r.Allowances}","${r.Bonus}","${r.GrossSalary}","${r.PF}","${r.Tax}","${r.Deductions}","${r.NetSalary}"`
        );
      } else if (activeTab === "employee") {
        filename = "employee_directory_report.csv";
        csvHeaders = ["Employee Code,Name,Email,Phone,Department,Designation,Salary,Status"];
        csvRows = filteredEmployees.map((r) =>
          `"${r.EmployeeCode}","${r.FullName}","${r.Email}","${r.Phone}","${r.DepartmentName}","${r.Designation}","${r.Salary}","${r.Status}"`
        );
      }

      const csvContent = "data:text/csv;charset=utf-8," + [csvHeaders, ...csvRows].join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("CSV Report exported successfully!");
    } catch (error) {
      toast.error("Failed to export report CSV");
    }
  };

  // PDF Print Export Handler
  const handleExportPDF = () => {
    window.print();
  };

  return (
    <div className="p-6 space-y-6">
      {/* Page Title & Main Export Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-foreground">HR Reports & Analytics</h1>
          <p className="text-muted-foreground mt-1">Operational reporting, data exports, and metric visualizations</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleExportPDF} title="Printable PDF Report">
            <Printer className="w-4 h-4 mr-2" /> Export PDF / Print
          </Button>
          <Button onClick={handleExportCSV} title="Export active tab data as CSV/Excel">
            <Download className="w-4 h-4 mr-2" /> Export CSV / Excel
          </Button>
        </div>
      </div>

      {/* High-Level Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 print:hidden">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">Total Workforce</p>
                <h3 className="text-3xl font-bold mt-2 text-primary">{summary?.employees?.total || 0}</h3>
                <p className="text-xs text-success mt-1">{summary?.employees?.active || 0} Active</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">Payroll Disbursed</p>
                <h3 className="text-2xl font-bold mt-2 text-success">{formatCurrency(summary?.payroll?.totalDisbursed)}</h3>
                <p className="text-xs text-muted-foreground mt-1">{summary?.payroll?.count || 0} Statements</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
                <IndianRupee className="w-6 h-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">Approved Leaves</p>
                <h3 className="text-3xl font-bold mt-2 text-warning">{summary?.leaves?.approved || 0}</h3>
                <p className="text-xs text-muted-foreground mt-1">{summary?.leaves?.pending || 0} Pending Approval</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">Presence Logged</p>
                <h3 className="text-3xl font-bold mt-2">{summary?.attendance?.present || 0}</h3>
                <p className="text-xs text-warning mt-1">{summary?.attendance?.late || 0} Late Arrivals</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-blue-700" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Global Filter Bar */}
      <Card className="print:hidden">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search report by name, code, or department..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-10"
              />
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px] h-10">
                  <SelectValue placeholder="Status filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active / Present / Approved</SelectItem>
                  <SelectItem value="pending">Pending / Late</SelectItem>
                  <SelectItem value="inactive">Inactive / Rejected / Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Tabbed Reports Section */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="print:hidden">
          <TabsTrigger value="attendance">Attendance Reports</TabsTrigger>
          <TabsTrigger value="leave">Leave Reports</TabsTrigger>
          <TabsTrigger value="payroll">Payroll Reports</TabsTrigger>
          <TabsTrigger value="employee">Employee Directory Report</TabsTrigger>
        </TabsList>

        {/* ─── 1. ATTENDANCE REPORT ─── */}
        <TabsContent value="attendance" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Log Report</CardTitle>
              <CardDescription>Daily employee punch card history</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee Name</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Check In</TableHead>
                    <TableHead>Check Out</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Work Hours</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAttendance.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No attendance records match your search filter.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredAttendance.map((r) => (
                      <TableRow key={r.AttendanceId}>
                        <TableCell className="font-medium text-sm">{r.EmployeeName}</TableCell>
                        <TableCell><Badge variant="outline" className="text-xs">{r.DepartmentName}</Badge></TableCell>
                        <TableCell className="text-xs font-mono">{r.AttendanceDate}</TableCell>
                        <TableCell className="text-xs font-mono">{r.CheckIn}</TableCell>
                        <TableCell className="text-xs font-mono">{r.CheckOut}</TableCell>
                        <TableCell>
                          <Badge className={r.Status === "Present" ? "bg-success/10 text-success border-success/20" : "bg-warning/10 text-warning border-warning/20"}>
                            {r.Status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-semibold text-xs text-primary">{r.WorkingHours} hrs</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── 2. LEAVE REPORT ─── */}
        <TabsContent value="leave" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Leave Application Report</CardTitle>
              <CardDescription>Detailed leave applications and review history</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee Name</TableHead>
                    <TableHead>Leave Type</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLeaves.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No leave records match your search filter.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredLeaves.map((r) => (
                      <TableRow key={r.LeaveId}>
                        <TableCell className="font-medium text-sm">{r.EmployeeName}</TableCell>
                        <TableCell><Badge variant="outline" className="text-xs">{r.LeaveTypeName}</Badge></TableCell>
                        <TableCell className="text-xs font-mono">{r.StartDate}</TableCell>
                        <TableCell className="text-xs font-mono">{r.EndDate}</TableCell>
                        <TableCell><Badge variant="secondary" className="text-xs">{r.Days} days</Badge></TableCell>
                        <TableCell className="max-w-xs truncate text-xs">{r.Reason}</TableCell>
                        <TableCell className="text-right">
                          <Badge className={r.Status === "Approved" ? "bg-success/10 text-success border-success/20" : "bg-warning/10 text-warning border-warning/20"}>
                            {r.Status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── 3. PAYROLL REPORT ─── */}
        <TabsContent value="payroll" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Payroll Disbursement Report</CardTitle>
              <CardDescription>Detailed salary components breakdown and gross/net amounts</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee Name</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Month</TableHead>
                    <TableHead className="text-right">Basic</TableHead>
                    <TableHead className="text-right">HRA & Allowances</TableHead>
                    <TableHead className="text-right">Gross Pay</TableHead>
                    <TableHead className="text-right">Total Deductions</TableHead>
                    <TableHead className="text-right">Net Payable</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayroll.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        No payroll statements match your search filter.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPayroll.map((r) => (
                      <TableRow key={r.PayrollId}>
                        <TableCell className="font-medium text-sm">{r.EmployeeName}</TableCell>
                        <TableCell><Badge variant="outline" className="text-xs">{r.DepartmentName}</Badge></TableCell>
                        <TableCell className="text-xs font-mono">{r.PayrollMonth}</TableCell>
                        <TableCell className="text-right text-xs">{formatCurrency(r.BasicSalary)}</TableCell>
                        <TableCell className="text-right text-xs text-success">+{formatCurrency(r.HRA + r.Allowances + r.Bonus)}</TableCell>
                        <TableCell className="text-right text-xs font-semibold text-success">{formatCurrency(r.GrossSalary)}</TableCell>
                        <TableCell className="text-right text-xs text-destructive">-{formatCurrency(r.TotalDeductions)}</TableCell>
                        <TableCell className="text-right text-sm font-bold text-primary">{formatCurrency(r.NetSalary)}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── 4. EMPLOYEE DIRECTORY REPORT ─── */}
        <TabsContent value="employee" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Employee Master Directory Report</CardTitle>
              <CardDescription>Full employee records and contact directory</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Full Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Designation</TableHead>
                    <TableHead className="text-right">Base Salary</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmployees.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        No employees match your search filter.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredEmployees.map((r) => (
                      <TableRow key={r.EmployeeId}>
                        <TableCell className="text-xs font-mono">{r.EmployeeCode}</TableCell>
                        <TableCell className="font-medium text-sm">{r.FullName}</TableCell>
                        <TableCell className="text-xs">{r.Email}</TableCell>
                        <TableCell className="text-xs">{r.Phone || "-"}</TableCell>
                        <TableCell><Badge variant="outline" className="text-xs">{r.DepartmentName}</Badge></TableCell>
                        <TableCell className="text-xs">{r.Designation || "-"}</TableCell>
                        <TableCell className="text-right text-xs font-semibold">{formatCurrency(r.Salary)}</TableCell>
                        <TableCell><Badge className={r.Status === "Active" ? "bg-success/10 text-success border-success/20" : "bg-destructive/10 text-destructive border-destructive/20"}>{r.Status}</Badge></TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

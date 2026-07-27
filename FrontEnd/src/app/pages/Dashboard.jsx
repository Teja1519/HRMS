import { useEffect, useState } from "react";
import { Users, UserCheck, Building2, Calendar, Clock, Megaphone, CheckCircle, ArrowRight, IndianRupee, FileText, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { PunchCard } from "../components/PunchCard";
import { useAuth } from "../../context/AuthContext";
import api from "../lib/api";
import { toast } from "sonner";

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount || 0);
};

export function Dashboard({ onNavigate }) {
  const { user, role } = useAuth();
  const isAdmin = role === "Admin";
  const isHR = role === "HR" || role === "Manager";

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      let endpoint = "/dashboard/employee";
      if (isAdmin) endpoint = "/dashboard/admin";
      else if (isHR) endpoint = "/dashboard/hr";

      const res = await api.get(endpoint);
      setDashboardData(res.data?.data || null);
    } catch (error) {
      console.error("Failed to load dashboard data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadDashboard();
  }, [role]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {isAdmin && "Admin Control Center"}
            {isHR && "HR Operations Hub"}
            {!isAdmin && !isHR && "Employee Self-Service Portal"}
          </h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, <strong className="text-foreground">{user?.Username}</strong> ({role})! Here is your daily overview.
          </p>
        </div>
      </div>

      {/* ────────────────── 1. ADMIN DASHBOARD ────────────────── */}
      {isAdmin && (
        <div className="space-y-6">
          {/* Admin Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="cursor-pointer hover:border-primary/50 transition-colors" onClick={() => onNavigate && onNavigate("/employees")}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Workforce</p>
                    <h3 className="text-3xl font-bold mt-2">{dashboardData?.totalEmployees || 0}</h3>
                    <p className="text-xs text-success mt-1">{dashboardData?.activeEmployees || 0} Active Employees</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:border-primary/50 transition-colors" onClick={() => onNavigate && onNavigate("/departments")}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Departments</p>
                    <h3 className="text-3xl font-bold mt-2">{dashboardData?.departmentsCount || 0}</h3>
                    <p className="text-xs text-muted-foreground mt-1">Active units</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-warning" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:border-primary/50 transition-colors" onClick={() => onNavigate && onNavigate("/leave")}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pending Leaves</p>
                    <h3 className="text-3xl font-bold mt-2 text-warning">{dashboardData?.leaves?.pending || 0}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{dashboardData?.leaves?.approved || 0} Approved</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-warning" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:border-primary/50 transition-colors" onClick={() => onNavigate && onNavigate("/payroll")}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Monthly Payroll</p>
                    <h3 className="text-2xl font-bold mt-2 text-primary">{formatCurrency(dashboardData?.payroll?.totalDisbursed)}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{dashboardData?.payroll?.count || 0} Slips Disbursed</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <IndianRupee className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Admin Mid Section: Departments & Attendance */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-lg">
                  <span>Departments Overview</span>
                  <Badge variant="outline">{dashboardData?.departmentsCount || 0} Units</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {dashboardData?.departments?.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No departments registered.</p>
                ) : (
                  dashboardData?.departments?.map((d) => (
                    <div key={d.DepartmentId} className="flex items-center justify-between p-3 bg-accent/40 rounded-lg">
                      <span className="font-semibold text-sm">{d.DepartmentName}</span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">Today's Attendance Status</CardTitle>
                <CardDescription>Live employee check-in and presence metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
                    <p className="text-xs text-muted-foreground font-semibold uppercase">Present</p>
                    <p className="text-3xl font-bold text-success mt-1">{dashboardData?.attendance?.present || 0}</p>
                  </div>
                  <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
                    <p className="text-xs text-muted-foreground font-semibold uppercase">Late</p>
                    <p className="text-3xl font-bold text-warning mt-1">{dashboardData?.attendance?.late || 0}</p>
                  </div>
                  <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <p className="text-xs text-muted-foreground font-semibold uppercase">Absent</p>
                    <p className="text-3xl font-bold text-destructive mt-1">{dashboardData?.attendance?.absent || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* ────────────────── 2. HR DASHBOARD ────────────────── */}
      {isHR && !isAdmin && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Today's Present</p>
                    <h3 className="text-3xl font-bold mt-2 text-success">{dashboardData?.todayAttendance?.present || 0}</h3>
                    <p className="text-xs text-warning mt-1">{dashboardData?.todayAttendance?.late || 0} Late Arrivals</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
                    <UserCheck className="w-6 h-6 text-success" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pending Leave Requests</p>
                    <h3 className="text-3xl font-bold mt-2 text-warning">{dashboardData?.pendingLeaveRequests?.length || 0}</h3>
                    <p className="text-xs text-muted-foreground mt-1">Awaiting approval</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center">
                    <Clock className="w-6 h-6 text-warning" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Payroll Disbursed</p>
                    <h3 className="text-2xl font-bold mt-2 text-primary">{formatCurrency(dashboardData?.payrollSummary?.totalNet)}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{dashboardData?.payrollSummary?.count || 0} Employees Paid</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <IndianRupee className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* HR Pending Leave Requests Table */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Pending Leave Applications</CardTitle>
                <CardDescription>Review and take action on employee leave requests</CardDescription>
              </div>
              {onNavigate && (
                <Button variant="ghost" size="sm" onClick={() => onNavigate("/leave")}>
                  Manage All Leaves <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              )}
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Leave Type</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dashboardData?.pendingLeaveRequests?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                        No pending leave requests awaiting approval.
                      </TableCell>
                    </TableRow>
                  ) : (
                    dashboardData?.pendingLeaveRequests?.map((req) => (
                      <TableRow key={req.LeaveId || req.id}>
                        <TableCell className="font-medium">{req.EmployeeName || req.employeeName}</TableCell>
                        <TableCell><Badge variant="outline">{req.LeaveTypeName || req.leaveTypeName}</Badge></TableCell>
                        <TableCell className="text-xs font-mono">{req.StartDate} to {req.EndDate}</TableCell>
                        <TableCell className="max-w-xs truncate text-xs">{req.Reason || req.reason}</TableCell>
                        <TableCell><Badge className="bg-warning/10 text-warning border-warning/20">Pending</Badge></TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ────────────────── 3. EMPLOYEE DASHBOARD ────────────────── */}
      {!isAdmin && !isHR && (
        <div className="space-y-6">
          {/* Punch Card Widget */}
          <PunchCard onStatusChange={loadDashboard} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Upcoming Leaves */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Upcoming Leaves</CardTitle>
                  <CardDescription>Your active & future applications</CardDescription>
                </div>
                {onNavigate && (
                  <Button variant="ghost" size="sm" onClick={() => onNavigate("/leave")}>
                    Apply <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                )}
              </CardHeader>
              <CardContent className="space-y-3">
                {dashboardData?.upcomingLeaves?.length === 0 ? (
                  <p className="text-sm text-muted-foreground p-4 border border-dashed rounded-lg text-center">
                    No upcoming leave applications.
                  </p>
                ) : (
                  dashboardData?.upcomingLeaves?.map((leave) => (
                    <div key={leave.LeaveId || leave.id} className="p-3 bg-accent/40 rounded-lg flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold">{leave.leaveTypeName || leave.LeaveTypeName}</p>
                        <p className="text-xs text-muted-foreground font-mono">{leave.StartDate} - {leave.EndDate}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">{leave.Status || leave.status}</Badge>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Recent Payslips */}
            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Recent Payslips</CardTitle>
                  <CardDescription>Your monthly salary disbursement statements</CardDescription>
                </div>
                {onNavigate && (
                  <Button variant="ghost" size="sm" onClick={() => onNavigate("/payroll")}>
                    View All <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                )}
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Month</TableHead>
                      <TableHead className="text-right">Gross Salary</TableHead>
                      <TableHead className="text-right">Deductions</TableHead>
                      <TableHead className="text-right">Net Salary</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dashboardData?.recentPayslips?.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                          No payslip statements generated yet.
                        </TableCell>
                      </TableRow>
                    ) : (
                      dashboardData?.recentPayslips?.map((p) => (
                        <TableRow key={p.PayrollId || p.id}>
                          <TableCell className="font-mono text-sm">{p.PayrollMonth || p.payrollMonth}</TableCell>
                          <TableCell className="text-right text-xs text-success">{formatCurrency(p.GrossSalary || p.grossSalary)}</TableCell>
                          <TableCell className="text-right text-xs text-destructive">-{formatCurrency(p.TotalDeductions || p.totalDeductions)}</TableCell>
                          <TableCell className="text-right font-bold text-sm text-primary">{formatCurrency(p.NetSalary || p.netSalary)}</TableCell>
                          <TableCell><Badge className="bg-success/10 text-success border-success/20 text-xs">Paid</Badge></TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

function ChevronRight(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

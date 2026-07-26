import { useEffect, useMemo, useState } from "react";
import { BarChart3, Download, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../components/ui/select";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import api from "../lib/api";
const formatCurrency = (value) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    notation: "compact",
    maximumFractionDigits: 1
  }).format(value);
};
export function Reports() {
  const [attendanceData, setAttendanceData] = useState([]);
  const [payrollData, setPayrollData] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [leaveData, setLeaveData] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const loadReports = async () => {
      try {
        setLoading(true);
        const [attendanceResponse, payrollResponse, departmentsResponse, leaveResponse] = await Promise.all([
          api.get("/attendance"),
          api.get("/payroll"),
          api.get("/departments"),
          api.get("/leaves")
        ]);
        setAttendanceData(attendanceResponse.data?.data ?? []);
        setPayrollData(payrollResponse.data?.data ?? []);
        setDepartmentData(departmentsResponse.data?.data ?? []);
        setLeaveData(leaveResponse.data?.data ?? []);
      } catch (error) {
        console.error("Failed to load reports", error);
      } finally {
        setLoading(false);
      }
    };
    void loadReports();
  }, []);
  const attendanceReportData = useMemo(() => {
    const grouped = /* @__PURE__ */ new Map();
    attendanceData.forEach((record) => {
      const month = record.AttendanceDate?.slice(0, 7) ?? "Unknown";
      const existing = grouped.get(month) ?? { month, present: 0, absent: 0, late: 0 };
      const status = (record.Status ?? "Present").toLowerCase();
      if (status === "present") existing.present += 1;
      if (status === "absent") existing.absent += 1;
      if (status === "late") existing.late += 1;
      grouped.set(month, existing);
    });
    return Array.from(grouped.values());
  }, [attendanceData]);
  const payrollReportData = useMemo(() => {
    const grouped = /* @__PURE__ */ new Map();
    payrollData.forEach((record) => {
      const month = record.PayrollMonth ?? "Unknown";
      const existing = grouped.get(month) ?? { month, amount: 0, employees: 0 };
      existing.amount += Number(record.NetSalary ?? 0);
      existing.employees += 1;
      grouped.set(month, existing);
    });
    return Array.from(grouped.values());
  }, [payrollData]);
  const departmentPerformanceData = useMemo(() => {
    return (departmentData ?? []).map((department) => ({
      department: department.DepartmentName,
      performance: Math.min(100, Math.max(0, (department.Employees?.length ?? 0) * 12 + 40))
    }));
  }, [departmentData]);
  const leaveReportData = useMemo(() => {
    const grouped = /* @__PURE__ */ new Map();
    leaveData.forEach((request) => {
      const month = request.AppliedDate?.slice(0, 7) ?? "Unknown";
      const existing = grouped.get(month) ?? { month, approved: 0, rejected: 0, pending: 0 };
      const status = (request.Status ?? "Pending").toLowerCase();
      if (status === "approved") existing.approved += 1;
      if (status === "rejected") existing.rejected += 1;
      if (status === "pending") existing.pending += 1;
      grouped.set(month, existing);
    });
    return Array.from(grouped.values());
  }, [leaveData]);
  const averageAttendance = attendanceReportData.length ? Math.round(attendanceReportData.reduce((sum, row) => sum + row.present, 0) / attendanceReportData.length) : 0;
  const totalPayrollYtd = payrollReportData.reduce((sum, row) => sum + row.amount, 0);
  const averagePerformance = departmentPerformanceData.length ? Math.round(departmentPerformanceData.reduce((sum, row) => sum + row.performance, 0) / departmentPerformanceData.length) : 0;
  return <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Reports & Analytics</h1>
          <p className="text-muted-foreground mt-1">Comprehensive insights and analytics across all HR operations</p>
        </div>
        <div className="flex items-center gap-3">
          <Select defaultValue="month">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            Custom Range
          </Button>
          <Button>
            <Download className="w-4 h-4 mr-2" />
            Export All
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Reports</p>
                <h3 className="text-3xl font-bold mt-2">{4}</h3>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div>
              <p className="text-sm text-muted-foreground">Avg Attendance Rate</p>
              <h3 className="text-3xl font-bold mt-2">{averageAttendance}%</h3>
              <p className="text-sm text-muted-foreground mt-1">Based on current attendance data</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div>
              <p className="text-sm text-muted-foreground">Total Payroll YTD</p>
              <h3 className="text-2xl font-bold mt-2">{formatCurrency(totalPayrollYtd)}</h3>
              <p className="text-sm text-muted-foreground mt-1">Based on available payroll data</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div>
              <p className="text-sm text-muted-foreground">Avg Performance</p>
              <h3 className="text-3xl font-bold mt-2">{averagePerformance}%</h3>
              <p className="text-sm text-muted-foreground mt-1">Department performance score</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="attendance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="payroll">Payroll</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="leave">Leave</TabsTrigger>
        </TabsList>

        <TabsContent value="attendance" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Attendance Trends</CardTitle>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? <div className="flex h-[400px] items-center justify-center rounded-lg border border-dashed text-center text-sm text-muted-foreground">Loading report data...</div> : attendanceReportData.length === 0 ? <div className="flex h-[400px] items-center justify-center rounded-lg border border-dashed text-center text-sm text-muted-foreground">No attendance report data is available yet.</div> : <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={attendanceReportData}>
                    <defs>
                      <linearGradient id="colorPresent" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorAbsent" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorLate" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey="month" stroke="#64748B" />
                    <YAxis stroke="#64748B" />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="present" stroke="#22C55E" fillOpacity={1} fill="url(#colorPresent)" name="Present" />
                    <Area type="monotone" dataKey="absent" stroke="#EF4444" fillOpacity={1} fill="url(#colorAbsent)" name="Absent" />
                    <Area type="monotone" dataKey="late" stroke="#F59E0B" fillOpacity={1} fill="url(#colorLate)" name="Late" />
                  </AreaChart>
                </ResponsiveContainer>}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payroll" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Payroll Expenses</CardTitle>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {payrollReportData.length === 0 ? <div className="flex h-[350px] items-center justify-center rounded-lg border border-dashed text-center text-sm text-muted-foreground">No payroll report data is available yet.</div> : <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={payrollReportData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                      <XAxis dataKey="month" stroke="#64748B" />
                      <YAxis stroke="#64748B" />
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                      <Bar dataKey="amount" fill="#2563EB" name="Payroll Amount" />
                    </BarChart>
                  </ResponsiveContainer>}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Employee Growth</CardTitle>
              </CardHeader>
              <CardContent>
                {payrollReportData.length === 0 ? <div className="flex h-[350px] items-center justify-center rounded-lg border border-dashed text-center text-sm text-muted-foreground">No employee growth data is available yet.</div> : <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={payrollReportData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                      <XAxis dataKey="month" stroke="#64748B" />
                      <YAxis stroke="#64748B" />
                      <Tooltip />
                      <Line type="monotone" dataKey="employees" stroke="#22C55E" strokeWidth={3} name="Total Employees" />
                    </LineChart>
                  </ResponsiveContainer>}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Department Performance</CardTitle>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {departmentPerformanceData.length === 0 ? <div className="flex h-[400px] items-center justify-center rounded-lg border border-dashed text-center text-sm text-muted-foreground">No performance report data is available yet.</div> : <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={departmentPerformanceData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis type="number" stroke="#64748B" domain={[0, 100]} />
                    <YAxis dataKey="department" type="category" stroke="#64748B" width={120} />
                    <Tooltip />
                    <Bar dataKey="performance" fill="#2563EB" name="Performance Score %" />
                  </BarChart>
                </ResponsiveContainer>}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leave" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Leave Request Trends</CardTitle>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {leaveReportData.length === 0 ? <div className="flex h-[400px] items-center justify-center rounded-lg border border-dashed text-center text-sm text-muted-foreground">No leave report data is available yet.</div> : <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={leaveReportData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey="month" stroke="#64748B" />
                    <YAxis stroke="#64748B" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="approved" fill="#22C55E" name="Approved" />
                    <Bar dataKey="pending" fill="#F59E0B" name="Pending" />
                    <Bar dataKey="rejected" fill="#EF4444" name="Rejected" />
                  </BarChart>
                </ResponsiveContainer>}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>;
}

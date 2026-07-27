import { useEffect, useState } from "react";
import { Users, UserCheck, Building2, Calendar, Clock, Megaphone, LogIn, LogOut, CheckCircle2, ChevronRight, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import api from "../lib/api";
import { toast } from "sonner";

export function Dashboard({ onNavigate }) {
  const [stats, setStats] = useState({
    employeeCount: 0,
    departmentCount: 0,
    leaveCount: 0,
    presentCount: 0
  });

  const [todayStatus, setTodayStatus] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [actionLoading, setActionLoading] = useState(false);

  const loadDashboardData = async () => {
    try {
      const [empRes, deptRes, leaveRes, todayRes, notifRes] = await Promise.all([
        api.get("/employees").catch(() => ({ data: { data: [] } })),
        api.get("/departments").catch(() => ({ data: { data: [] } })),
        api.get("/leaves").catch(() => ({ data: { data: [] } })),
        api.get("/attendance/today").catch(() => ({ data: { data: null } })),
        api.get("/notifications").catch(() => ({ data: { data: [] } }))
      ]);

      const employees = empRes.data?.data ?? [];
      const departments = deptRes.data?.data ?? [];
      const leaves = leaveRes.data?.data ?? [];
      const notifs = notifRes.data?.data ?? [];

      setStats({
        employeeCount: employees.length,
        departmentCount: departments.length,
        leaveCount: leaves.filter((l) => l.Status === "Pending").length,
        presentCount: todayRes.data?.data?.status === "checked_in" || todayRes.data?.data?.status === "checked_out" ? 1 : 0
      });

      setTodayStatus(todayRes.data?.data ?? null);
      setAnnouncements(notifs.slice(0, 3));
    } catch (error) {
      console.error("Failed to load dashboard data", error);
    }
  };

  useEffect(() => {
    void loadDashboardData();
  }, []);

  const handleCheckIn = async () => {
    try {
      setActionLoading(true);
      await api.post("/attendance/checkin", {});
      toast.success("Checked in successfully!");
      await loadDashboardData();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to check in");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCheckOut = async () => {
    try {
      setActionLoading(true);
      await api.post("/attendance/checkout", {});
      toast.success("Checked out successfully!");
      await loadDashboardData();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to check out");
    } finally {
      setActionLoading(false);
    }
  };

  const leaveData = [
    { name: "Approved", value: 5, color: "#22C55E" },
    { name: "Pending", value: stats.leaveCount, color: "#F59E0B" },
    { name: "Rejected", value: 1, color: "#EF4444" }
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back! Here's an overview of your organization today.
        </p>
      </div>

      {/* Attendance Check-in Widget */}
      <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-card border-primary/20">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <h3 className="font-semibold text-lg">Daily Attendance Widget</h3>
                {todayStatus?.status === "checked_in" && (
                  <Badge className="bg-success/10 text-success border-success/20">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Checked In ({todayStatus?.checkIn})
                  </Badge>
                )}
                {todayStatus?.status === "checked_out" && (
                  <Badge variant="secondary">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Checked Out ({todayStatus?.checkOut})
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                Working Hours Today: <span className="font-semibold text-primary">{todayStatus?.workingHours || "0.0"} hrs</span>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={handleCheckIn}
                disabled={actionLoading || todayStatus?.status === "checked_in" || todayStatus?.status === "checked_out"}
                className="bg-success hover:bg-success/90 text-white"
              >
                <LogIn className="w-4 h-4 mr-2" />
                {todayStatus?.status === "checked_in" || todayStatus?.status === "checked_out" ? "Checked In" : "Check In"}
              </Button>

              <Button
                variant="outline"
                onClick={handleCheckOut}
                disabled={actionLoading || todayStatus?.status !== "checked_in"}
                className="border-destructive text-destructive hover:bg-destructive hover:text-white"
              >
                <LogOut className="w-4 h-4 mr-2" />
                {todayStatus?.status === "checked_out" ? "Checked Out" : "Check Out"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Employees</p>
                <h3 className="text-3xl font-bold mt-2">{stats.employeeCount}</h3>
                <p className="text-xs text-muted-foreground mt-1">Active workforce</p>
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
                <p className="text-sm text-muted-foreground">Active Today</p>
                <h3 className="text-3xl font-bold mt-2">{stats.presentCount}</h3>
                <p className="text-xs text-success mt-1">Checked in</p>
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
                <p className="text-sm text-muted-foreground">Departments</p>
                <h3 className="text-3xl font-bold mt-2">{stats.departmentCount}</h3>
                <p className="text-xs text-muted-foreground mt-1">Operational units</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Leaves</p>
                <h3 className="text-3xl font-bold mt-2">{stats.leaveCount}</h3>
                <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20 mt-1">
                  Requires action
                </Badge>
              </div>
              <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Latest Company Announcements */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-primary" />
                Latest Announcements
              </CardTitle>
              <CardDescription>Recent updates and company notifications</CardDescription>
            </div>
            {onNavigate && (
              <Button variant="ghost" size="sm" onClick={() => onNavigate("/announcements")}>
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {announcements.length === 0 ? (
              <div className="p-8 text-center text-sm text-muted-foreground border border-dashed rounded-lg">
                No company announcements posted yet.
              </div>
            ) : (
              announcements.map((item) => (
                <div key={item.NotificationId} className="p-4 rounded-lg bg-accent/40 border border-border space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm">{item.Title}</span>
                    <Badge variant="outline" className="text-[10px]">{item.Priority || "Normal"}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">{item.Message}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Leave Status Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Leave Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={leaveData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {leaveData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

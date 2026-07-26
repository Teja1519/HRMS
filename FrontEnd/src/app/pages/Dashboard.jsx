import { Users, UserCheck, Building2, Calendar, DollarSign, TrendingUp, TrendingDown, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
const employeeGrowthData = [
  { month: "Jan", employees: 420 },
  { month: "Feb", employees: 435 },
  { month: "Mar", employees: 455 },
  { month: "Apr", employees: 470 },
  { month: "May", employees: 485 },
  { month: "Jun", employees: 502 }
];
const attendanceData = [
  { day: "Mon", present: 480, absent: 22, late: 15 },
  { day: "Tue", present: 490, absent: 12, late: 8 },
  { day: "Wed", present: 485, absent: 17, late: 10 },
  { day: "Thu", present: 495, absent: 7, late: 5 },
  { day: "Fri", present: 492, absent: 10, late: 12 }
];
const leaveData = [
  { name: "Approved", value: 45, color: "#22C55E" },
  { name: "Pending", value: 12, color: "#F59E0B" },
  { name: "Rejected", value: 3, color: "#EF4444" }
];
const departmentData = [
  { name: "Engineering", employees: 150 },
  { name: "Marketing", employees: 45 },
  { name: "Sales", employees: 80 },
  { name: "HR", employees: 25 },
  { name: "Finance", employees: 35 },
  { name: "Operations", employees: 65 }
];
const recentActivities = [
  { user: "John Doe", action: "submitted a leave request", time: "2 hours ago", type: "leave" },
  { user: "Jane Smith", action: "checked in", time: "3 hours ago", type: "attendance" },
  { user: "Mike Johnson", action: "updated profile", time: "5 hours ago", type: "profile" },
  { user: "Sarah Wilson", action: "approved leave for Alex Brown", time: "6 hours ago", type: "approval" },
  { user: "Tom Davis", action: "checked out", time: "8 hours ago", type: "attendance" }
];
const newJoiners = [];
const upcomingHolidays = [
  { name: "Independence Day", date: "July 4, 2026", daysLeft: 29 },
  { name: "Labor Day", date: "September 7, 2026", daysLeft: 94 },
  { name: "Thanksgiving", date: "November 26, 2026", daysLeft: 174 }
];
export function Dashboard() {
  return <div className="p-6 space-y-6">
      {
    /* Page Header */
  }
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back! Here's what's happening with your organization today.
        </p>
      </div>

      {
    /* Stats Cards */
  }
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Employees</p>
                <h3 className="text-3xl font-bold mt-2">0</h3>
                <div className="flex items-center gap-1 mt-2">
                  <span className="text-sm text-muted-foreground">No employee data yet</span>
                </div>
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
                <h3 className="text-3xl font-bold mt-2">0</h3>
                <div className="flex items-center gap-1 mt-2">
                  <span className="text-sm text-muted-foreground">Attendance will appear here</span>
                </div>
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
                <h3 className="text-3xl font-bold mt-2">0</h3>
                <div className="flex items-center gap-1 mt-2">
                  <span className="text-sm text-muted-foreground">Departments will appear here</span>
                </div>
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
                <p className="text-sm text-muted-foreground">Leave Requests</p>
                <h3 className="text-3xl font-bold mt-2">0</h3>
                <div className="flex items-center gap-1 mt-2">
                  <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
                    No pending requests
                  </Badge>
                </div>
              </div>
              <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {
    /* Charts Section */
  }
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {
    /* Employee Growth */
  }
        <Card>
          <CardHeader>
            <CardTitle>Employee Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={employeeGrowthData}>
                <defs>
                  <linearGradient id="colorEmployees" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="month" stroke="#64748B" />
                <YAxis stroke="#64748B" />
                <Tooltip />
                <Area
    type="monotone"
    dataKey="employees"
    stroke="#2563EB"
    fillOpacity={1}
    fill="url(#colorEmployees)"
  />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {
    /* Attendance Analytics */
  }
        <Card>
          <CardHeader>
            <CardTitle>Weekly Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="day" stroke="#64748B" />
                <YAxis stroke="#64748B" />
                <Tooltip />
                <Legend />
                <Bar dataKey="present" fill="#22C55E" name="Present" />
                <Bar dataKey="late" fill="#F59E0B" name="Late" />
                <Bar dataKey="absent" fill="#EF4444" name="Absent" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {
    /* Leave Statistics */
  }
        <Card>
          <CardHeader>
            <CardTitle>Leave Requests Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
    data={leaveData}
    cx="50%"
    cy="50%"
    labelLine={false}
    label={({ name, value }) => `${name}: ${value}`}
    outerRadius={100}
    fill="#8884d8"
    dataKey="value"
  >
                    {leaveData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {
    /* Department Distribution */
  }
        <Card>
          <CardHeader>
            <CardTitle>Department Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={departmentData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis type="number" stroke="#64748B" />
                <YAxis dataKey="name" type="category" stroke="#64748B" width={100} />
                <Tooltip />
                <Bar dataKey="employees" fill="#2563EB" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {
    /* Bottom Section */
  }
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {
    /* Recent Activities */
  }
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => <div key={index} className="flex items-start gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs">
                      {activity.user.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">
                      <span className="font-medium">{activity.user}</span>{" "}
                      <span className="text-muted-foreground">{activity.action}</span>
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3" />
                      {activity.time}
                    </p>
                  </div>
                </div>)}
            </div>
          </CardContent>
        </Card>

        {
    /* New Joiners */
  }
        <Card>
          <CardHeader>
            <CardTitle>New Joiners</CardTitle>
          </CardHeader>
          <CardContent>
            {newJoiners.length === 0 ? <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                No new employee records yet. Add employees from the database or through the employee creation flow once it is connected.
              </div> : <div className="space-y-4">
                {newJoiners.map((joiner, index) => <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-accent/50">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-success/10 text-success">
                        {joiner.name.split(" ").map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{joiner.name}</p>
                      <p className="text-xs text-muted-foreground">{joiner.position}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">{joiner.department}</Badge>
                        <span className="text-xs text-muted-foreground">{joiner.date}</span>
                      </div>
                    </div>
                  </div>)}
              </div>}
          </CardContent>
        </Card>

        {
    /* Upcoming Holidays */
  }
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Holidays</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingHolidays.map((holiday, index) => <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-accent/50">
                  <div>
                    <p className="font-medium text-sm">{holiday.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">{holiday.date}</p>
                  </div>
                  <Badge className="bg-primary/10 text-primary border-primary/20">
                    {holiday.daysLeft} days
                  </Badge>
                </div>)}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>;
}

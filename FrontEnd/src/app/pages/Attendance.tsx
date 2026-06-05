import { useState } from "react";
import { Calendar as CalendarIcon, Clock, Download, Filter, Users, UserCheck, UserX, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Calendar } from "../components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";

const todayAttendance = [
  { id: "EMP001", name: "John Doe", checkIn: "09:00 AM", checkOut: "-", status: "present", department: "Engineering" },
  { id: "EMP002", name: "Jane Smith", checkIn: "09:15 AM", checkOut: "-", status: "late", department: "Marketing" },
  { id: "EMP003", name: "Mike Johnson", checkIn: "08:45 AM", checkOut: "05:30 PM", status: "present", department: "Sales" },
  { id: "EMP004", name: "Sarah Wilson", checkIn: "09:00 AM", checkOut: "-", status: "present", department: "HR" },
  { id: "EMP005", name: "Tom Davis", checkIn: "-", checkOut: "-", status: "absent", department: "Finance" },
  { id: "EMP006", name: "Emily Chen", checkIn: "09:05 AM", checkOut: "-", status: "present", department: "Engineering" },
  { id: "EMP007", name: "Robert Lee", checkIn: "09:30 AM", checkOut: "-", status: "late", department: "Marketing" },
  { id: "EMP008", name: "Lisa Anderson", checkIn: "-", checkOut: "-", status: "on-leave", department: "Sales" },
];

const monthlyStats = {
  totalWorkingDays: 22,
  presentDays: 20,
  absentDays: 1,
  lateDays: 1,
  averageWorkHours: "8.5 hrs",
  attendanceRate: "95.5%",
};

export function Attendance() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedDepartment, setSelectedDepartment] = useState("all");

  const filteredAttendance = todayAttendance.filter((record) =>
    selectedDepartment === "all" || record.department === selectedDepartment
  );

  const presentCount = todayAttendance.filter(r => r.status === "present").length;
  const lateCount = todayAttendance.filter(r => r.status === "late").length;
  const absentCount = todayAttendance.filter(r => r.status === "absent").length;
  const onLeaveCount = todayAttendance.filter(r => r.status === "on-leave").length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "present":
        return <Badge className="bg-success/10 text-success border-success/20">Present</Badge>;
      case "late":
        return <Badge className="bg-warning/10 text-warning border-warning/20">Late</Badge>;
      case "absent":
        return <Badge className="bg-destructive/10 text-destructive border-destructive/20">Absent</Badge>;
      case "on-leave":
        return <Badge className="bg-blue-100 text-blue-700 border-blue-200">On Leave</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Attendance Management</h1>
          <p className="text-muted-foreground mt-1">
            Track and manage employee attendance
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button>
            <Clock className="w-4 h-4 mr-2" />
            Mark Attendance
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Present Today</p>
                <h3 className="text-3xl font-bold mt-2">{presentCount}</h3>
                <p className="text-sm text-success mt-1">
                  {((presentCount / todayAttendance.length) * 100).toFixed(1)}% of total
                </p>
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
                <p className="text-sm text-muted-foreground">Late Arrivals</p>
                <h3 className="text-3xl font-bold mt-2">{lateCount}</h3>
                <p className="text-sm text-warning mt-1">
                  {((lateCount / todayAttendance.length) * 100).toFixed(1)}% of total
                </p>
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
                <p className="text-sm text-muted-foreground">Absent</p>
                <h3 className="text-3xl font-bold mt-2">{absentCount}</h3>
                <p className="text-sm text-destructive mt-1">
                  {((absentCount / todayAttendance.length) * 100).toFixed(1)}% of total
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                <UserX className="w-6 h-6 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">On Leave</p>
                <h3 className="text-3xl font-bold mt-2">{onLeaveCount}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Approved leaves
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <CalendarIcon className="w-6 h-6 text-blue-700" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Calendar and Monthly Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card>
          <CardHeader>
            <CardTitle>Attendance Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        {/* Monthly Statistics */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Monthly Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Total Working Days</p>
                <p className="text-2xl font-bold">{monthlyStats.totalWorkingDays}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Present Days</p>
                <p className="text-2xl font-bold text-success">{monthlyStats.presentDays}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Absent Days</p>
                <p className="text-2xl font-bold text-destructive">{monthlyStats.absentDays}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Late Days</p>
                <p className="text-2xl font-bold text-warning">{monthlyStats.lateDays}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Avg Work Hours</p>
                <p className="text-2xl font-bold">{monthlyStats.averageWorkHours}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Attendance Rate</p>
                <p className="text-2xl font-bold text-primary">{monthlyStats.attendanceRate}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Attendance */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Today's Attendance</CardTitle>
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="Engineering">Engineering</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
                <SelectItem value="Sales">Sales</SelectItem>
                <SelectItem value="HR">HR</SelectItem>
                <SelectItem value="Finance">Finance</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Employee ID</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Check In</TableHead>
                <TableHead>Check Out</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Work Hours</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAttendance.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          {record.name.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{record.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-sm">{record.id}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{record.department}</Badge>
                  </TableCell>
                  <TableCell>
                    {record.checkIn !== "-" ? (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span>{record.checkIn}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {record.checkOut !== "-" ? (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span>{record.checkOut}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>{getStatusBadge(record.status)}</TableCell>
                  <TableCell>
                    {record.checkIn !== "-" && record.checkOut !== "-" ? (
                      <span className="font-medium">8h 30m</span>
                    ) : record.checkIn !== "-" ? (
                      <span className="text-muted-foreground">In Progress</span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

import { useEffect, useMemo, useState } from "react";
import { Calendar as CalendarIcon, Clock, Download, UserCheck, UserX, AlertTriangle, FileSpreadsheet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Calendar } from "../components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { PunchCard } from "../components/PunchCard";
import { useAuth } from "../../context/AuthContext";
import api from "../lib/api";
import { toast } from "sonner";

export function Attendance() {
  const { role } = useAuth();
  const isAdminOrHR = role === "Admin" || role === "HR" || role === "Manager";

  const [date, setDate] = useState(new Date());
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [activeTab, setActiveTab] = useState("all"); // "all" | "late" | "absent"
  const [attendance, setAttendance] = useState([]);
  const [lateReport, setLateReport] = useState([]);
  const [absentReport, setAbsentReport] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadAttendanceData = async () => {
    try {
      setLoading(true);
      const resAll = await api.get("/attendance");
      const listAll = resAll.data?.data ?? [];
      
      const mapped = listAll.map((rec) => ({
        id: `ATT-${rec.AttendanceId || rec.EmployeeId}`,
        employeeId: rec.EmployeeId,
        name: rec.EmployeeName || rec.Employee?.FirstName || "Unknown",
        department: rec.DepartmentName || rec.Employee?.Department?.DepartmentName || "Unassigned",
        date: rec.AttendanceDate,
        checkIn: rec.CheckIn || "-",
        checkOut: rec.CheckOut || "-",
        status: (rec.Status || "Present").toLowerCase(),
        workingHours: rec.WorkingHours || rec.workingHours || "0.0",
      }));
      setAttendance(mapped);

      if (isAdminOrHR) {
        try {
          const resLate = await api.get("/attendance/late");
          setLateReport(resLate.data?.data ?? []);
        } catch (err) {
          console.warn("Failed to load late report", err);
        }

        try {
          const resAbsent = await api.get("/attendance/absent");
          setAbsentReport(resAbsent.data?.data ?? []);
        } catch (err) {
          console.warn("Failed to load absent report", err);
        }
      }
    } catch (error) {
      console.error("Failed to load attendance", error);
      setAttendance([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadAttendanceData();
  }, [role]);

  const handleExport = () => {
    try {
      const csvHeaders = ["Attendance ID,Employee Name,Department,Date,Check In,Check Out,Status,Work Hours"];
      const csvRows = attendance.map((row) =>
        `"${row.id}","${row.name}","${row.department}","${row.date}","${row.checkIn}","${row.checkOut}","${row.status}","${row.workingHours} hrs"`
      );
      const csvContent = "data:text/csv;charset=utf-8," + [csvHeaders, ...csvRows].join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `attendance_export_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Attendance ledger exported successfully!");
    } catch (error) {
      toast.error("Failed to export attendance ledger");
    }
  };

  const presentCount = attendance.filter((r) => r.status === "present").length;
  const lateCount = attendance.filter((r) => r.status === "late").length;
  const absentCount = absentReport.length || attendance.filter((r) => r.status === "absent").length;

  const departmentOptions = useMemo(
    () => Array.from(new Set(attendance.map((r) => r.department))).filter(Boolean),
    [attendance]
  );

  const filteredAttendance = useMemo(() => {
    return attendance.filter((r) => {
      const matchesDept = selectedDepartment === "all" || r.department === selectedDepartment;
      if (activeTab === "late") return matchesDept && r.status === "late";
      if (activeTab === "absent") return matchesDept && r.status === "absent";
      return matchesDept;
    });
  }, [attendance, selectedDepartment, activeTab]);

  const getStatusBadge = (status) => {
    const s = String(status).toLowerCase();
    if (s === "present") return <Badge className="bg-success/10 text-success border-success/20">Present</Badge>;
    if (s === "late") return <Badge className="bg-warning/10 text-warning border-warning/20">Late Arrival</Badge>;
    if (s === "absent") return <Badge className="bg-destructive/10 text-destructive border-destructive/20">Absent</Badge>;
    return <Badge variant="outline">{status}</Badge>;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Attendance Management</h1>
          <p className="text-muted-foreground mt-1">Daily employee punch-in, check-out tracking, and monthly ledger</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleExport} title="Export attendance records to CSV">
            <Download className="w-4 h-4 mr-2" /> Export CSV
          </Button>
        </div>
      </div>

      {/* Daily Check-In / Check-Out Punch Card */}
      <PunchCard onStatusChange={loadAttendanceData} />

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Present Today</p>
                <h3 className="text-3xl font-bold mt-2 text-success">{presentCount}</h3>
                <p className="text-sm text-success mt-1">Logged on time</p>
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
                <h3 className="text-3xl font-bold mt-2 text-warning">{lateCount}</h3>
                <p className="text-sm text-warning mt-1">After office start time</p>
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
                <p className="text-sm text-muted-foreground">Absent Employees</p>
                <h3 className="text-3xl font-bold mt-2 text-destructive">{absentCount}</h3>
                <p className="text-sm text-destructive mt-1">No punch recorded</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                <UserX className="w-6 h-6 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Calendar & Admin Reports Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <CalendarIcon className="w-5 h-5 text-primary" /> Attendance Calendar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border" />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Attendance Reports & Filters</CardTitle>
                <CardDescription>View late arrivals, absent personnel, and department summaries</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant={activeTab === "all" ? "default" : "outline"}
                  onClick={() => setActiveTab("all")}
                >
                  All Ledger
                </Button>
                <Button
                  size="sm"
                  variant={activeTab === "late" ? "default" : "outline"}
                  onClick={() => setActiveTab("late")}
                >
                  Late ({lateCount})
                </Button>
                {isAdminOrHR && (
                  <Button
                    size="sm"
                    variant={activeTab === "absent" ? "default" : "outline"}
                    onClick={() => setActiveTab("absent")}
                  >
                    Absent ({absentCount})
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeTab === "absent" && isAdminOrHR ? (
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-destructive flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" /> Absent Employees Today
                </h4>
                {absentReport.length === 0 ? (
                  <p className="text-sm text-muted-foreground p-4 border border-dashed rounded-lg text-center">
                    All employees have checked in today! No absent records.
                  </p>
                ) : (
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Employee Code</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Department</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {absentReport.map((emp) => (
                          <TableRow key={emp.EmployeeId}>
                            <TableCell className="font-mono text-xs">{emp.EmployeeCode}</TableCell>
                            <TableCell className="font-medium">{emp.EmployeeName}</TableCell>
                            <TableCell>{emp.DepartmentName}</TableCell>
                            <TableCell><Badge variant="destructive">Absent</Badge></TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Check In</TableHead>
                      <TableHead>Check Out</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Work Hours</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          Loading attendance records...
                        </TableCell>
                      </TableRow>
                    ) : filteredAttendance.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          No attendance records found for the selected view filter.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredAttendance.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="w-8 h-8">
                                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                  {record.name.split(" ").map((n) => n[0]).join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium text-sm">{record.name}</div>
                                <div className="text-xs text-muted-foreground">{record.id}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-xs">{record.department}</Badge>
                          </TableCell>
                          <TableCell className="text-xs font-mono">{record.date}</TableCell>
                          <TableCell className="text-xs font-mono">{record.checkIn}</TableCell>
                          <TableCell className="text-xs font-mono">{record.checkOut}</TableCell>
                          <TableCell>{getStatusBadge(record.status)}</TableCell>
                          <TableCell className="font-semibold text-xs text-primary">{record.workingHours} hrs</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { useEffect, useMemo, useState } from "react";
import { Plus, Calendar, CheckCircle, XCircle, Clock, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "../components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import api from "../lib/api";
import { toast } from "sonner";
const calculateDays = (startDate, endDate) => {
  if (!startDate || !endDate) return 0;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diff = (end.getTime() - start.getTime()) / (1e3 * 60 * 60 * 24);
  return Math.max(1, Math.round(diff + 1));
};
export function LeaveManagement() {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [leaveBalance, setLeaveBalance] = useState([]);
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("requests");
  const [loading, setLoading] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [leaveForm, setLeaveForm] = useState({ LeaveTypeId: "", StartDate: "", EndDate: "", Reason: "" });
  const loadLeaveData = async () => {
    try {
      setLoading(true);
      const [requestsResponse, typesResponse] = await Promise.all([api.get("/leaves"), api.get("/leaves/types")]);
      const requestPayload = requestsResponse.data?.data ?? [];
      const typePayload = typesResponse.data?.data ?? [];
      const mappedRequests = requestPayload.map((request) => ({
        id: request.LeaveRequestId,
        employeeName: request.Employee ? `${request.Employee.FirstName ?? ""} ${request.Employee.LastName ?? ""}`.trim() : "Unknown",
        employeeId: request.Employee?.EmployeeCode ?? "-",
        leaveType: request.LeaveType?.LeaveTypeName ?? "Unknown",
        startDate: request.StartDate ?? "-",
        endDate: request.EndDate ?? "-",
        days: calculateDays(request.StartDate, request.EndDate),
        status: (request.Status ?? "Pending").toLowerCase(),
        reason: request.Reason ?? "-",
        appliedOn: request.AppliedDate ?? "-"
      }));
      const balanceMap = /* @__PURE__ */ new Map();
      typePayload.forEach((type, index) => {
        balanceMap.set(type.LeaveTypeName, {
          type: type.LeaveTypeName,
          total: 20,
          used: 0,
          remaining: 20,
          color: index % 2 === 0 ? "bg-primary/10" : "bg-success/10"
        });
      });
      mappedRequests.forEach((request) => {
        if (request.status === "approved") {
          const existing = balanceMap.get(request.leaveType);
          if (existing) {
            existing.used += request.days;
            existing.remaining = Math.max(0, existing.total - existing.used);
          }
        }
      });
      setLeaveTypes(typePayload.map((type) => ({ LeaveTypeId: type.LeaveTypeId, LeaveTypeName: type.LeaveTypeName })));
      setLeaveRequests(mappedRequests);
      setLeaveBalance(Array.from(balanceMap.values()));
    } catch (error) {
      console.error("Failed to load leave data", error);
      setLeaveRequests([]);
      setLeaveBalance([]);
      setLeaveTypes([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    void loadLeaveData();
  }, []);
  const filteredRequests = leaveRequests.filter((request) => statusFilter === "all" || request.status === statusFilter);
  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-success/10 text-success border-success/20">
            <CheckCircle className="w-3 h-3 mr-1" />
            Approved
          </Badge>;
      case "rejected":
        return <Badge className="bg-destructive/10 text-destructive border-destructive/20">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>;
      case "pending":
        return <Badge className="bg-warning/10 text-warning border-warning/20">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  const pendingCount = leaveRequests.filter((request) => request.status === "pending").length;
  const approvedCount = leaveRequests.filter((request) => request.status === "approved").length;
  const rejectedCount = leaveRequests.filter((request) => request.status === "rejected").length;
  const handleApplyLeave = async (event) => {
    event.preventDefault();
    try {
      setIsSubmitting(true);
      const storedUser = localStorage.getItem("user");
      const parsedUser = storedUser ? JSON.parse(storedUser) : null;
      await api.post("/leaves/apply", {
        ...leaveForm,
        LeaveTypeId: Number(leaveForm.LeaveTypeId),
        EmployeeId: parsedUser?.EmployeeId ? Number(parsedUser.EmployeeId) : void 0
      });
      toast.success("Leave request submitted successfully");
      setIsCreateOpen(false);
      setLeaveForm({ LeaveTypeId: "", StartDate: "", EndDate: "", Reason: "" });
      await loadLeaveData();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to apply for leave");
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleLeaveDecision = async (id, action) => {
    try {
      await api.put(`/leaves/${id}/${action}`);
      setLeaveRequests((current) => current.map((request) => request.id === id ? { ...request, status: action === "approve" ? "approved" : "rejected" } : request));
    } catch (error) {
      console.error(`Failed to ${action} leave request`, error);
    }
  };
  return <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Leave Management</h1>
          <p className="text-muted-foreground mt-1">Manage employee leave requests and balances</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Apply Leave
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Apply for leave</DialogTitle>
                <DialogDescription>Submit a new leave request for the selected date range.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleApplyLeave} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="leaveType">Leave type</Label>
                  <Select value={leaveForm.LeaveTypeId} onValueChange={(value) => setLeaveForm({ ...leaveForm, LeaveTypeId: value })}>
                    <SelectTrigger id="leaveType">
                      <SelectValue placeholder="Select leave type" />
                    </SelectTrigger>
                    <SelectContent>
                      {leaveTypes.map((type) => <SelectItem key={type.LeaveTypeId} value={String(type.LeaveTypeId)}>
                          {type.LeaveTypeName}
                        </SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start date</Label>
                    <Input id="startDate" type="date" required value={leaveForm.StartDate} onChange={(event) => setLeaveForm({ ...leaveForm, StartDate: event.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End date</Label>
                    <Input id="endDate" type="date" required value={leaveForm.EndDate} onChange={(event) => setLeaveForm({ ...leaveForm, EndDate: event.target.value })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reason">Reason</Label>
                  <textarea
    id="reason"
    rows={4}
    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none"
    value={leaveForm.Reason}
    onChange={(event) => setLeaveForm({ ...leaveForm, Reason: event.target.value })}
  />
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit leave"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Requests</p>
                <h3 className="text-3xl font-bold mt-2">{pendingCount}</h3>
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
                <p className="text-sm text-muted-foreground">Approved</p>
                <h3 className="text-3xl font-bold mt-2">{approvedCount}</h3>
              </div>
              <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Rejected</p>
                <h3 className="text-3xl font-bold mt-2">{rejectedCount}</h3>
              </div>
              <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                <XCircle className="w-6 h-6 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">On Leave Today</p>
                <h3 className="text-3xl font-bold mt-2">0</h3>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="requests">Leave Requests</TabsTrigger>
          <TabsTrigger value="balance">Leave Balance</TabsTrigger>
          <TabsTrigger value="history">Leave History</TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Leave Requests</CardTitle>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Leave Type</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Days</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        Loading leave requests...
                      </TableCell>
                    </TableRow> : filteredRequests.length === 0 ? <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        No leave requests have been submitted yet.
                      </TableCell>
                    </TableRow> : filteredRequests.map((request) => <TableRow key={request.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-primary/10 text-primary text-xs">
                              {request.employeeName.split(" ").map((n) => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{request.employeeName}</div>
                            <div className="text-xs text-muted-foreground">{request.employeeId}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{request.leaveType}</Badge>
                      </TableCell>
                      <TableCell>{request.startDate}</TableCell>
                      <TableCell>{request.endDate}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{request.days} days</Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{request.reason}</TableCell>
                      <TableCell>{getStatusBadge(request.status)}</TableCell>
                      <TableCell className="text-right">
                        {request.status === "pending" && <div className="flex items-center gap-2 justify-end">
                            <Button size="sm" variant="outline" className="text-success border-success hover:bg-success hover:text-white" onClick={() => handleLeaveDecision(request.id, "approve")}>
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            <Button size="sm" variant="outline" className="text-destructive border-destructive hover:bg-destructive hover:text-white" onClick={() => handleLeaveDecision(request.id, "reject")}>
                              <XCircle className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </div>}
                      </TableCell>
                    </TableRow>)}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="balance" className="space-y-4 mt-6">
          {leaveBalance.length === 0 ? <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
              No leave balance records are available yet.
            </div> : <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {leaveBalance.map((leave, index) => <Card key={`${leave.type}-${index}`}>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{leave.type}</h3>
                        <Badge className="bg-primary/10 text-primary border-primary/20">{leave.remaining} days left</Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Used</span>
                          <span className="font-medium">{leave.used} days</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Total</span>
                          <span className="font-medium">{leave.total} days</span>
                        </div>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className={`${leave.color} h-2 rounded-full transition-all`} style={{ width: `${Math.min(100, leave.used / leave.total * 100)}%` }} />
                      </div>
                    </div>
                  </CardContent>
                </Card>)}
            </div>}
        </TabsContent>

        <TabsContent value="history" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Leave History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">Leave history will be displayed here</div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>;
}

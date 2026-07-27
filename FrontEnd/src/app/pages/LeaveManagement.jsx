import { useEffect, useMemo, useState } from "react";
import { Plus, Calendar, CheckCircle, XCircle, Clock, Download, MessageSquare, Ban } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { useAuth } from "../../context/AuthContext";
import api from "../lib/api";
import { toast } from "sonner";

const calculateDays = (startDate, endDate) => {
  if (!startDate || !endDate) return 0;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
  return Math.max(1, Math.round(diff + 1));
};

export function LeaveManagement() {
  const { role } = useAuth();
  const isAdminOrHR = role === "Admin" || role === "HR" || role === "Manager";

  const [leaveRequests, setLeaveRequests] = useState([]);
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0, cancelled: 0 });
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("requests");
  const [loading, setLoading] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDecisionOpen, setIsDecisionOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [decisionAction, setDecisionAction] = useState("Approved"); // "Approved" | "Rejected"
  const [decisionComments, setDecisionComments] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [leaveForm, setLeaveForm] = useState({ LeaveTypeId: "", StartDate: "", EndDate: "", Reason: "" });

  const loadLeaveData = async () => {
    try {
      setLoading(true);
      const endpoint = isAdminOrHR ? "/leaves" : "/leaves/my-leaves";
      const [requestsRes, typesRes, statsRes] = await Promise.all([
        api.get(endpoint),
        api.get("/leaves/types"),
        api.get("/leaves/stats"),
      ]);

      const reqPayload = requestsRes.data?.data ?? [];
      const typesPayload = typesRes.data?.data ?? [];
      const statsPayload = statsRes.data?.data ?? { total: 0, pending: 0, approved: 0, rejected: 0, cancelled: 0 };

      const mapped = reqPayload.map((req) => ({
        id: req.LeaveId,
        employeeName: req.EmployeeName || "Unknown",
        employeeCode: req.EmployeeCode || "-",
        leaveTypeId: req.LeaveTypeId,
        leaveTypeName: req.LeaveTypeName || "Leave",
        startDate: req.StartDate,
        endDate: req.EndDate,
        days: req.Days || calculateDays(req.StartDate, req.EndDate),
        status: (req.Status || "Pending").toLowerCase(),
        rawStatus: req.Status || "Pending",
        reason: req.Reason || "-",
        comments: req.Comments || "-",
        appliedDate: req.AppliedDate || "-",
      }));

      setLeaveRequests(mapped);
      setLeaveTypes(typesPayload);
      setStats(statsPayload);
    } catch (error) {
      console.error("Failed to load leave data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadLeaveData();
  }, [role]);

  const filteredRequests = useMemo(() => {
    return leaveRequests.filter((r) => statusFilter === "all" || r.status === statusFilter);
  }, [leaveRequests, statusFilter]);

  const handleApplyLeave = async (e) => {
    e.preventDefault();
    if (!leaveForm.LeaveTypeId) {
      toast.error("Please select a leave type");
      return;
    }
    try {
      setIsSubmitting(true);
      await api.post("/leaves/apply", {
        LeaveTypeId: Number(leaveForm.LeaveTypeId),
        StartDate: leaveForm.StartDate,
        EndDate: leaveForm.EndDate,
        Reason: leaveForm.Reason,
      });
      toast.success("Leave application submitted successfully!");
      setIsCreateOpen(false);
      setLeaveForm({ LeaveTypeId: "", StartDate: "", EndDate: "", Reason: "" });
      await loadLeaveData();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to submit leave application");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelLeave = async (leaveId) => {
    try {
      await api.put(`/leaves/${leaveId}/cancel`, {});
      toast.success("Leave request cancelled successfully");
      await loadLeaveData();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to cancel leave request");
    }
  };

  const openDecisionModal = (req, action) => {
    setSelectedRequest(req);
    setDecisionAction(action);
    setDecisionComments("");
    setIsDecisionOpen(true);
  };

  const handleConfirmDecision = async () => {
    if (!selectedRequest) return;
    try {
      setIsSubmitting(true);
      await api.put(`/leaves/${selectedRequest.id}/status`, {
        Status: decisionAction,
        Comments: decisionComments,
      });
      toast.success(`Leave request ${decisionAction.toLowerCase()} successfully`);
      setIsDecisionOpen(false);
      await loadLeaveData();
    } catch (error) {
      toast.error(error?.response?.data?.message || `Failed to update leave request status`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExport = () => {
    try {
      const csvHeaders = ["Leave ID,Employee Name,Leave Type,Start Date,End Date,Days,Status,Reason,Comments"];
      const csvRows = leaveRequests.map((r) =>
        `"${r.id}","${r.employeeName}","${r.leaveTypeName}","${r.startDate}","${r.endDate}","${r.days}","${r.rawStatus}","${r.reason}","${r.comments}"`
      );
      const csvContent = "data:text/csv;charset=utf-8," + [csvHeaders, ...csvRows].join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `leave_report_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Leave report exported successfully!");
    } catch (error) {
      toast.error("Failed to export leave report");
    }
  };

  const getStatusBadge = (status) => {
    const s = String(status).toLowerCase();
    if (s === "approved") return <Badge className="bg-success/10 text-success border-success/20"><CheckCircle className="w-3 h-3 mr-1" /> Approved</Badge>;
    if (s === "rejected") return <Badge className="bg-destructive/10 text-destructive border-destructive/20"><XCircle className="w-3 h-3 mr-1" /> Rejected</Badge>;
    if (s === "cancelled") return <Badge variant="secondary"><Ban className="w-3 h-3 mr-1" /> Cancelled</Badge>;
    return <Badge className="bg-warning/10 text-warning border-warning/20"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Leave Management</h1>
          <p className="text-muted-foreground mt-1">Apply for leaves, track approvals, and view balance history</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleExport} title="Export leave requests to CSV">
            <Download className="w-4 h-4 mr-2" /> Export CSV
          </Button>

          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" /> Apply Leave
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Apply for Leave</DialogTitle>
                <DialogDescription>Submit a new leave application for approval.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleApplyLeave} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="leaveType">Leave Type</Label>
                  <Select
                    value={leaveForm.LeaveTypeId}
                    onValueChange={(val) => setLeaveForm({ ...leaveForm, LeaveTypeId: val })}
                  >
                    <SelectTrigger id="leaveType">
                      <SelectValue placeholder="Select leave type" />
                    </SelectTrigger>
                    <SelectContent>
                      {leaveTypes.map((type) => (
                        <SelectItem key={type.LeaveTypeId} value={String(type.LeaveTypeId)}>
                          {type.LeaveTypeName} ({type.MaxDays} Days Max)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      required
                      value={leaveForm.StartDate}
                      onChange={(e) => setLeaveForm({ ...leaveForm, StartDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      required
                      value={leaveForm.EndDate}
                      onChange={(e) => setLeaveForm({ ...leaveForm, EndDate: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reason">Reason for Leave</Label>
                  <textarea
                    id="reason"
                    rows={3}
                    required
                    placeholder="Provide a clear explanation for your leave..."
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    value={leaveForm.Reason}
                    onChange={(e) => setLeaveForm({ ...leaveForm, Reason: e.target.value })}
                  />
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit Application"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Leave Statistics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Approval</p>
                <h3 className="text-3xl font-bold mt-2 text-warning">{stats.pending}</h3>
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
                <p className="text-sm text-muted-foreground">Approved Leaves</p>
                <h3 className="text-3xl font-bold mt-2 text-success">{stats.approved}</h3>
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
                <p className="text-sm text-muted-foreground">Rejected Requests</p>
                <h3 className="text-3xl font-bold mt-2 text-destructive">{stats.rejected}</h3>
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
                <p className="text-sm text-muted-foreground">Total Applications</p>
                <h3 className="text-3xl font-bold mt-2 text-primary">{stats.total}</h3>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Leave Table Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{isAdminOrHR ? "All Employee Leave Requests" : "My Leave Applications"}</CardTitle>
              <CardDescription>Manage and review leave applications</CardDescription>
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
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
                <TableHead>Dates</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Comments</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    Loading leave requests...
                  </TableCell>
                </TableRow>
              ) : filteredRequests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No leave requests found for the selected status.
                  </TableCell>
                </TableRow>
              ) : (
                filteredRequests.map((req) => (
                  <TableRow key={req.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">
                            {req.employeeName.split(" ").map((n) => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-sm">{req.employeeName}</div>
                          <div className="text-xs text-muted-foreground">{req.employeeCode}</div>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge variant="outline" className="text-xs">{req.leaveTypeName}</Badge>
                    </TableCell>

                    <TableCell className="text-xs font-mono">
                      {req.startDate} to {req.endDate}
                    </TableCell>

                    <TableCell>
                      <Badge variant="secondary" className="text-xs">{req.days} days</Badge>
                    </TableCell>

                    <TableCell className="max-w-xs truncate text-xs">{req.reason}</TableCell>
                    <TableCell>{getStatusBadge(req.status)}</TableCell>
                    <TableCell className="max-w-xs truncate text-xs text-muted-foreground">{req.comments}</TableCell>

                    <TableCell className="text-right">
                      {req.status === "pending" && (
                        <div className="flex items-center gap-2 justify-end">
                          {isAdminOrHR ? (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-success border-success/30 hover:bg-success hover:text-white"
                                onClick={() => openDecisionModal(req, "Approved")}
                              >
                                <CheckCircle className="w-3.5 h-3.5 mr-1" /> Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-destructive border-destructive/30 hover:bg-destructive hover:text-white"
                                onClick={() => openDecisionModal(req, "Rejected")}
                              >
                                <XCircle className="w-3.5 h-3.5 mr-1" /> Reject
                              </Button>
                            </>
                          ) : (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-destructive hover:bg-destructive/10"
                              onClick={() => handleCancelLeave(req.id)}
                            >
                              <Ban className="w-3.5 h-3.5 mr-1" /> Cancel
                            </Button>
                          )}
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* HR Decision & Comments Modal */}
      <Dialog open={isDecisionOpen} onOpenChange={setIsDecisionOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {decisionAction === "Approved" ? "Approve Leave Application" : "Reject Leave Application"}
            </DialogTitle>
            <DialogDescription>
              Provide optional comments for <strong>{selectedRequest?.employeeName}</strong>.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="p-3 bg-muted/50 rounded-lg text-xs space-y-1">
              <div><strong>Leave Type:</strong> {selectedRequest?.leaveTypeName} ({selectedRequest?.days} days)</div>
              <div><strong>Dates:</strong> {selectedRequest?.startDate} to {selectedRequest?.endDate}</div>
              <div><strong>Reason:</strong> {selectedRequest?.reason}</div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="decisionComments">Decision Comments (Optional)</Label>
              <textarea
                id="decisionComments"
                rows={3}
                placeholder="Enter feedback or explanation..."
                className="flex min-h-[70px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={decisionComments}
                onChange={(e) => setDecisionComments(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDecisionOpen(false)}>
              Cancel
            </Button>
            <Button
              variant={decisionAction === "Approved" ? "default" : "destructive"}
              onClick={handleConfirmDecision}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Updating..." : `Confirm ${decisionAction}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

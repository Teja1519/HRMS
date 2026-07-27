import { useEffect, useState } from "react";
import { Megaphone, Plus, Edit, Trash2, Bell, AlertTriangle, Info, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../components/ui/select";
import api from "../lib/api";
import { toast } from "sonner";

export function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  const role = user?.Role || "Employee";
  const isAdminOrHr = role === "Admin" || role === "HR";

  const [form, setForm] = useState({
    Title: "",
    Message: "",
    Priority: "Normal",
    Audience: "All",
    DepartmentId: ""
  });

  const [editForm, setEditForm] = useState({
    NotificationId: "",
    Title: "",
    Message: "",
    Priority: "Normal",
    Audience: "All",
    DepartmentId: ""
  });

  const loadAnnouncements = async () => {
    try {
      setLoading(true);
      const response = await api.get("/notifications");
      setAnnouncements(response.data?.data ?? []);
    } catch (error) {
      console.error("Failed to load announcements", error);
      setAnnouncements([]);
    } finally {
      setLoading(false);
    }
  };

  const loadDepartments = async () => {
    try {
      const response = await api.get("/departments");
      setDepartments(response.data?.data ?? []);
    } catch (error) {
      console.error("Failed to load departments", error);
      setDepartments([]);
    }
  };

  useEffect(() => {
    void loadAnnouncements();
    void loadDepartments();
  }, []);

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const payload = {
        ...form,
        DepartmentId: form.Audience === "Department" && form.DepartmentId ? Number(form.DepartmentId) : null
      };
      await api.post("/notifications", payload);
      toast.success("Announcement published successfully!");
      setIsCreateOpen(false);
      setForm({ Title: "", Message: "", Priority: "Normal", Audience: "All", DepartmentId: "" });
      await loadAnnouncements();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to publish announcement");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditModal = (item) => {
    setEditForm({
      NotificationId: item.NotificationId,
      Title: item.Title || "",
      Message: item.Message || "",
      Priority: item.Priority || "Normal",
      Audience: item.Audience || "All",
      DepartmentId: item.DepartmentId ? String(item.DepartmentId) : ""
    });
    setIsEditOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const payload = {
        ...editForm,
        DepartmentId: editForm.Audience === "Department" && editForm.DepartmentId ? Number(editForm.DepartmentId) : null
      };
      await api.put(`/notifications/${editForm.NotificationId}`, payload);
      toast.success("Announcement updated successfully!");
      setIsEditOpen(false);
      await loadAnnouncements();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update announcement");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this announcement?")) return;
    try {
      await api.delete(`/notifications/${id}`);
      toast.success("Announcement deleted successfully!");
      await loadAnnouncements();
    } catch (error) {
      toast.error("Failed to delete announcement");
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      await loadAnnouncements();
    } catch (error) {
      console.error(error);
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "Urgent":
        return <Badge className="bg-destructive/10 text-destructive border-destructive/20"><AlertTriangle className="w-3 h-3 mr-1" />Urgent</Badge>;
      case "Important":
        return <Badge className="bg-warning/10 text-warning border-warning/20"><Info className="w-3 h-3 mr-1" />Important</Badge>;
      default:
        return <Badge variant="outline"><Bell className="w-3 h-3 mr-1" />Normal</Badge>;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Company Announcements</h1>
          <p className="text-muted-foreground mt-1">Stay updated with official news, policies, and company updates</p>
        </div>
        {isAdminOrHr && (
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Post Announcement
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Post Company Announcement</DialogTitle>
                <DialogDescription>Create a notification for all employees or specific departments.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" required value={form.Title} onChange={(e) => setForm({ ...form, Title: e.target.value })} placeholder="e.g. Quarterly Townhall Meeting" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message Content</Label>
                  <textarea
                    id="message"
                    required
                    rows={4}
                    className="flex min-h-[90px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none"
                    value={form.Message}
                    onChange={(e) => setForm({ ...form, Message: e.target.value })}
                    placeholder="Enter detailed notification details..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select value={form.Priority} onValueChange={(val) => setForm({ ...form, Priority: val })}>
                      <SelectTrigger id="priority"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Normal">Normal</SelectItem>
                        <SelectItem value="Important">Important</SelectItem>
                        <SelectItem value="Urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="audience">Audience</Label>
                    <Select value={form.Audience} onValueChange={(val) => setForm({ ...form, Audience: val })}>
                      <SelectTrigger id="audience"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All">All Employees</SelectItem>
                        <SelectItem value="Department">Specific Department</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {form.Audience === "Department" && (
                  <div className="space-y-2">
                    <Label htmlFor="departmentId">Target Department</Label>
                    <Select value={form.DepartmentId} onValueChange={(val) => setForm({ ...form, DepartmentId: val })}>
                      <SelectTrigger id="departmentId"><SelectValue placeholder="Select department" /></SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept.DepartmentId} value={String(dept.DepartmentId)}>{dept.DepartmentName}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Publishing..." : "Publish Now"}</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Announcement</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="editTitle">Title</Label>
              <Input id="editTitle" required value={editForm.Title} onChange={(e) => setEditForm({ ...editForm, Title: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editMessage">Message Content</Label>
              <textarea
                id="editMessage"
                required
                rows={4}
                className="flex min-h-[90px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none"
                value={editForm.Message}
                onChange={(e) => setEditForm({ ...editForm, Message: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="editPriority">Priority</Label>
                <Select value={editForm.Priority} onValueChange={(val) => setEditForm({ ...editForm, Priority: val })}>
                  <SelectTrigger id="editPriority"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Normal">Normal</SelectItem>
                    <SelectItem value="Important">Important</SelectItem>
                    <SelectItem value="Urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="editAudience">Audience</Label>
                <Select value={editForm.Audience} onValueChange={(val) => setEditForm({ ...editForm, Audience: val })}>
                  <SelectTrigger id="editAudience"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Employees</SelectItem>
                    <SelectItem value="Department">Specific Department</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {editForm.Audience === "Department" && (
              <div className="space-y-2">
                <Label htmlFor="editDepartmentId">Target Department</Label>
                <Select value={editForm.DepartmentId} onValueChange={(val) => setEditForm({ ...editForm, DepartmentId: val })}>
                  <SelectTrigger id="editDepartmentId"><SelectValue placeholder="Select department" /></SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.DepartmentId} value={String(dept.DepartmentId)}>{dept.DepartmentName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Save Changes"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <div className="space-y-4">
        {loading ? (
          <Card><CardContent className="p-8 text-center text-muted-foreground">Loading announcements...</CardContent></Card>
        ) : announcements.length === 0 ? (
          <Card><CardContent className="p-12 text-center text-muted-foreground">No announcements have been published yet.</CardContent></Card>
        ) : (
          announcements.map((item) => (
            <Card key={item.NotificationId} className={`transition-all ${!item.IsRead ? "border-primary/50 shadow-xs" : ""}`}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Megaphone className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg">{item.Title}</CardTitle>
                        {getPriorityBadge(item.Priority)}
                        {item.Audience === "Department" && (
                          <Badge variant="secondary">{item.Department?.DepartmentName || "Department"}</Badge>
                        )}
                      </div>
                      <CardDescription className="text-xs mt-1">
                        Posted on {new Date(item.CreatedAt || item.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                      </CardDescription>
                    </div>
                  </div>
                  {isAdminOrHr && (
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => openEditModal(item)}>
                        <Edit className="w-4 h-4 mr-1" />Edit
                      </Button>
                      <Button variant="outline" size="sm" className="text-destructive border-destructive" onClick={() => handleDelete(item.NotificationId)}>
                        <Trash2 className="w-4 h-4 mr-1" />Delete
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-2">
                <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{item.Message}</p>
                {!item.IsRead && (
                  <div className="mt-4 flex justify-end">
                    <Button variant="ghost" size="sm" onClick={() => handleMarkRead(item.NotificationId)} className="text-xs text-primary">
                      <CheckCircle2 className="w-4 h-4 mr-1" />Mark as Read
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

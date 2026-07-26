import { useEffect, useMemo, useState } from "react";
import { Search, Plus, Download, Mail, MapPin, MoreVertical, Edit, Trash2, Eye, Phone, Calendar, DollarSign, Shield } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "../components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "../components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../components/ui/select";
import { Card, CardContent } from "../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import api from "../lib/api";
import { toast } from "sonner";

const departmentColors = {
  Engineering: "bg-blue-100 text-blue-700 border-blue-200",
  Marketing: "bg-purple-100 text-purple-700 border-purple-200",
  Sales: "bg-green-100 text-green-700 border-green-200",
  HR: "bg-pink-100 text-pink-700 border-pink-200",
  Finance: "bg-yellow-100 text-yellow-700 border-yellow-200",
  Unassigned: "bg-slate-100 text-slate-700 border-slate-200"
};

const formatDate = (value) => {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
};

export function Employees() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, departmentFilter, statusFilter]);
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [viewEmployee, setViewEmployee] = useState(null);

  const [employeeForm, setEmployeeForm] = useState({
    EmployeeCode: "",
    FirstName: "",
    LastName: "",
    Email: "",
    Phone: "",
    DepartmentId: "",
    Designation: "",
    Salary: "",
    Status: "Active"
  });

  const [editForm, setEditForm] = useState({
    EmployeeId: "",
    EmployeeCode: "",
    FirstName: "",
    LastName: "",
    Email: "",
    Phone: "",
    DepartmentId: "",
    Designation: "",
    Salary: "",
    Status: "Active"
  });

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const response = await api.get("/employees");
      const payload = response.data?.data ?? [];
      const mappedEmployees = payload.map((employee) => ({
        id: `EMP-${employee.EmployeeId}`,
        dbId: employee.EmployeeId,
        name: `${employee.FirstName ?? ""} ${employee.LastName ?? ""}`.trim(),
        email: employee.Email ?? "-",
        phone: employee.Phone ?? "-",
        department: employee.Department?.DepartmentName ?? "Unassigned",
        position: employee.Designation ?? "-",
        status: employee.Status ?? "Active",
        joinDate: formatDate(employee.HireDate),
        location: employee.Address ?? "-",
        raw: employee
      }));
      setEmployees(mappedEmployees);
    } catch (error) {
      console.error("Failed to load employees", error);
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  const loadDepartments = async () => {
    try {
      const response = await api.get("/departments");
      const payload = response.data?.data ?? [];
      setDepartments(payload.map((department) => ({ 
        DepartmentId: department.DepartmentId, 
        DepartmentName: department.DepartmentName 
      })));
    } catch (error) {
      console.error("Failed to load departments", error);
      setDepartments([]);
    }
  };

  useEffect(() => {
    void loadEmployees();
    void loadDepartments();
  }, []);

  const handleCreateEmployee = async (event) => {
    event.preventDefault();
    try {
      setIsSubmitting(true);
      const payload = {
        ...employeeForm,
        DepartmentId: employeeForm.DepartmentId ? Number(employeeForm.DepartmentId) : null,
        Salary: employeeForm.Salary ? Number(employeeForm.Salary) : 0,
        HireDate: new Date().toISOString().slice(0, 10)
      };
      await api.post("/employees", payload);
      toast.success("Employee created successfully");
      setIsCreateOpen(false);
      setEmployeeForm({
        EmployeeCode: "",
        FirstName: "",
        LastName: "",
        Email: "",
        Phone: "",
        DepartmentId: "",
        Designation: "",
        Salary: "",
        Status: "Active"
      });
      await loadEmployees();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to create employee");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditDialog = (rawEmployee) => {
    setEditForm({
      EmployeeId: rawEmployee.EmployeeId,
      EmployeeCode: rawEmployee.EmployeeCode || "",
      FirstName: rawEmployee.FirstName || "",
      LastName: rawEmployee.LastName || "",
      Email: rawEmployee.Email || "",
      Phone: rawEmployee.Phone || "",
      DepartmentId: rawEmployee.DepartmentId ? String(rawEmployee.DepartmentId) : "",
      Designation: rawEmployee.Designation || "",
      Salary: rawEmployee.Salary || "",
      Status: rawEmployee.Status || "Active"
    });
    setIsEditOpen(true);
  };

  const openViewDialog = (rawEmployee) => {
    setViewEmployee(rawEmployee);
    setIsViewOpen(true);
  };

  const handleEditEmployee = async (event) => {
    event.preventDefault();
    try {
      setIsSubmitting(true);
      const payload = {
        ...editForm,
        DepartmentId: editForm.DepartmentId ? Number(editForm.DepartmentId) : null,
        Salary: editForm.Salary ? Number(editForm.Salary) : 0
      };
      await api.put(`/employees/${editForm.EmployeeId}`, payload);
      toast.success("Employee updated successfully");
      setIsEditOpen(false);
      await loadEmployees();
    } catch (error) {
      console.error("Failed to edit employee", error);
      toast.error(error?.response?.data?.message || "Failed to update employee");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteEmployee = async (dbId) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;
    try {
      await api.delete(`/employees/${dbId}`);
      toast.success("Employee deleted successfully");
      await loadEmployees();
    } catch (error) {
      console.error("Failed to delete employee", error);
      toast.error(error?.response?.data?.message || "Failed to delete employee");
    }
  };

  const handleExport = () => {
    try {
      const csvHeaders = ["Employee ID,Name,Email,Phone,Department,Designation,Status,Join Date,Location"];
      const csvRows = employees.map(emp => 
        `"${emp.id}","${emp.name}","${emp.email}","${emp.phone}","${emp.department}","${emp.position}","${emp.status}","${emp.joinDate}","${emp.location}"`
      );
      const csvContent = "data:text/csv;charset=utf-8," + [csvHeaders, ...csvRows].join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "employees_export.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Employees exported successfully!");
    } catch (error) {
      toast.error("Failed to export employees");
    }
  };

  const handleSendEmail = (email) => {
    if (email && email !== "-") {
      window.location.href = `mailto:${email}`;
    } else {
      toast.error("No email address found for this employee");
    }
  };

  const departmentOptions = useMemo(
    () => Array.from(new Set(employees.map((employee) => employee.department))).filter(Boolean),
    [employees]
  );

  const activeCount = employees.filter((employee) => employee.status === "Active").length;
  const onLeaveCount = employees.filter((employee) => employee.status === "On Leave").length;
  
  const newThisMonth = employees.filter((employee) => {
    if (!employee.joinDate || employee.joinDate === "N/A") return false;
    const joined = new Date(employee.joinDate);
    const now = new Date();
    return joined.getMonth() === now.getMonth() && joined.getFullYear() === now.getFullYear();
  }).length;

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          emp.email.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          emp.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = departmentFilter === "all" || emp.department === departmentFilter;
    const matchesStatus = statusFilter === "all" || emp.status === statusFilter;
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

  const paginatedEmployees = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredEmployees.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredEmployees, currentPage]);

  return <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Employee Management</h1>
          <p className="text-muted-foreground mt-1">Manage and view all employee information</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleExport} title="Export employees list to CSV">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Employee
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl">
              <DialogHeader>
                <DialogTitle>Add employee</DialogTitle>
                <DialogDescription>Create a new employee record and link it to the HR system.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateEmployee} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="employeeCode">Employee code</Label>
                    <Input id="employeeCode" required value={employeeForm.EmployeeCode} onChange={(event) => setEmployeeForm({ ...employeeForm, EmployeeCode: event.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" required value={employeeForm.Email} onChange={(event) => setEmployeeForm({ ...employeeForm, Email: event.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First name</Label>
                    <Input id="firstName" required value={employeeForm.FirstName} onChange={(event) => setEmployeeForm({ ...employeeForm, FirstName: event.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last name</Label>
                    <Input id="lastName" required value={employeeForm.LastName} onChange={(event) => setEmployeeForm({ ...employeeForm, LastName: event.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" value={employeeForm.Phone} onChange={(event) => setEmployeeForm({ ...employeeForm, Phone: event.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="designation">Designation</Label>
                    <Input id="designation" value={employeeForm.Designation} onChange={(event) => setEmployeeForm({ ...employeeForm, Designation: event.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="salary">Salary</Label>
                    <Input id="salary" type="number" min="0" value={employeeForm.Salary} onChange={(event) => setEmployeeForm({ ...employeeForm, Salary: event.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Select value={employeeForm.DepartmentId} onValueChange={(value) => setEmployeeForm({ ...employeeForm, DepartmentId: value })}>
                      <SelectTrigger id="department">
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((department) => <SelectItem key={department.DepartmentId} value={String(department.DepartmentId)}>
                            {department.DepartmentName}
                          </SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={employeeForm.Status} onValueChange={(value) => setEmployeeForm({ ...employeeForm, Status: value })}>
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                        <SelectItem value="Terminated">Terminated</SelectItem>
                        <SelectItem value="On Leave">On Leave</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Creating..." : "Create employee"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
            <DialogContent className="sm:max-w-xl">
              <DialogHeader>
                <DialogTitle>Edit employee</DialogTitle>
                <DialogDescription>Modify employee record details in the HR system.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleEditEmployee} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="editEmployeeCode">Employee code</Label>
                    <Input id="editEmployeeCode" required value={editForm.EmployeeCode} onChange={(event) => setEditForm({ ...editForm, EmployeeCode: event.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="editEmail">Email</Label>
                    <Input id="editEmail" type="email" required value={editForm.Email} onChange={(event) => setEditForm({ ...editForm, Email: event.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="editFirstName">First name</Label>
                    <Input id="editFirstName" required value={editForm.FirstName} onChange={(event) => setEditForm({ ...editForm, FirstName: event.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="editLastName">Last name</Label>
                    <Input id="editLastName" required value={editForm.LastName} onChange={(event) => setEditForm({ ...editForm, LastName: event.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="editPhone">Phone</Label>
                    <Input id="editPhone" value={editForm.Phone} onChange={(event) => setEditForm({ ...editForm, Phone: event.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="editDesignation">Designation</Label>
                    <Input id="editDesignation" value={editForm.Designation} onChange={(event) => setEditForm({ ...editForm, Designation: event.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="editSalary">Salary</Label>
                    <Input id="editSalary" type="number" min="0" value={editForm.Salary} onChange={(event) => setEditForm({ ...editForm, Salary: event.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="editDepartment">Department</Label>
                    <Select value={editForm.DepartmentId} onValueChange={(value) => setEditForm({ ...editForm, DepartmentId: value })}>
                      <SelectTrigger id="editDepartment">
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((department) => <SelectItem key={department.DepartmentId} value={String(department.DepartmentId)}>
                            {department.DepartmentName}
                          </SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="editStatus">Status</Label>
                    <Select value={editForm.Status} onValueChange={(value) => setEditForm({ ...editForm, Status: value })}>
                      <SelectTrigger id="editStatus">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                        <SelectItem value="Terminated">Terminated</SelectItem>
                        <SelectItem value="On Leave">On Leave</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Save changes"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Employee Profile Details</DialogTitle>
                <DialogDescription>Full structural record of the selected employee.</DialogDescription>
              </DialogHeader>
              {viewEmployee && (
                <div className="space-y-4 pt-2">
                  <div className="flex items-center gap-4 border-b border-border pb-4">
                    <Avatar className="w-14 h-14">
                      <AvatarFallback className="bg-primary/10 text-primary text-xl">
                        {`${viewEmployee.FirstName?.[0] ?? ""}${viewEmployee.LastName?.[0] ?? ""}`}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-semibold">{viewEmployee.FirstName} {viewEmployee.LastName}</h3>
                      <p className="text-sm text-muted-foreground">{viewEmployee.Designation || "No Designation"}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Shield className="w-4 h-4 shrink-0" />
                      <span>Code:</span>
                    </div>
                    <span className="font-mono">{viewEmployee.EmployeeCode}</span>

                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="w-4 h-4 shrink-0" />
                      <span>Email:</span>
                    </div>
                    <span className="truncate">{viewEmployee.Email}</span>

                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="w-4 h-4 shrink-0" />
                      <span>Phone:</span>
                    </div>
                    <span>{viewEmployee.Phone || "-"}</span>

                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Building2 className="w-4 h-4 shrink-0" />
                      <span>Department:</span>
                    </div>
                    <span>{viewEmployee.Department?.DepartmentName || "Unassigned"}</span>

                    <div className="flex items-center gap-2 text-muted-foreground">
                      <DollarSign className="w-4 h-4 shrink-0" />
                      <span>Salary:</span>
                    </div>
                    <span className="font-medium">{formatCurrency(viewEmployee.Salary || 0)}</span>

                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4 shrink-0" />
                      <span>Joined:</span>
                    </div>
                    <span>{formatDate(viewEmployee.HireDate)}</span>

                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4 shrink-0" />
                      <span>Location:</span>
                    </div>
                    <span>{viewEmployee.Address || "-"}</span>
                  </div>
                  <DialogFooter className="pt-2">
                    <Button type="button" onClick={() => setIsViewOpen(false)} className="w-full">
                      Close Profile
                    </Button>
                  </DialogFooter>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Total Employees</div>
            <div className="text-2xl font-bold mt-1">{employees.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Active</div>
            <div className="text-2xl font-bold mt-1 text-success">{activeCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">On Leave</div>
            <div className="text-2xl font-bold mt-1 text-warning">{onLeaveCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">New This Month</div>
            <div className="text-2xl font-bold mt-1 text-primary">{newThisMonth}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, or employee ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departmentOptions.map((department) => <SelectItem key={department} value={department}>
                    {department}
                  </SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
                <SelectItem value="On Leave">On Leave</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Employee ID</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    Loading employees...
                  </TableCell>
                </TableRow> : paginatedEmployees.length === 0 ? <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No employees available yet. Add employees from the database to populate this list.
                  </TableCell>
                </TableRow> : paginatedEmployees.map((employee) => <TableRow key={employee.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {employee.name.split(" ").map((n) => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{employee.name}</div>
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {employee.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-sm">{employee.id}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={departmentColors[employee.department] ?? departmentColors.Unassigned}>
                        {employee.department}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{employee.position}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        {employee.location}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={employee.status === "Active" ? "default" : "secondary"}
                        className={employee.status === "Active" ? "bg-success/10 text-success border-success/20" : "bg-warning/10 text-warning border-warning/20"}
                      >
                        {employee.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{employee.joinDate}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center gap-2 justify-end">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-primary border-primary hover:bg-primary hover:text-primary-foreground"
                          onClick={() => openEditDialog(employee.raw)}
                          title="Edit Employee"
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                          onClick={() => handleDeleteEmployee(employee.dbId)}
                          title="Delete Employee"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>)}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {filteredEmployees.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to {Math.min(filteredEmployees.length, currentPage * itemsPerPage)} of {filteredEmployees.length} employees
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          >
            Previous
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </Button>
          ))}
          <Button 
            variant="outline" 
            size="sm" 
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
          >
            Next
          </Button>
        </div>
      </div>
    </div>;
}

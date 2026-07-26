import { useEffect, useState } from "react";
import { Building2, Users, TrendingUp, Plus, Edit } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
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
import api from "../lib/api";
import { toast } from "sonner";

const departmentPalette = ["#2563EB", "#7C3AED", "#059669", "#D97706", "#DC2626"];

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    notation: "compact",
    maximumFractionDigits: 1
  }).format(amount);
};

export function Departments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [departmentForm, setDepartmentForm] = useState({ DepartmentName: "", Description: "" });
  
  const [editForm, setEditForm] = useState({ id: "", DepartmentName: "", Description: "" });

  const loadDepartments = async () => {
    try {
      setLoading(true);
      const response = await api.get("/departments");
      const payload = response.data?.data ?? [];
      const mappedDepartments = payload.map((department, index) => {
        const employeeCount = department.Employees?.length ?? 0;
        const budget = (department.Employees ?? []).reduce((sum, employee) => sum + Number(employee.Salary ?? 0), 0);
        return {
          id: department.DepartmentId,
          name: department.DepartmentName,
          headOfDepartment: department.Employees?.[0] ? `${department.Employees[0].FirstName ?? ""} ${department.Employees[0].LastName ?? ""}`.trim() : "Unassigned",
          employees: employeeCount,
          location: department.Location ?? "-",
          budget,
          color: departmentPalette[index % departmentPalette.length],
          growth: employeeCount > 0 ? "Active" : "No staff",
          raw: department
        };
      });
      setDepartments(mappedDepartments);
    } catch (error) {
      console.error("Failed to load departments", error);
      setDepartments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadDepartments();
  }, []);

  const handleCreateDepartment = async (event) => {
    event.preventDefault();
    try {
      setIsSubmitting(true);
      await api.post("/departments", departmentForm);
      toast.success("Department created successfully");
      setIsCreateOpen(false);
      setDepartmentForm({ DepartmentName: "", Description: "" });
      await loadDepartments();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to create department");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditDialog = (dept) => {
    setEditForm({
      id: dept.id,
      DepartmentName: dept.name,
      Description: dept.raw?.Description || ""
    });
    setIsEditOpen(true);
  };

  const handleEditDepartment = async (event) => {
    event.preventDefault();
    try {
      setIsSubmitting(true);
      await api.put(`/departments/${editForm.id}`, {
        DepartmentName: editForm.DepartmentName,
        Description: editForm.Description
      });
      toast.success("Department updated successfully");
      setIsEditOpen(false);
      await loadDepartments();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update department");
    } finally {
      setIsSubmitting(false);
    }
  };

  const pieChartData = departments.map((dept) => ({
    name: dept.name,
    value: dept.employees,
    color: dept.color
  }));

  const totalEmployees = departments.reduce((sum, dept) => sum + dept.employees, 0);
  const totalBudget = departments.reduce((sum, dept) => sum + dept.budget, 0);

  return <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Department Management</h1>
          <p className="text-muted-foreground mt-1">Manage departments and organizational structure</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Department
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Add department</DialogTitle>
                <DialogDescription>Create a new department and make it available in the organizational chart.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateDepartment} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="departmentName">Department name</Label>
                  <Input
                    id="departmentName"
                    required
                    value={departmentForm.DepartmentName}
                    onChange={(event) => setDepartmentForm({ ...departmentForm, DepartmentName: event.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="departmentDescription">Description</Label>
                  <textarea
                    id="departmentDescription"
                    rows={4}
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none"
                    value={departmentForm.Description}
                    onChange={(event) => setDepartmentForm({ ...departmentForm, Description: event.target.value })}
                  />
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Creating..." : "Create department"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Edit department</DialogTitle>
                <DialogDescription>Modify organizational unit name and structural description.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleEditDepartment} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="editDepartmentName">Department name</Label>
                  <Input
                    id="editDepartmentName"
                    required
                    value={editForm.DepartmentName}
                    onChange={(event) => setEditForm({ ...editForm, DepartmentName: event.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editDepartmentDescription">Description</Label>
                  <textarea
                    id="editDepartmentDescription"
                    rows={4}
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none"
                    value={editForm.Description}
                    onChange={(event) => setEditForm({ ...editForm, Description: event.target.value })}
                  />
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
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Departments</p>
                <h3 className="text-3xl font-bold mt-2">{departments.length}</h3>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Employees</p>
                <h3 className="text-3xl font-bold mt-2">{totalEmployees}</h3>
              </div>
              <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Budget</p>
                <h3 className="text-3xl font-bold mt-2">{formatCurrency(totalBudget)}</h3>
              </div>
              <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Employee Distribution by Department</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? <div className="flex h-[400px] items-center justify-center text-sm text-muted-foreground">Loading departments...</div> : pieChartData.length === 0 ? <div className="flex h-[400px] items-center justify-center text-sm text-muted-foreground">No department data is available yet.</div> : <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={130}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.length === 0 ? <div className="md:col-span-2 lg:col-span-3 rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
            No departments have been added yet. Add departments from the database to populate this section.
          </div> : departments.map((dept) => <Card key={dept.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${dept.color}15` }}>
                    <Building2 className="w-6 h-6" style={{ color: dept.color }} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{dept.name}</h3>
                    <p className="text-xs text-muted-foreground">{dept.location}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => openEditDialog(dept)}>
                  <Edit className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="text-xs" style={{ backgroundColor: `${dept.color}15`, color: dept.color }}>
                      {dept.headOfDepartment.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{dept.headOfDepartment}</p>
                    <p className="text-xs text-muted-foreground">Head of Department</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border">
                  <div>
                    <p className="text-xs text-muted-foreground">Employees</p>
                    <p className="text-xl font-bold mt-1">{dept.employees}</p>
                    <Badge className="mt-1 text-xs" style={{ backgroundColor: `${dept.color}15`, color: dept.color, border: `1px solid ${dept.color}30` }}>
                      {dept.growth}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Budget</p>
                    <p className="text-lg font-bold mt-1">{formatCurrency(dept.budget)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>)}
      </div>
    </div>;
}

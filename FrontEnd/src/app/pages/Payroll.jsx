import { useEffect, useMemo, useState } from "react";
import { DollarSign, Download, Send, FileText, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../components/ui/select";
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
import { Input } from "../components/ui/input";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import api from "../lib/api";
import { toast } from "sonner";

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR"
  }).format(amount);
};

export function Payroll() {
  const [payrollData, setPayrollData] = useState([]);
  const [employeesList, setEmployeesList] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [loading, setLoading] = useState(false);
  const [isProcessOpen, setIsProcessOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [processForm, setProcessForm] = useState({
    EmployeeId: "",
    PayrollMonth: "",
    BasicSalary: "",
    Allowances: "",
    Deductions: "",
    Bonus: ""
  });

  const loadPayroll = async () => {
    try {
      setLoading(true);
      const response = await api.get("/payroll");
      const payload = response.data?.data ?? [];
      const mappedPayroll = payload.map((record) => ({
        id: `PR-${record.PayrollId}`,
        name: record.Employee ? `${record.Employee.FirstName ?? ""} ${record.Employee.LastName ?? ""}`.trim() : "Unknown",
        department: record.Employee?.Department?.DepartmentName ?? "Unassigned",
        position: record.Employee?.Designation ?? "-",
        baseSalary: Number(record.BasicSalary ?? 0),
        allowances: Number(record.Allowances ?? 0),
        deductions: Number(record.Deductions ?? 0),
        netSalary: Number(record.NetSalary ?? 0),
        status: "processed",
        payrollMonth: record.PayrollMonth ?? ""
      }));
      setPayrollData(mappedPayroll);
    } catch (error) {
      console.error("Failed to load payroll data", error);
      setPayrollData([]);
    } finally {
      setLoading(false);
    }
  };

  const loadEmployees = async () => {
    try {
      const response = await api.get("/employees");
      const payload = response.data?.data ?? [];
      setEmployeesList(payload);
    } catch (error) {
      console.error("Failed to load employees list", error);
      setEmployeesList([]);
    }
  };

  useEffect(() => {
    void loadPayroll();
    void loadEmployees();
  }, []);

  const handleEmployeeChange = (employeeId) => {
    const emp = employeesList.find((e) => String(e.EmployeeId) === employeeId);
    setProcessForm((prev) => ({
      ...prev,
      EmployeeId: employeeId,
      BasicSalary: emp ? String(emp.Salary || 0) : ""
    }));
  };

  const handleProcessPayrollSubmit = async (event) => {
    event.preventDefault();
    try {
      setIsSubmitting(true);
      const payload = {
        EmployeeId: Number(processForm.EmployeeId),
        PayrollMonth: processForm.PayrollMonth,
        BasicSalary: Number(processForm.BasicSalary),
        Allowances: Number(processForm.Allowances || 0),
        Deductions: Number(processForm.Deductions || 0),
        Bonus: Number(processForm.Bonus || 0)
      };
      await api.post("/payroll", payload);
      toast.success("Payroll processed successfully!");
      setIsProcessOpen(false);
      setProcessForm({
        EmployeeId: "",
        PayrollMonth: "",
        BasicSalary: "",
        Allowances: "",
        Deductions: "",
        Bonus: ""
      });
      await loadPayroll();
    } catch (error) {
      console.error("Failed to process payroll", error);
      toast.error(error?.response?.data?.message || "Failed to process payroll");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredPayroll = useMemo(() => {
    if (selectedMonth === "all") return payrollData;
    return payrollData.filter((row) => row.payrollMonth === selectedMonth);
  }, [payrollData, selectedMonth]);

  const monthlyPayrollTrend = useMemo(() => {
    const grouped = new Map();
    payrollData.forEach((row) => {
      const amount = grouped.get(row.payrollMonth) ?? 0;
      grouped.set(row.payrollMonth, amount + row.netSalary);
    });
    return Array.from(grouped.entries()).map(([month, amount]) => ({ month, amount }));
  }, [payrollData]);

  const totalPayroll = filteredPayroll.reduce((sum, emp) => sum + emp.netSalary, 0);
  const processedCount = filteredPayroll.filter((emp) => emp.status === "processed").length;
  const pendingCount = filteredPayroll.filter((emp) => emp.status !== "processed").length;
  const totalGrossSalary = filteredPayroll.reduce((sum, emp) => sum + emp.baseSalary, 0);
  const totalDeductions = filteredPayroll.reduce((sum, emp) => sum + emp.deductions, 0);
  const averageSalary = filteredPayroll.length > 0 ? totalPayroll / filteredPayroll.length : 0;

  return <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Payroll Management</h1>
          <p className="text-muted-foreground mt-1">Manage employee salaries and payroll processing</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Payslips
          </Button>
          <Dialog open={isProcessOpen} onOpenChange={setIsProcessOpen}>
            <DialogTrigger asChild>
              <Button>
                <Send className="w-4 h-4 mr-2" />
                Process Payroll
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl">
              <DialogHeader>
                <DialogTitle>Process employee payroll</DialogTitle>
                <DialogDescription>Calculate and disburse payroll details for an employee.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleProcessPayrollSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="processEmployee">Employee</Label>
                    <Select value={processForm.EmployeeId} onValueChange={handleEmployeeChange}>
                      <SelectTrigger id="processEmployee">
                        <SelectValue placeholder="Select employee" />
                      </SelectTrigger>
                      <SelectContent>
                        {employeesList.map((emp) => <SelectItem key={emp.EmployeeId} value={String(emp.EmployeeId)}>
                            {emp.FirstName} {emp.LastName} ({emp.EmployeeCode})
                          </SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="payrollMonth">Payroll Month (YYYY-MM)</Label>
                    <Input id="payrollMonth" type="month" required value={processForm.PayrollMonth} onChange={(e) => setProcessForm({ ...processForm, PayrollMonth: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="basicSalary">Basic Salary</Label>
                    <Input id="basicSalary" type="number" required min="0" value={processForm.BasicSalary} onChange={(e) => setProcessForm({ ...processForm, BasicSalary: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="allowances">Allowances</Label>
                    <Input id="allowances" type="number" min="0" value={processForm.Allowances} onChange={(e) => setProcessForm({ ...processForm, Allowances: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="deductions">Deductions</Label>
                    <Input id="deductions" type="number" min="0" value={processForm.Deductions} onChange={(e) => setProcessForm({ ...processForm, Deductions: e.target.value })} />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="bonus">Bonus</Label>
                    <Input id="bonus" type="number" min="0" value={processForm.Bonus} onChange={(e) => setProcessForm({ ...processForm, Bonus: e.target.value })} />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsProcessOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Processing..." : "Calculate & Disburse"}
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
                <p className="text-sm text-muted-foreground">Total Payroll</p>
                <h3 className="text-2xl font-bold mt-2">{formatCurrency(totalPayroll)}</h3>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="w-4 h-4 text-success" />
                  <span className="text-sm text-success">+0.0%</span>
                  <span className="text-sm text-muted-foreground">vs last month</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Processed</p>
                <h3 className="text-3xl font-bold mt-2">{processedCount}</h3>
                <p className="text-sm text-success mt-1">Completed</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
                <FileText className="w-6 h-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <h3 className="text-3xl font-bold mt-2">{pendingCount}</h3>
                <p className="text-sm text-warning mt-1">Awaiting processing</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center">
                <FileText className="w-6 h-6 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Salary</p>
                <h3 className="text-2xl font-bold mt-2">{formatCurrency(averageSalary)}</h3>
                <p className="text-sm text-muted-foreground mt-1">Per employee</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-blue-700" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Payroll Trend</CardTitle>
        </CardHeader>
        <CardContent>
          {monthlyPayrollTrend.length === 0 ? <div className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">No payroll trend data is available yet.</div> : <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyPayrollTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="month" stroke="#64748B" />
                <YAxis stroke="#64748B" />
                <Tooltip formatter={(value) => formatCurrency(value)} contentStyle={{ backgroundColor: "#fff", border: "1px solid #E2E8F0" }} />
                <Bar dataKey="amount" fill="#2563EB" name="Payroll Amount" />
              </BarChart>
            </ResponsiveContainer>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Employee Payroll</CardTitle>
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Months</SelectItem>
                {Array.from(new Set(payrollData.map((row) => row.payrollMonth))).filter(Boolean).map((month) => <SelectItem key={month} value={month}>
                    {month}
                  </SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Position</TableHead>
                <TableHead className="text-right">Base Salary</TableHead>
                <TableHead className="text-right">Allowances</TableHead>
                <TableHead className="text-right">Deductions</TableHead>
                <TableHead className="text-right">Net Salary</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                    Loading payroll data...
                  </TableCell>
                </TableRow> : filteredPayroll.length === 0 ? <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                    No payroll records are available yet.
                  </TableCell>
                </TableRow> : filteredPayroll.map((employee) => <TableRow key={employee.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          {employee.name.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{employee.name}</div>
                        <div className="text-xs text-muted-foreground">{employee.id}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{employee.department}</Badge>
                  </TableCell>
                  <TableCell className="text-sm">{employee.position}</TableCell>
                  <TableCell className="text-right font-medium">{formatCurrency(employee.baseSalary)}</TableCell>
                  <TableCell className="text-right text-success">+{formatCurrency(employee.allowances)}</TableCell>
                  <TableCell className="text-right text-destructive">-{formatCurrency(employee.deductions)}</TableCell>
                  <TableCell className="text-right font-bold">{formatCurrency(employee.netSalary)}</TableCell>
                  <TableCell>
                    {employee.status === "processed" ? <Badge className="bg-success/10 text-success border-success/20">Processed</Badge> : <Badge className="bg-warning/10 text-warning border-warning/20">Pending</Badge>}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">
                      <FileText className="w-4 h-4 mr-1" />
                      Payslip
                    </Button>
                  </TableCell>
                </TableRow>)}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Salary Components Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-accent/50">
                <div>
                  <p className="text-sm font-medium">Base Salary</p>
                  <p className="text-xs text-muted-foreground mt-1">Fixed monthly salary</p>
                </div>
                <p className="text-lg font-bold">{formatCurrency(totalGrossSalary)}</p>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-accent/50">
                <div>
                  <p className="text-sm font-medium">Allowances</p>
                  <p className="text-xs text-muted-foreground mt-1">HRA, Transport, Medical</p>
                </div>
                <p className="text-lg font-bold text-success">{formatCurrency(filteredPayroll.reduce((sum, row) => sum + row.allowances, 0))}</p>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-accent/50">
                <div>
                  <p className="text-sm font-medium">Deductions</p>
                  <p className="text-xs text-muted-foreground mt-1">Tax, Insurance, PF</p>
                </div>
                <p className="text-lg font-bold text-destructive">{formatCurrency(totalDeductions)}</p>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-primary/10 border-2 border-primary/20">
                <div>
                  <p className="font-semibold">Net Payroll</p>
                  <p className="text-xs text-muted-foreground mt-1">Total disbursement</p>
                </div>
                <p className="text-2xl font-bold text-primary">{formatCurrency(totalPayroll)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payroll Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Total Employees</span>
                <span className="font-medium">{filteredPayroll.length}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Processed Payrolls</span>
                <span className="font-medium text-success">{processedCount}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Pending Payrolls</span>
                <span className="font-medium text-warning">{pendingCount}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Total Gross Salary</span>
                <span className="font-medium">{formatCurrency(totalGrossSalary)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Total Deductions</span>
                <span className="font-medium text-destructive">{formatCurrency(totalDeductions)}</span>
              </div>
              <div className="flex justify-between py-3 bg-primary/10 px-3 rounded-lg">
                <span className="font-semibold">Net Disbursement</span>
                <span className="font-bold text-primary">{formatCurrency(totalPayroll)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>;
}

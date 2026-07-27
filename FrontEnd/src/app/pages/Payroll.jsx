import { useEffect, useMemo, useState } from "react";
import { IndianRupee, Download, Send, FileText, TrendingUp, Printer } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useAuth } from "../../context/AuthContext";
import api from "../lib/api";
import { toast } from "sonner";

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount || 0);
};

export function Payroll() {
  const { role } = useAuth();
  const isAdminOrHR = role === "Admin" || role === "HR" || role === "Manager";

  const [payrollData, setPayrollData] = useState([]);
  const [employeesList, setEmployeesList] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [loading, setLoading] = useState(false);
  const [isProcessOpen, setIsProcessOpen] = useState(false);
  const [isPayslipOpen, setIsPayslipOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedPayslip, setSelectedPayslip] = useState(null);

  const [processForm, setProcessForm] = useState({
    EmployeeId: "",
    PayrollMonth: new Date().toISOString().slice(0, 7),
    BasicSalary: "0",
    HRA: "0",
    Allowances: "0",
    Bonus: "0",
    PF: "0",
    Tax: "0",
    Deductions: "0",
  });

  const loadPayroll = async () => {
    try {
      setLoading(true);
      const endpoint = isAdminOrHR ? "/payroll" : "/payroll/my-payroll";
      const response = await api.get(endpoint);
      const payload = response.data?.data ?? [];
      
      const mapped = payload.map((rec) => ({
        id: `PR-${rec.PayrollId}`,
        dbId: rec.PayrollId,
        name: rec.EmployeeName || "Unknown",
        employeeCode: rec.EmployeeCode || "-",
        department: rec.DepartmentName || "Unassigned",
        position: rec.Designation || "Employee",
        basicSalary: Number(rec.BasicSalary || 0),
        hra: Number(rec.HRA || 0),
        allowances: Number(rec.Allowances || 0),
        bonus: Number(rec.Bonus || 0),
        grossSalary: Number(rec.GrossSalary || 0),
        pf: Number(rec.PF || 0),
        tax: Number(rec.Tax || 0),
        deductions: Number(rec.Deductions || 0),
        totalDeductions: Number(rec.TotalDeductions || 0),
        netSalary: Number(rec.NetSalary || 0),
        status: "processed",
        payrollMonth: rec.PayrollMonth || "-",
        raw: rec,
      }));

      setPayrollData(mapped);
    } catch (error) {
      console.error("Failed to load payroll data", error);
      setPayrollData([]);
    } finally {
      setLoading(false);
    }
  };

  const loadEmployees = async () => {
    if (!isAdminOrHR) return;
    try {
      const response = await api.get("/employees");
      setEmployeesList(response.data?.data ?? []);
    } catch (error) {
      console.error("Failed to load employees list", error);
    }
  };

  useEffect(() => {
    void loadPayroll();
    void loadEmployees();
  }, [role]);

  const handleEmployeeChange = (empId) => {
    const emp = employeesList.find((e) => String(e.EmployeeId) === empId);
    if (emp) {
      const basic = Number(emp.Salary || 0);
      const hra = Math.round(basic * 0.4 * 100) / 100; // Standard 40% HRA
      const pf = Math.round(basic * 0.12 * 100) / 100; // Standard 12% PF
      setProcessForm((prev) => ({
        ...prev,
        EmployeeId: empId,
        BasicSalary: String(basic),
        HRA: String(hra),
        Allowances: "0",
        Bonus: "0",
        PF: String(pf),
        Tax: "0",
        Deductions: "0",
      }));
    } else {
      setProcessForm((prev) => ({ ...prev, EmployeeId: empId }));
    }
  };

  // Real-time Calculation for Form Preview
  const formCalculations = useMemo(() => {
    const basic = Number(processForm.BasicSalary) || 0;
    const hra = Number(processForm.HRA) || 0;
    const allowances = Number(processForm.Allowances) || 0;
    const bonus = Number(processForm.Bonus) || 0;

    const pf = Number(processForm.PF) || 0;
    const tax = Number(processForm.Tax) || 0;
    const deductions = Number(processForm.Deductions) || 0;

    const gross = Math.round((basic + hra + allowances + bonus) * 100) / 100;
    const totalDeductions = Math.round((pf + tax + deductions) * 100) / 100;
    const net = Math.round((gross - totalDeductions) * 100) / 100;

    return { gross, totalDeductions, net };
  }, [processForm]);

  const handleProcessPayrollSubmit = async (e) => {
    e.preventDefault();
    if (!processForm.EmployeeId) {
      toast.error("Please select an employee");
      return;
    }
    try {
      setIsSubmitting(true);
      await api.post("/payroll", {
        EmployeeId: Number(processForm.EmployeeId),
        PayrollMonth: processForm.PayrollMonth,
        BasicSalary: Number(processForm.BasicSalary),
        HRA: Number(processForm.HRA),
        Allowances: Number(processForm.Allowances),
        Bonus: Number(processForm.Bonus),
        PF: Number(processForm.PF),
        Tax: Number(processForm.Tax),
        Deductions: Number(processForm.Deductions),
      });

      toast.success("Payroll processed successfully!");
      setIsProcessOpen(false);
      await loadPayroll();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to process payroll");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExportPayslips = () => {
    try {
      const csvHeaders = ["Payroll ID,Employee Name,Department,Month,Basic,HRA,Allowances,Bonus,Gross,PF,Tax,Deductions,Net Salary"];
      const csvRows = filteredPayroll.map((r) =>
        `"${r.id}","${r.name}","${r.department}","${r.payrollMonth}","${r.basicSalary}","${r.hra}","${r.allowances}","${r.bonus}","${r.grossSalary}","${r.pf}","${r.tax}","${r.deductions}","${r.netSalary}"`
      );
      const csvContent = "data:text/csv;charset=utf-8," + [csvHeaders, ...csvRows].join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `payroll_report_${selectedMonth}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Payroll report exported successfully!");
    } catch (error) {
      toast.error("Failed to export payroll report");
    }
  };

  const openPayslipDialog = (record) => {
    setSelectedPayslip(record);
    setIsPayslipOpen(true);
  };

  const handlePrintPayslip = () => {
    window.print();
  };

  const filteredPayroll = useMemo(() => {
    if (selectedMonth === "all") return payrollData;
    return payrollData.filter((row) => row.payrollMonth === selectedMonth);
  }, [payrollData, selectedMonth]);

  const monthlyPayrollTrend = useMemo(() => {
    const map = new Map();
    payrollData.forEach((row) => {
      const amt = map.get(row.payrollMonth) || 0;
      map.set(row.payrollMonth, Math.round((amt + row.netSalary) * 100) / 100);
    });
    return Array.from(map.entries()).map(([month, amount]) => ({ month, amount }));
  }, [payrollData]);

  const totalPayroll = filteredPayroll.reduce((sum, r) => sum + r.netSalary, 0);
  const totalGrossSalary = filteredPayroll.reduce((sum, r) => sum + r.grossSalary, 0);
  const totalDeductionsSum = filteredPayroll.reduce((sum, r) => sum + r.totalDeductions, 0);
  const averageSalary = filteredPayroll.length > 0 ? totalPayroll / filteredPayroll.length : 0;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Payroll Management</h1>
          <p className="text-muted-foreground mt-1">Salary disbursement, component breakdowns, and printable payslips</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleExportPayslips} title="Export payroll report CSV">
            <Download className="w-4 h-4 mr-2" /> Export CSV
          </Button>

          {isAdminOrHR && (
            <Dialog open={isProcessOpen} onOpenChange={setIsProcessOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Send className="w-4 h-4 mr-2" /> Process Payroll
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Process Monthly Payroll</DialogTitle>
                  <DialogDescription>Calculate earnings and deductions for an employee salary slip.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleProcessPayrollSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="processEmployee">Select Employee</Label>
                      <Select value={processForm.EmployeeId} onValueChange={handleEmployeeChange}>
                        <SelectTrigger id="processEmployee">
                          <SelectValue placeholder="Choose employee" />
                        </SelectTrigger>
                        <SelectContent>
                          {employeesList.map((emp) => (
                            <SelectItem key={emp.EmployeeId} value={String(emp.EmployeeId)}>
                              {emp.FirstName} {emp.LastName} ({emp.EmployeeCode})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="payrollMonth">Payroll Month (YYYY-MM)</Label>
                      <Input
                        id="payrollMonth"
                        type="month"
                        required
                        value={processForm.PayrollMonth}
                        onChange={(e) => setProcessForm({ ...processForm, PayrollMonth: e.target.value })}
                      />
                    </div>

                    {/* Earnings Group */}
                    <div className="md:col-span-2 space-y-3 p-3 bg-success/5 border border-success/20 rounded-lg">
                      <h4 className="text-xs font-semibold text-success uppercase tracking-wider">Gross Earnings (+)</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label htmlFor="basicSalary" className="text-xs">Basic Salary (₹)</Label>
                          <Input id="basicSalary" type="number" step="0.01" min="0" value={processForm.BasicSalary} onChange={(e) => setProcessForm({ ...processForm, BasicSalary: e.target.value })} />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="hra" className="text-xs">HRA (₹)</Label>
                          <Input id="hra" type="number" step="0.01" min="0" value={processForm.HRA} onChange={(e) => setProcessForm({ ...processForm, HRA: e.target.value })} />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="allowances" className="text-xs">Other Allowances (₹)</Label>
                          <Input id="allowances" type="number" step="0.01" min="0" value={processForm.Allowances} onChange={(e) => setProcessForm({ ...processForm, Allowances: e.target.value })} />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="bonus" className="text-xs">Bonus (₹)</Label>
                          <Input id="bonus" type="number" step="0.01" min="0" value={processForm.Bonus} onChange={(e) => setProcessForm({ ...processForm, Bonus: e.target.value })} />
                        </div>
                      </div>
                      <div className="text-right text-xs font-semibold text-success pt-1">
                        Gross Salary: {formatCurrency(formCalculations.gross)}
                      </div>
                    </div>

                    {/* Deductions Group */}
                    <div className="md:col-span-2 space-y-3 p-3 bg-destructive/5 border border-destructive/20 rounded-lg">
                      <h4 className="text-xs font-semibold text-destructive uppercase tracking-wider">Total Deductions (-)</h4>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <Label htmlFor="pf" className="text-xs">Provident Fund / PF (₹)</Label>
                          <Input id="pf" type="number" step="0.01" min="0" value={processForm.PF} onChange={(e) => setProcessForm({ ...processForm, PF: e.target.value })} />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="tax" className="text-xs">Income Tax / TDS (₹)</Label>
                          <Input id="tax" type="number" step="0.01" min="0" value={processForm.Tax} onChange={(e) => setProcessForm({ ...processForm, Tax: e.target.value })} />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="deductions" className="text-xs">Other Deductions (₹)</Label>
                          <Input id="deductions" type="number" step="0.01" min="0" value={processForm.Deductions} onChange={(e) => setProcessForm({ ...processForm, Deductions: e.target.value })} />
                        </div>
                      </div>
                      <div className="text-right text-xs font-semibold text-destructive pt-1">
                        Total Deductions: {formatCurrency(formCalculations.totalDeductions)}
                      </div>
                    </div>

                    {/* Net Salary Preview */}
                    <div className="md:col-span-2 p-4 bg-primary/10 border-2 border-primary/20 rounded-lg flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground uppercase font-semibold">Net Payable Salary</p>
                        <p className="text-2xl font-bold text-primary">{formatCurrency(formCalculations.net)}</p>
                      </div>
                      <Badge className="bg-primary text-white">Calculated</Badge>
                    </div>
                  </div>

                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsProcessOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Processing..." : "Disburse Salary"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          )}

          {/* Detailed Printable Salary Slip Dialog */}
          <Dialog open={isPayslipOpen} onOpenChange={setIsPayslipOpen}>
            <DialogContent className="sm:max-w-lg print:max-w-full">
              <DialogHeader>
                <DialogTitle className="print:hidden">Official Salary Slip Statement</DialogTitle>
                <DialogDescription className="print:hidden">Complete earnings and deductions statement.</DialogDescription>
              </DialogHeader>
              {selectedPayslip && (
                <div className="space-y-5 pt-2 print:p-6 text-foreground">
                  <div className="text-center pb-4 border-b border-border space-y-1">
                    <h2 className="text-xl font-bold tracking-tight text-primary">HRMS ENTERPRISE PORTAL</h2>
                    <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">
                      Salary Slip for {selectedPayslip.payrollMonth}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-y-1.5 text-xs border-b border-border pb-4">
                    <div><span className="text-muted-foreground">Employee Name:</span> <strong className="ml-1">{selectedPayslip.name}</strong></div>
                    <div><span className="text-muted-foreground">Employee Code:</span> <span className="font-mono ml-1">{selectedPayslip.employeeCode}</span></div>
                    <div><span className="text-muted-foreground">Department:</span> <span className="ml-1">{selectedPayslip.department}</span></div>
                    <div><span className="text-muted-foreground">Designation:</span> <span className="ml-1">{selectedPayslip.position}</span></div>
                  </div>

                  {/* Detailed Earnings & Deductions Grid */}
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    {/* Earnings Breakdown */}
                    <div className="space-y-2 p-3 bg-success/5 border border-success/20 rounded-lg">
                      <h4 className="font-bold text-success border-b border-success/20 pb-1">Earnings Amount (₹)</h4>
                      <div className="flex justify-between"><span>Basic Salary:</span> <span>{formatCurrency(selectedPayslip.basicSalary)}</span></div>
                      <div className="flex justify-between"><span>HRA:</span> <span>{formatCurrency(selectedPayslip.hra)}</span></div>
                      <div className="flex justify-between"><span>Allowances:</span> <span>{formatCurrency(selectedPayslip.allowances)}</span></div>
                      <div className="flex justify-between"><span>Bonus:</span> <span>{formatCurrency(selectedPayslip.bonus)}</span></div>
                      <div className="flex justify-between font-bold pt-2 border-t border-success/20 text-success">
                        <span>Gross Earnings:</span> <span>{formatCurrency(selectedPayslip.grossSalary)}</span>
                      </div>
                    </div>

                    {/* Deductions Breakdown */}
                    <div className="space-y-2 p-3 bg-destructive/5 border border-destructive/20 rounded-lg">
                      <h4 className="font-bold text-destructive border-b border-destructive/20 pb-1">Deductions Amount (₹)</h4>
                      <div className="flex justify-between"><span>Provident Fund (PF):</span> <span>{formatCurrency(selectedPayslip.pf)}</span></div>
                      <div className="flex justify-between"><span>Income Tax (TDS):</span> <span>{formatCurrency(selectedPayslip.tax)}</span></div>
                      <div className="flex justify-between"><span>Other Deductions:</span> <span>{formatCurrency(selectedPayslip.deductions)}</span></div>
                      <div className="flex justify-between font-bold pt-2 border-t border-destructive/20 text-destructive">
                        <span>Total Deductions:</span> <span>{formatCurrency(selectedPayslip.totalDeductions)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center bg-primary/10 p-4 rounded-lg border-2 border-primary/20">
                    <div>
                      <span className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Net Amount Disbursed</span>
                      <p className="text-2xl font-bold text-primary">{formatCurrency(selectedPayslip.netSalary)}</p>
                    </div>
                    <Badge className="bg-success text-white">Paid & Verified</Badge>
                  </div>

                  <DialogFooter className="pt-2 print:hidden">
                    <Button type="button" variant="outline" onClick={handlePrintPayslip}>
                      <Printer className="w-4 h-4 mr-2" /> Print Payslip
                    </Button>
                    <Button type="button" onClick={() => setIsPayslipOpen(false)}>
                      Close Statement
                    </Button>
                  </DialogFooter>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Net Payroll</p>
                <h3 className="text-2xl font-bold mt-2 text-primary">{formatCurrency(totalPayroll)}</h3>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <IndianRupee className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Gross Earnings</p>
                <h3 className="text-2xl font-bold mt-2 text-success">{formatCurrency(totalGrossSalary)}</h3>
              </div>
              <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Deductions</p>
                <h3 className="text-2xl font-bold mt-2 text-destructive">{formatCurrency(totalDeductionsSum)}</h3>
              </div>
              <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                <FileText className="w-6 h-6 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Average Net Salary</p>
                <h3 className="text-2xl font-bold mt-2">{formatCurrency(averageSalary)}</h3>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <IndianRupee className="w-6 h-6 text-blue-700" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Payroll Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Disbursement Trend</CardTitle>
        </CardHeader>
        <CardContent>
          {monthlyPayrollTrend.length === 0 ? (
            <div className="flex h-[250px] items-center justify-center text-sm text-muted-foreground border border-dashed rounded-lg">
              No payroll trend data logged yet.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={monthlyPayrollTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="month" stroke="#64748B" />
                <YAxis stroke="#64748B" />
                <Tooltip formatter={(val) => formatCurrency(val)} contentStyle={{ backgroundColor: "#fff", border: "1px solid #E2E8F0" }} />
                <Bar dataKey="amount" fill="#2563EB" name="Net Payroll (₹)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Main Payroll Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{isAdminOrHR ? "Company Payroll Ledger" : "My Payslips & Salary Slips"}</CardTitle>
              <CardDescription>Detailed salary breakdown and salary slip generator</CardDescription>
            </div>
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Months</SelectItem>
                {Array.from(new Set(payrollData.map((row) => row.payrollMonth))).filter(Boolean).map((m) => (
                  <SelectItem key={m} value={m}>{m}</SelectItem>
                ))}
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
                <TableHead>Month</TableHead>
                <TableHead className="text-right">Gross Salary</TableHead>
                <TableHead className="text-right">PF & Deductions</TableHead>
                <TableHead className="text-right">Net Salary</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    Loading payroll data...
                  </TableCell>
                </TableRow>
              ) : filteredPayroll.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No payroll records found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredPayroll.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">
                            {item.name.split(" ").map((n) => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-sm">{item.name}</div>
                          <div className="text-xs text-muted-foreground">{item.employeeCode}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell><Badge variant="outline" className="text-xs">{item.department}</Badge></TableCell>
                    <TableCell className="text-xs font-mono">{item.payrollMonth}</TableCell>
                    <TableCell className="text-right font-medium text-xs text-success">{formatCurrency(item.grossSalary)}</TableCell>
                    <TableCell className="text-right font-medium text-xs text-destructive">-{formatCurrency(item.totalDeductions)}</TableCell>
                    <TableCell className="text-right font-bold text-sm text-primary">{formatCurrency(item.netSalary)}</TableCell>
                    <TableCell><Badge className="bg-success/10 text-success border-success/20 text-xs">Processed</Badge></TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => openPayslipDialog(item)}>
                        <FileText className="w-3.5 h-3.5 mr-1" /> Payslip
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

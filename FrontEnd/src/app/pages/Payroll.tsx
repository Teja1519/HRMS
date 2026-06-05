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
  TableRow,
} from "../components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const payrollData = [
  {
    id: "EMP001",
    name: "John Doe",
    department: "Engineering",
    position: "Senior Software Engineer",
    baseSalary: 95000,
    allowances: 5000,
    deductions: 8500,
    netSalary: 91500,
    status: "processed",
  },
  {
    id: "EMP002",
    name: "Jane Smith",
    department: "Marketing",
    position: "Marketing Manager",
    baseSalary: 85000,
    allowances: 4000,
    deductions: 7500,
    netSalary: 81500,
    status: "processed",
  },
  {
    id: "EMP003",
    name: "Mike Johnson",
    department: "Sales",
    position: "Sales Executive",
    baseSalary: 65000,
    allowances: 3000,
    deductions: 6000,
    netSalary: 62000,
    status: "pending",
  },
  {
    id: "EMP004",
    name: "Sarah Wilson",
    department: "HR",
    position: "HR Manager",
    baseSalary: 80000,
    allowances: 4000,
    deductions: 7200,
    netSalary: 76800,
    status: "processed",
  },
];

const monthlyPayrollTrend = [
  { month: "Jan", amount: 420000 },
  { month: "Feb", amount: 435000 },
  { month: "Mar", amount: 455000 },
  { month: "Apr", amount: 470000 },
  { month: "May", amount: 485000 },
  { month: "Jun", amount: 502000 },
];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

export function Payroll() {
  const totalPayroll = payrollData.reduce((sum, emp) => sum + emp.netSalary, 0);
  const processedCount = payrollData.filter(emp => emp.status === "processed").length;
  const pendingCount = payrollData.filter(emp => emp.status === "pending").length;

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Payroll Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage employee salaries and payroll processing
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Payslips
          </Button>
          <Button>
            <Send className="w-4 h-4 mr-2" />
            Process Payroll
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Payroll</p>
                <h3 className="text-2xl font-bold mt-2">{formatCurrency(totalPayroll)}</h3>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="w-4 h-4 text-success" />
                  <span className="text-sm text-success">+3.5%</span>
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
                <h3 className="text-2xl font-bold mt-2">
                  {formatCurrency(totalPayroll / payrollData.length)}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">Per employee</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-blue-700" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payroll Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Payroll Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyPayrollTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="month" stroke="#64748B" />
              <YAxis stroke="#64748B" />
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{ backgroundColor: "#fff", border: "1px solid #E2E8F0" }}
              />
              <Bar dataKey="amount" fill="#2563EB" name="Payroll Amount" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Employee Payroll Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Employee Payroll</CardTitle>
            <Select defaultValue="june">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="june">June 2026</SelectItem>
                <SelectItem value="may">May 2026</SelectItem>
                <SelectItem value="april">April 2026</SelectItem>
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
              {payrollData.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          {employee.name.split(" ").map(n => n[0]).join("")}
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
                  <TableCell className="text-right font-medium">
                    {formatCurrency(employee.baseSalary)}
                  </TableCell>
                  <TableCell className="text-right text-success">
                    +{formatCurrency(employee.allowances)}
                  </TableCell>
                  <TableCell className="text-right text-destructive">
                    -{formatCurrency(employee.deductions)}
                  </TableCell>
                  <TableCell className="text-right font-bold">
                    {formatCurrency(employee.netSalary)}
                  </TableCell>
                  <TableCell>
                    {employee.status === "processed" ? (
                      <Badge className="bg-success/10 text-success border-success/20">
                        Processed
                      </Badge>
                    ) : (
                      <Badge className="bg-warning/10 text-warning border-warning/20">
                        Pending
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">
                      <FileText className="w-4 h-4 mr-1" />
                      Payslip
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Salary Breakdown */}
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
                <p className="text-lg font-bold">{formatCurrency(325000)}</p>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-accent/50">
                <div>
                  <p className="text-sm font-medium">Allowances</p>
                  <p className="text-xs text-muted-foreground mt-1">HRA, Transport, Medical</p>
                </div>
                <p className="text-lg font-bold text-success">{formatCurrency(16000)}</p>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-accent/50">
                <div>
                  <p className="text-sm font-medium">Deductions</p>
                  <p className="text-xs text-muted-foreground mt-1">Tax, Insurance, PF</p>
                </div>
                <p className="text-lg font-bold text-destructive">{formatCurrency(29200)}</p>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-primary/10 border-2 border-primary/20">
                <div>
                  <p className="font-semibold">Net Payroll</p>
                  <p className="text-xs text-muted-foreground mt-1">Total disbursement</p>
                </div>
                <p className="text-2xl font-bold text-primary">{formatCurrency(311800)}</p>
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
                <span className="font-medium">502</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Processed Payrolls</span>
                <span className="font-medium text-success">498</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Pending Payrolls</span>
                <span className="font-medium text-warning">4</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Total Gross Salary</span>
                <span className="font-medium">{formatCurrency(341000)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Total Deductions</span>
                <span className="font-medium text-destructive">{formatCurrency(29200)}</span>
              </div>
              <div className="flex justify-between py-3 bg-primary/10 px-3 rounded-lg">
                <span className="font-semibold">Net Disbursement</span>
                <span className="font-bold text-primary">{formatCurrency(311800)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { Building2, Users, TrendingUp, Plus, Edit } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const departments = [
  {
    id: 1,
    name: "Engineering",
    headOfDepartment: "Michael Chen",
    employees: 150,
    location: "New York",
    budget: 15000000,
    color: "#2563EB",
    growth: "+8.2%",
  },
  {
    id: 2,
    name: "Marketing",
    headOfDepartment: "Sarah Johnson",
    employees: 45,
    location: "San Francisco",
    budget: 3500000,
    color: "#8B5CF6",
    growth: "+5.1%",
  },
  {
    id: 3,
    name: "Sales",
    headOfDepartment: "David Williams",
    employees: 80,
    location: "Chicago",
    budget: 5000000,
    color: "#22C55E",
    growth: "+12.3%",
  },
  {
    id: 4,
    name: "HR",
    headOfDepartment: "Emily Davis",
    employees: 25,
    location: "New York",
    budget: 2000000,
    color: "#EC4899",
    growth: "+2.5%",
  },
  {
    id: 5,
    name: "Finance",
    headOfDepartment: "Robert Brown",
    employees: 35,
    location: "Boston",
    budget: 2800000,
    color: "#F59E0B",
    growth: "+3.8%",
  },
  {
    id: 6,
    name: "Operations",
    headOfDepartment: "Lisa Martinez",
    employees: 65,
    location: "Austin",
    budget: 4200000,
    color: "#06B6D4",
    growth: "+6.7%",
  },
  {
    id: 7,
    name: "Customer Support",
    headOfDepartment: "James Anderson",
    employees: 55,
    location: "Seattle",
    budget: 3000000,
    color: "#EF4444",
    growth: "+4.2%",
  },
  {
    id: 8,
    name: "Product",
    headOfDepartment: "Jennifer Lee",
    employees: 42,
    location: "San Francisco",
    budget: 4500000,
    color: "#10B981",
    growth: "+9.5%",
  },
];

const pieChartData = departments.map(dept => ({
  name: dept.name,
  value: dept.employees,
  color: dept.color,
}));

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(amount);
};

export function Departments() {
  const totalEmployees = departments.reduce((sum, dept) => sum + dept.employees, 0);
  const totalBudget = departments.reduce((sum, dept) => sum + dept.budget, 0);

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Department Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage departments and organizational structure
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Department
        </Button>
      </div>

      {/* Stats Cards */}
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

      {/* Department Distribution Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Employee Distribution by Department</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
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
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Department Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((dept) => (
          <Card key={dept.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${dept.color}15` }}
                  >
                    <Building2 className="w-6 h-6" style={{ color: dept.color }} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{dept.name}</h3>
                    <p className="text-xs text-muted-foreground">{dept.location}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <Edit className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback
                      className="text-xs"
                      style={{ backgroundColor: `${dept.color}15`, color: dept.color }}
                    >
                      {dept.headOfDepartment.split(" ").map(n => n[0]).join("")}
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
                    <Badge
                      className="mt-1 text-xs"
                      style={{
                        backgroundColor: `${dept.color}15`,
                        color: dept.color,
                        border: `1px solid ${dept.color}30`,
                      }}
                    >
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
          </Card>
        ))}
      </div>
    </div>
  );
}

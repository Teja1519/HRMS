import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  CalendarClock,
  Wallet,
  Building2,
  BarChart3,
  Settings,
  ChevronRight,
  LogOut
} from "lucide-react";
import { useState } from "react";
import { cn } from "../ui/utils";
import { Tooltip, TooltipTrigger, TooltipContent } from "../ui/tooltip";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard", roles: ["Admin", "HR", "Employee"] },
  { icon: Users, label: "Employees", path: "/employees", roles: ["Admin", "HR"] },
  { icon: CalendarCheck, label: "Attendance", path: "/attendance", roles: ["Admin", "HR", "Employee"] },
  { icon: CalendarClock, label: "Leave Management", path: "/leave", roles: ["Admin", "HR", "Employee"] },
  { icon: Wallet, label: "Payroll", path: "/payroll", roles: ["Admin", "HR", "Employee"] },
  { icon: Building2, label: "Departments", path: "/departments", roles: ["Admin", "HR"] },
  { icon: BarChart3, label: "Reports", path: "/reports", roles: ["Admin", "HR"] },
  { icon: Settings, label: "Settings", path: "/settings", roles: ["Admin"] }
];

export function Sidebar({ currentPath, onNavigate, onLogout }) {
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  const username = user?.Username || "Guest";
  const role = user?.Role || "User";
  const initials = username.slice(0, 2).toUpperCase();

  const allowedMenuItems = menuItems.filter((item) => item.roles.includes(role));

  return <aside className="w-64 bg-card border-r border-border h-screen flex flex-col">
      {
    /* Logo Section */
  }
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <Building2 className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-semibold text-foreground">HRMS</h1>
            <p className="text-xs text-muted-foreground">Enterprise Portal</p>
          </div>
        </div>
      </div>

      {
    /* Navigation Menu */
  }
      <nav className="flex-1 p-4 space-y-1">
        {allowedMenuItems.map((item) => {
    const Icon = item.icon;
    const isActive = currentPath === item.path || currentPath.startsWith(item.path + "/");
    return <button
      key={item.path}
      onClick={() => onNavigate(item.path)}
      title={item.label}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
        isActive ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
      )}
    >
              <Icon className="w-5 h-5" />
              <span className="flex-1 text-left">{item.label}</span>
              {isActive && <ChevronRight className="w-4 h-4" />}
            </button>;
  })}
      </nav>

      {
    /* User Info at Bottom */
  }
      <div className="p-4 border-t border-border flex items-center justify-between">
        <div className="flex items-center gap-3 px-2 min-w-0 flex-1">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <span className="text-sm font-medium text-primary">{initials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{username}</p>
            <p className="text-xs text-muted-foreground truncate">{role}</p>
          </div>
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={onLogout}
              className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-accent rounded-lg transition-all shrink-0"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </TooltipTrigger>
          <TooltipContent>Sign Out / Logout</TooltipContent>
        </Tooltip>
      </div>
    </aside>;
}

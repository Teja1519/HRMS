import { useEffect, useState } from "react";
import { MainLayout } from "./components/layout/MainLayout";
import { Login } from "./pages/auth/Login";
import { Dashboard } from "./pages/Dashboard";
import { Employees } from "./pages/Employees";
import { Attendance } from "./pages/Attendance";
import { LeaveManagement } from "./pages/LeaveManagement";
import { Payroll } from "./pages/Payroll";
import { Departments } from "./pages/Departments";
import { Reports } from "./pages/Reports";
import { Settings } from "./pages/Settings";
import { Toaster } from "./components/ui/sonner";
export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPath, setCurrentPath] = useState("/dashboard");
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    if (token && user) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);
  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentPath("/dashboard");
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setCurrentPath("/dashboard");
  };
  const isPathAllowed = (path, role) => {
    const permissions = {
      "/dashboard": ["Admin", "HR", "Employee"],
      "/attendance": ["Admin", "HR", "Employee"],
      "/leave": ["Admin", "HR", "Employee"],
      "/payroll": ["Admin", "HR", "Employee"],
      "/employees": ["Admin", "HR"],
      "/departments": ["Admin", "HR"],
      "/reports": ["Admin", "HR"],
      "/settings": ["Admin"]
    };
    const allowedRoles = permissions[path] || ["Admin"];
    return allowedRoles.includes(role);
  };

  const handleNavigate = (path) => {
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;
    const role = user?.Role || "Employee";

    if (isPathAllowed(path, role)) {
      setCurrentPath(path);
    } else {
      setCurrentPath("/dashboard");
    }
  };

  if (!isAuthenticated) {
    return <>
        <Login onLogin={handleLogin} onNavigate={handleNavigate} />
        <Toaster />
      </>;
  }

  const renderPage = () => {
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;
    const role = user?.Role || "Employee";

    const activePath = isPathAllowed(currentPath, role) ? currentPath : "/dashboard";

    switch (activePath) {
      case "/dashboard":
        return <Dashboard />;
      case "/employees":
        return <Employees />;
      case "/attendance":
        return <Attendance />;
      case "/leave":
        return <LeaveManagement />;
      case "/payroll":
        return <Payroll />;
      case "/departments":
        return <Departments />;
      case "/reports":
        return <Reports />;
      case "/settings":
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };
  return <>
      <MainLayout currentPath={currentPath} onNavigate={handleNavigate} onLogout={handleLogout}>
        {renderPage()}
      </MainLayout>
      <Toaster />
    </>;
}

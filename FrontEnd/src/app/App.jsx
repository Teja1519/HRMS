import { useState } from "react";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { MainLayout } from "./components/layout/MainLayout";
import { Login } from "./pages/auth/Login";
import { Dashboard } from "./pages/Dashboard";
import { Profile } from "./pages/Profile";
import { Employees } from "./pages/Employees";
import { Attendance } from "./pages/Attendance";
import { LeaveManagement } from "./pages/LeaveManagement";
import { Payroll } from "./pages/Payroll";
import { Departments } from "./pages/Departments";
import { Announcements } from "./pages/Announcements";
import { Reports } from "./pages/Reports";
import { Settings } from "./pages/Settings";
import { Toaster } from "./components/ui/sonner";

function AppContent() {
  const { isAuthenticated, logout } = useAuth();
  const [currentPath, setCurrentPath] = useState("/dashboard");

  const handleLogin = () => {
    setCurrentPath("/dashboard");
  };

  const handleLogout = () => {
    logout();
    setCurrentPath("/dashboard");
  };

  const isPathAllowed = (path, role) => {
    const permissions = {
      "/dashboard": ["Admin", "HR", "Employee"],
      "/profile": ["Admin", "HR", "Employee"],
      "/attendance": ["Admin", "HR", "Employee"],
      "/leave": ["Admin", "HR", "Employee"],
      "/payroll": ["Admin", "HR", "Employee"],
      "/employees": ["Admin", "HR"],
      "/departments": ["Admin", "HR"],
      "/announcements": ["Admin", "HR", "Employee"],
      "/reports": ["Admin", "HR"],
      "/settings": ["Admin"],
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
    return (
      <>
        <Login onLogin={handleLogin} onNavigate={handleNavigate} />
        <Toaster />
      </>
    );
  }

  const renderPage = () => {
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;
    const role = user?.Role || "Employee";

    const activePath = isPathAllowed(currentPath, role) ? currentPath : "/dashboard";

    switch (activePath) {
      case "/dashboard":
        return <Dashboard onNavigate={handleNavigate} />;
      case "/profile":
        return <Profile />;
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
      case "/announcements":
        return <Announcements />;
      case "/reports":
        return <Reports />;
      case "/settings":
        return <Settings />;
      default:
        return <Dashboard onNavigate={handleNavigate} />;
    }
  };

  return (
    <>
      <MainLayout currentPath={currentPath} onNavigate={handleNavigate} onLogout={handleLogout}>
        {renderPage()}
      </MainLayout>
      <Toaster />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

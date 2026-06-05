import { useState } from "react";
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

  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentPath("/dashboard");
  };

  const handleNavigate = (path: string) => {
    setCurrentPath(path);
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
    switch (currentPath) {
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

  return (
    <>
      <MainLayout currentPath={currentPath} onNavigate={handleNavigate}>
        {renderPage()}
      </MainLayout>
      <Toaster />
    </>
  );
}
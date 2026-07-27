import { Sidebar } from "./Sidebar";
import { TopNavbar } from "./TopNavbar";

export function MainLayout({ children, currentPath, onNavigate, onLogout }) {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar currentPath={currentPath} onNavigate={onNavigate} onLogout={onLogout} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNavbar onNavigate={onNavigate} onLogout={onLogout} />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}

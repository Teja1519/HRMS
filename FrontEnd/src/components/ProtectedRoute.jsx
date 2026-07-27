import { useAuth } from "../context/AuthContext";

export function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    window.location.href = "/login";
    return null;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold text-destructive">403 - Access Denied</h2>
        <p className="text-muted-foreground mt-2">You do not have permission to view this page.</p>
      </div>
    );
  }

  return children;
}

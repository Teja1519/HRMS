import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/api";
import { toast } from "sonner";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedRefreshToken = localStorage.getItem("refreshToken");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setRefreshToken(storedRefreshToken);
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Failed to restore auth state", err);
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const response = await api.post("/auth/login", { Username: username, Password: password });
      const data = response.data?.data;
      if (data?.token && data?.user) {
        const accToken = data.accessToken || data.token;
        const refToken = data.refreshToken || null;
        
        setToken(accToken);
        setRefreshToken(refToken);
        setUser(data.user);

        localStorage.setItem("token", accToken);
        if (refToken) localStorage.setItem("refreshToken", refToken);
        localStorage.setItem("user", JSON.stringify(data.user));

        toast.success(`Welcome back, ${data.user.Username}!`);
        return { success: true };
      }
      return { success: false, message: "Invalid server response" };
    } catch (error) {
      const msg = error?.response?.data?.message || "Invalid username or password";
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  const register = async (username, password, role = "Employee") => {
    try {
      await api.post("/auth/register", { Username: username, Password: password, Role: role });
      toast.success("Registration successful! Please sign in.");
      return { success: true };
    } catch (error) {
      const msg = error?.response?.data?.message || "Registration failed";
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  const forgotPassword = async (username) => {
    try {
      const response = await api.post("/auth/forgot-password", { Username: username });
      const resetToken = response.data?.data?.resetToken;
      toast.success("Password reset token generated! (See modal or server response)");
      return { success: true, resetToken };
    } catch (error) {
      const msg = error?.response?.data?.message || "Forgot password request failed";
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  const resetPassword = async (tokenVal, newPassword) => {
    try {
      await api.post("/auth/reset-password", { Token: tokenVal, NewPassword: newPassword });
      toast.success("Password reset successful! Please sign in with your new password.");
      return { success: true };
    } catch (error) {
      const msg = error?.response?.data?.message || "Password reset failed";
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout", {});
    } catch (err) {
      console.warn("Logout request failed silently", err);
    } finally {
      setToken(null);
      setRefreshToken(null);
      setUser(null);
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      toast.info("Logged out successfully");
    }
  };

  const value = {
    user,
    token,
    refreshToken,
    role: user?.Role || "Employee",
    employeeId: user?.EmployeeId || null,
    isAuthenticated: Boolean(token && user),
    loading,
    login,
    register,
    forgotPassword,
    resetPassword,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

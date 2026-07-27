import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { Building2, Eye, EyeOff, KeyRound, ArrowLeft } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Checkbox } from "../../components/ui/checkbox";

export function Login({ onLogin }) {
  const { login, register, forgotPassword, resetPassword } = useAuth();
  const [mode, setMode] = useState("login"); // "login" | "register" | "forgot" | "reset"
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [regRole, setRegRole] = useState("Employee");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [generatedTokenNotice, setGeneratedTokenNotice] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (mode === "login") {
      const res = await login(username, password);
      if (res.success && onLogin) onLogin();
    } else if (mode === "register") {
      const res = await register(username, password, regRole);
      if (res.success) {
        setMode("login");
        setPassword("");
      }
    } else if (mode === "forgot") {
      const res = await forgotPassword(username);
      if (res.success) {
        setGeneratedTokenNotice(res.resetToken);
        setMode("reset");
        setResetToken(res.resetToken);
      }
    } else if (mode === "reset") {
      const res = await resetPassword(resetToken, newPassword);
      if (res.success) {
        setMode("login");
        setPassword("");
        setNewPassword("");
        setResetToken("");
        setGeneratedTokenNotice("");
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/80" />

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-white">HRMS Portal</h1>
              <p className="text-white/80 text-sm">Enterprise Management System</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 space-y-6">
          <h2 className="text-4xl font-bold text-white leading-tight">
            Streamline Your
            <br />
            HR Operations
          </h2>
          <p className="text-lg text-white/90 max-w-md">
            Manage employees, daily attendance, payroll processing, leaves, and team notifications from a unified platform.
          </p>

          <div className="grid grid-cols-3 gap-6 pt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-3xl font-bold text-white">100%</div>
              <div className="text-sm text-white/80 mt-1">Secure JWT</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-3xl font-bold text-white">4 Roles</div>
              <div className="text-sm text-white/80 mt-1">RBAC System</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-3xl font-bold text-white">24/7</div>
              <div className="text-sm text-white/80 mt-1">Availability</div>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-sm text-white/60">
          © 2026 HRMS System. All rights reserved.
        </div>
      </div>

      {/* Right Side Form Card */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-8">
          <div className="lg:hidden flex items-center gap-3 justify-center">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">HRMS</h1>
              <p className="text-xs text-muted-foreground">Enterprise Portal</p>
            </div>
          </div>

          <div>
            {mode !== "login" && (
              <button
                type="button"
                onClick={() => setMode("login")}
                className="text-xs text-muted-foreground hover:text-foreground mb-4 flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
              </button>
            )}

            <h2 className="text-3xl font-bold text-foreground">
              {mode === "login" && "Welcome back"}
              {mode === "register" && "Create an account"}
              {mode === "forgot" && "Forgot Password?"}
              {mode === "reset" && "Reset Your Password"}
            </h2>

            <p className="text-muted-foreground mt-2">
              {mode === "login" && "Enter your credentials to access your portal"}
              {mode === "register" && "Enter your details to register as a new system user"}
              {mode === "forgot" && "Enter your username to generate a password reset token"}
              {mode === "reset" && "Enter your reset token and new password"}
            </p>
          </div>

          {generatedTokenNotice && mode === "reset" && (
            <div className="p-3 bg-primary/10 border border-primary/30 rounded-lg text-xs text-primary font-mono break-all">
              <strong>Generated Reset Token:</strong> {generatedTokenNotice}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {(mode === "login" || mode === "register" || mode === "forgot") && (
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="h-11"
                />
              </div>
            )}

            {(mode === "login" || mode === "register") && (
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-11 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {mode === "register" && (
              <div className="space-y-2">
                <Label htmlFor="role">System Role</Label>
                <select
                  id="role"
                  value={regRole}
                  onChange={(e) => setRegRole(e.target.value)}
                  className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="Employee">Employee</option>
                  <option value="Manager">Manager</option>
                  <option value="HR">HR</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
            )}

            {mode === "reset" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="resetToken">Reset Token</Label>
                  <Input
                    id="resetToken"
                    type="text"
                    placeholder="Enter 64-character token"
                    value={resetToken}
                    onChange={(e) => setResetToken(e.target.value)}
                    required
                    className="h-11 font-mono text-xs"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="h-11"
                  />
                </div>
              </>
            )}

            {mode === "login" && (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" defaultChecked />
                  <label htmlFor="remember" className="text-sm text-foreground cursor-pointer">
                    Remember me
                  </label>
                </div>

                <button
                  type="button"
                  onClick={() => setMode("forgot")}
                  className="text-sm text-primary hover:underline"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <Button type="submit" className="w-full h-11 font-medium" disabled={loading}>
              {loading ? "Processing..." : (
                mode === "login" ? "Sign In" :
                mode === "register" ? "Register" :
                mode === "forgot" ? "Send Reset Token" : "Reset Password"
              )}
            </Button>
          </form>

          <div className="text-center text-sm text-muted-foreground">
            {mode === "login" && (
              <>
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => setMode("register")}
                  className="text-primary hover:underline font-semibold"
                >
                  Register
                </button>
              </>
            )}
            {mode === "register" && (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className="text-primary hover:underline font-semibold"
                >
                  Sign In
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

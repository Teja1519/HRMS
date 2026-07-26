import { useState } from "react";
import axios from "axios";
import { Building2, Eye, EyeOff } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Checkbox } from "../../components/ui/checkbox";
export function Login({ onLogin, onNavigate }) {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [regRole, setRegRole] = useState("Employee");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          Username: username,
          Password: password
        }
      );
      const token = response.data.data.token;
      const user = response.data.data.user;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      alert("Login successful");
      onLogin();
    } catch (error) {
      console.error(error);
      alert(
        error?.response?.data?.message || "Invalid username or password"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          Username: username,
          Password: password,
          Role: regRole
        }
      );
      alert("Registration successful! Please sign in.");
      setIsRegister(false);
      setPassword("");
    } catch (error) {
      console.error(error);
      alert(
        error?.response?.data?.message || "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return <div className="min-h-screen flex">
      {
    /* Left Side */
  }
      <div className="hidden lg:flex lg:w-1/2 bg-primary p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/80" />

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-white">HRMS</h1>
              <p className="text-white/80 text-sm">Enterprise Portal</p>
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
            Manage employees, attendance, payroll, and more from a single,
            powerful platform.
          </p>

          <div className="grid grid-cols-3 gap-6 pt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-3xl font-bold text-white">500+</div>
              <div className="text-sm text-white/80 mt-1">Employees</div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-3xl font-bold text-white">98%</div>
              <div className="text-sm text-white/80 mt-1">Satisfaction</div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-3xl font-bold text-white">24/7</div>
              <div className="text-sm text-white/80 mt-1">Support</div>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-sm text-white/60">
          © 2026 HRMS. All rights reserved.
        </div>
      </div>

      {
    /* Right Side */
  }
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-8">

          <div className="lg:hidden flex items-center gap-3 justify-center">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>

            <div>
              <h1 className="text-xl font-semibold">HRMS</h1>
              <p className="text-xs text-muted-foreground">
                Enterprise Portal
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-foreground">
              {isRegister ? "Create an account" : "Welcome back"}
            </h2>

            <p className="text-muted-foreground mt-2">
              {isRegister ? "Enter your details to register as a new user" : "Enter your credentials to access your account"}
            </p>
          </div>

          <form onSubmit={isRegister ? handleRegister : handleSubmit} className="space-y-6">

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

            {isRegister && (
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <select
                  id="role"
                  value={regRole}
                  onChange={(e) => setRegRole(e.target.value)}
                  className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="Employee">Employee</option>
                  <option value="HR">HR</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
            )}

            {!isRegister && (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" />
                  <label
    htmlFor="remember"
    className="text-sm text-foreground cursor-pointer"
  >
                    Remember me
                  </label>
                </div>

                <button
    type="button"
    onClick={() => onNavigate("/forgot-password")}
    className="text-sm text-primary hover:underline"
  >
                  Forgot password?
                </button>
              </div>
            )}

            <Button
    type="submit"
    className="w-full h-11"
    disabled={loading}
  >
              {loading ? (isRegister ? "Registering..." : "Signing In...") : (isRegister ? "Register" : "Sign In")}
            </Button>
          </form>

          <div className="text-center text-sm text-muted-foreground">
            {isRegister ? (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => { setIsRegister(false); setPassword(""); }}
                  className="text-primary hover:underline font-semibold"
                >
                  Sign In
                </button>
              </>
            ) : (
              <>
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => { setIsRegister(true); setPassword(""); }}
                  className="text-primary hover:underline font-semibold"
                >
                  Register
                </button>
              </>
            )}
          </div>

        </div>
      </div>
    </div>;
}

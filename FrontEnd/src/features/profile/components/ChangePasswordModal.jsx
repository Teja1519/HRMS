import { useState } from "react";
import { Key, Eye, EyeOff, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "../../../app/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "../../../app/components/ui/dialog";

export function ChangePasswordModal({ open, onOpenChange, onChangePassword, updating }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const hasMinLength = newPassword.length >= 8;
  const hasUpper = /[A-Z]/.test(newPassword);
  const hasLower = /[a-z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecial = /[@$!%*?&]/.test(newPassword);
  const isMatch = newPassword === confirmPassword && confirmPassword.length > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!currentPassword) {
      setErrorMsg("Please enter your current password");
      return;
    }

    if (!hasMinLength || !hasUpper || !hasLower || !hasNumber || !hasSpecial) {
      setErrorMsg("New password does not meet security strength criteria");
      return;
    }

    if (!isMatch) {
      setErrorMsg("New password and confirm password do not match");
      return;
    }

    const success = await onChangePassword({
      CurrentPassword: currentPassword,
      NewPassword: newPassword,
      ConfirmPassword: confirmPassword,
    });

    if (success) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-primary">
            <Key className="w-5 h-5" /> Change Password
          </DialogTitle>
          <DialogDescription>
            Update your account password securely.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {errorMsg && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-xs rounded-lg">
              {errorMsg}
            </div>
          )}

          {/* Current Password */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground">Current Password *</label>
            <div className="relative">
              <input
                type={showCurrent ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="w-full pl-3 pr-9 py-2 text-sm bg-accent/30 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Enter current password"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={() => setShowCurrent(!showCurrent)}
              >
                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground">New Password *</label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full pl-3 pr-9 py-2 text-sm bg-accent/30 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Enter new password"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={() => setShowNew(!showNew)}
              >
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Password Complexity Indicators */}
          <div className="p-3 bg-accent/20 border border-border rounded-lg space-y-1.5 text-[11px]">
            <p className="font-semibold text-muted-foreground mb-1">Password Strength Checklist:</p>
            <div className="grid grid-cols-2 gap-1.5">
              <span className={`flex items-center gap-1 ${hasMinLength ? "text-emerald-600 dark:text-emerald-400 font-medium" : "text-muted-foreground"}`}>
                {hasMinLength ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5 text-muted-foreground/60" />} 8+ Characters
              </span>
              <span className={`flex items-center gap-1 ${hasUpper ? "text-emerald-600 dark:text-emerald-400 font-medium" : "text-muted-foreground"}`}>
                {hasUpper ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5 text-muted-foreground/60" />} 1 Uppercase (A-Z)
              </span>
              <span className={`flex items-center gap-1 ${hasLower ? "text-emerald-600 dark:text-emerald-400 font-medium" : "text-muted-foreground"}`}>
                {hasLower ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5 text-muted-foreground/60 text-muted-foreground" />} 1 Lowercase (a-z)
              </span>
              <span className={`flex items-center gap-1 ${hasNumber ? "text-emerald-600 dark:text-emerald-400 font-medium" : "text-muted-foreground"}`}>
                {hasNumber ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5 text-muted-foreground/60" />} 1 Number (0-9)
              </span>
              <span className={`flex items-center gap-1 ${hasSpecial ? "text-emerald-600 dark:text-emerald-400 font-medium" : "text-muted-foreground"}`}>
                {hasSpecial ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5 text-muted-foreground/60" />} 1 Symbol (@$!%*?&)
              </span>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground">Confirm New Password *</label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full pl-3 pr-9 py-2 text-sm bg-accent/30 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Re-enter new password"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {confirmPassword.length > 0 && (
              <p className={`text-[11px] ${isMatch ? "text-emerald-600" : "text-destructive"}`}>
                {isMatch ? "✓ Passwords match" : "✗ Passwords do not match"}
              </p>
            )}
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={updating}>
              {updating ? "Updating..." : "Update Password"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

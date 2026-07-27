import { useState, useEffect } from "react";
import { LogIn, LogOut, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import api from "../lib/api";
import { toast } from "sonner";

export function PunchCard({ onStatusChange }) {
  const [todayStatus, setTodayStatus] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const loadTodayStatus = async () => {
    try {
      const response = await api.get("/attendance/today");
      const data = response.data?.data ?? null;
      setTodayStatus(data);
      if (onStatusChange) onStatusChange(data);
    } catch (error) {
      console.error("Failed to load today's attendance status", error);
    }
  };

  useEffect(() => {
    void loadTodayStatus();
  }, []);

  const handleCheckIn = async () => {
    try {
      setActionLoading(true);
      await api.post("/attendance/checkin", {});
      toast.success("Checked in successfully!");
      await loadTodayStatus();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to check in");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCheckOut = async () => {
    try {
      setActionLoading(true);
      await api.post("/attendance/checkout", {});
      toast.success("Checked out successfully!");
      await loadTodayStatus();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to check out");
    } finally {
      setActionLoading(false);
    }
  };

  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  return (
    <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-card border-primary/20">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <h2 className="text-xl font-bold">Daily Attendance Punch</h2>
              {todayStatus?.status === "checked_in" && (
                <Badge className="bg-success/10 text-success border-success/20">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Checked In
                </Badge>
              )}
              {todayStatus?.status === "checked_out" && (
                <Badge variant="secondary">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Checked Out
                </Badge>
              )}
              {todayStatus?.isLate && (
                <Badge className="bg-warning/10 text-warning border-warning/20">Late Arrival</Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Date: <span className="font-semibold text-foreground">{todayStr}</span> |
              Check-In: <span className="font-mono text-foreground">{todayStatus?.checkIn || "--:--"}</span> |
              Check-Out: <span className="font-mono text-foreground">{todayStatus?.checkOut || "--:--"}</span> |
              Working Hours: <span className="font-semibold text-primary">{todayStatus?.workingHours || "0.0"} hrs</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              size="lg"
              onClick={handleCheckIn}
              disabled={actionLoading || todayStatus?.status === "checked_in" || todayStatus?.status === "checked_out"}
              className="bg-success hover:bg-success/90 text-white font-medium"
            >
              <LogIn className="w-5 h-5 mr-2" />
              {todayStatus?.status === "checked_in" || todayStatus?.status === "checked_out" ? "Checked In" : "Check In"}
            </Button>

            <Button
              size="lg"
              variant="outline"
              onClick={handleCheckOut}
              disabled={actionLoading || todayStatus?.status !== "checked_in"}
              className="border-destructive text-destructive hover:bg-destructive hover:text-white font-medium"
            >
              <LogOut className="w-5 h-5 mr-2" />
              {todayStatus?.status === "checked_out" ? "Checked Out" : "Check Out"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

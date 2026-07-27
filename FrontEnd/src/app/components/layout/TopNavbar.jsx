import { useEffect, useState } from "react";
import { Search, Bell, Settings, User, LogOut, HelpCircle, Phone, Mail, BookOpen } from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "../../components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "../../components/ui/dialog";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { Badge } from "../../components/ui/badge";
import { Tooltip, TooltipTrigger, TooltipContent } from "../../components/ui/tooltip";
import api from "../../lib/api";

export function TopNavbar({ onNavigate, onLogout }) {
  const [unreadCount, setUnreadCount] = useState(0);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  const username = user?.Username || "Guest";
  const role = user?.Role || "User";
  const initials = username.slice(0, 2).toUpperCase();

  const loadNotifications = async () => {
    try {
      const response = await api.get("/notifications");
      const payload = response.data?.data ?? [];
      const unread = payload.filter((n) => !n.IsRead).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error("Failed to load notifications count", error);
    }
  };

  useEffect(() => {
    void loadNotifications();
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleNotificationClick = () => {
    if (onNavigate) {
      onNavigate("/announcements");
    }
  };

  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
      {/* Search Bar */}
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search employees, departments, or reports..."
            className="w-full pl-10 pr-4 py-2 bg-accent/50 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm"
          />
        </div>
      </div>

      {/* Right Navbar Controls */}
      <div className="flex items-center gap-2 ml-6">
        {/* Help & Support Dialog Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative hover:bg-accent/60"
              onClick={() => setIsHelpOpen(true)}
              title="Open Helpdesk & Support Center"
            >
              <HelpCircle className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Helpdesk & Support Center</TooltipContent>
        </Tooltip>

        {/* Notification Bell Icon */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative hover:bg-accent/60"
              onClick={handleNotificationClick}
              title="View Company Announcements"
            >
              <Bell className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 bg-destructive text-[10px]">
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>Company Announcements ({unreadCount} Unread)</TooltipContent>
        </Tooltip>

        {/* Quick Sign Out Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={onLogout}
              className="text-muted-foreground hover:text-destructive transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Sign Out / Logout</TooltipContent>
        </Tooltip>

        {/* User Account Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 h-auto px-2 py-1.5">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-primary text-primary-foreground">{initials}</AvatarFallback>
              </Avatar>
              <div className="text-left hidden md:block">
                <p className="text-sm font-medium">{username}</p>
                <p className="text-xs text-muted-foreground">{role}</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account ({role})</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer" onClick={() => onNavigate && onNavigate("/profile")}>
              <User className="w-4 h-4 mr-2 text-primary" />
              My Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={() => onNavigate && onNavigate("/settings")}>
              <Settings className="w-4 h-4 mr-2" />
              Settings & Preferences
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={() => onNavigate && onNavigate("/announcements")}>
              <Bell className="w-4 h-4 mr-2" />
              Company Announcements
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-destructive" onClick={onLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout Session
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Help & Support Center Modal */}
      <Dialog open={isHelpOpen} onOpenChange={setIsHelpOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-primary">
              <HelpCircle className="w-5 h-5" /> HRMS Helpdesk & Support Center
            </DialogTitle>
            <DialogDescription>Quick guidance, support contacts, and system help.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="p-3 bg-accent/40 border border-border rounded-lg space-y-2 text-xs">
              <div className="flex items-center gap-2 text-foreground font-semibold">
                <Phone className="w-4 h-4 text-primary" /> HR Operations Hotline
              </div>
              <p className="text-muted-foreground">Call +1 (800) 555-HRMS for urgent workplace assistance.</p>
            </div>

            <div className="p-3 bg-accent/40 border border-border rounded-lg space-y-2 text-xs">
              <div className="flex items-center gap-2 text-foreground font-semibold">
                <Mail className="w-4 h-4 text-primary" /> Support Desk Email
              </div>
              <p className="text-muted-foreground">Send queries to support@hrms.local (Response within 2 hours).</p>
            </div>

            <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg space-y-1.5 text-xs">
              <div className="flex items-center gap-2 font-semibold text-primary">
                <BookOpen className="w-4 h-4" /> Quick System Navigation Guide
              </div>
              <ul className="list-disc pl-4 text-muted-foreground space-y-1">
                <li><strong>My Profile:</strong> View & edit personal info and change password.</li>
                <li><strong>Punch Card:</strong> Daily check-in/out on Dashboard or Attendance page.</li>
                <li><strong>Apply Leaves:</strong> Select Leave Management $\rightarrow$ Apply Leave.</li>
                <li><strong>Salary Slips:</strong> Select Payroll $\rightarrow$ View/Print Payslips.</li>
              </ul>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={() => setIsHelpOpen(false)}>Close Helpdesk</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  );
}

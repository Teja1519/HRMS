import { Search, Bell, Settings, User, LogOut, HelpCircle } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";

export function TopNavbar() {
  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
      {/* Search Bar */}
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search employees, departments, or anything..."
            className="w-full pl-10 pr-4 py-2 bg-accent/50 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2 ml-6">
        {/* Help Button */}
        <Button variant="ghost" size="icon" className="relative">
          <HelpCircle className="w-5 h-5" />
        </Button>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 bg-destructive text-[10px]">
                5
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-[400px] overflow-auto">
              <DropdownMenuItem className="flex flex-col items-start p-4 cursor-pointer">
                <div className="flex items-start gap-3 w-full">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">New Leave Request</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      John Doe submitted a leave request for review
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                  </div>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start p-4 cursor-pointer">
                <div className="flex items-start gap-3 w-full">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Attendance Alert</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      3 employees haven't checked in today
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">4 hours ago</p>
                  </div>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start p-4 cursor-pointer">
                <div className="flex items-start gap-3 w-full">
                  <div className="w-2 h-2 rounded-full bg-muted mt-1.5"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Payroll Processed</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Monthly payroll for June has been processed
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">1 day ago</p>
                  </div>
                </div>
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 h-auto px-2 py-1.5">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-primary text-primary-foreground">AD</AvatarFallback>
              </Avatar>
              <div className="text-left hidden md:block">
                <p className="text-sm font-medium">Admin User</p>
                <p className="text-xs text-muted-foreground">Administrator</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <User className="w-4 h-4 mr-2" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-destructive">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

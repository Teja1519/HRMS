import { Briefcase, Lock } from "lucide-react";
import { Badge } from "../../../app/components/ui/badge";

export function EmploymentInformation({ profile }) {
  if (!profile) return null;

  const empList = [
    { label: "Employee Code / ID", value: profile.EmployeeCode },
    { label: "Department", value: profile.DepartmentName },
    { label: "Designation", value: profile.Designation || "Employee" },
    { label: "Joining Date", value: profile.HireDate || "Not Specified" },
    { label: "Reporting Manager", value: profile.ReportingManager || "Direct Manager" },
    { label: "Employment Type", value: profile.EmploymentType || "Full-Time" },
  ];

  return (
    <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <h3 className="font-semibold text-base text-foreground flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-primary" /> Employment Information
        </h3>
        <Badge variant="outline" className="text-[10px] gap-1 text-muted-foreground">
          <Lock className="w-3 h-3" /> Read-Only (HR Managed)
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        {empList.map((item, idx) => (
          <div key={idx} className="p-3 bg-accent/30 rounded-lg border border-border/50">
            <p className="text-xs text-muted-foreground font-medium">{item.label}</p>
            <p className="font-medium text-foreground mt-0.5">{item.value || "—"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

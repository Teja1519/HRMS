import { User, Calendar, Heart, Globe } from "lucide-react";

export function PersonalInformation({ profile }) {
  if (!profile) return null;

  const infoList = [
    { label: "First Name", value: profile.FirstName },
    { label: "Last Name", value: profile.LastName },
    { label: "Gender", value: profile.Gender || "Not Specified" },
    { label: "Date of Birth", value: profile.DateOfBirth || "Not Specified" },
    { label: "Blood Group", value: profile.BloodGroup || "Not Specified" },
    { label: "Marital Status", value: profile.MaritalStatus || "Not Specified" },
    { label: "Nationality", value: profile.Nationality || "Not Specified" },
  ];

  return (
    <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <h3 className="font-semibold text-base text-foreground flex items-center gap-2">
          <User className="w-4 h-4 text-primary" /> Personal Information
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        {infoList.map((item, idx) => (
          <div key={idx} className="p-3 bg-accent/30 rounded-lg border border-border/50">
            <p className="text-xs text-muted-foreground font-medium">{item.label}</p>
            <p className="font-medium text-foreground mt-0.5">{item.value || "—"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

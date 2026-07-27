import { ShieldAlert, PhoneCall } from "lucide-react";

export function EmergencyContact({ profile }) {
  if (!profile) return null;

  return (
    <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <h3 className="font-semibold text-base text-foreground flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-500" /> Emergency Contact
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
        <div className="p-3 bg-amber-500/5 border border-amber-500/20 rounded-lg">
          <p className="text-xs text-muted-foreground font-medium">Contact Name</p>
          <p className="font-medium text-foreground mt-0.5">{profile.EmergencyContactName || "Not Provided"}</p>
        </div>
        <div className="p-3 bg-amber-500/5 border border-amber-500/20 rounded-lg">
          <p className="text-xs text-muted-foreground font-medium">Relationship</p>
          <p className="font-medium text-foreground mt-0.5">{profile.EmergencyContactRelation || "Not Provided"}</p>
        </div>
        <div className="p-3 bg-amber-500/5 border border-amber-500/20 rounded-lg">
          <p className="text-xs text-muted-foreground font-medium">Phone Number</p>
          <p className="font-medium text-foreground mt-0.5 flex items-center gap-1.5">
            <PhoneCall className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            {profile.EmergencyContactPhone || "Not Provided"}
          </p>
        </div>
      </div>
    </div>
  );
}

import { User, Mail, Phone, Building2, Briefcase, Key, Edit3 } from "lucide-react";
import { Button } from "../../../app/components/ui/button";
import { Badge } from "../../../app/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../../../app/components/ui/avatar";

export function ProfileHeader({ profile, onOpenChangePassword, onOpenEditModal }) {
  if (!profile) return null;

  const initials = profile.FullName
    ? profile.FullName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "EMP";

  const photoUrl = profile.ProfilePicture
    ? (profile.ProfilePicture.startsWith("http") ? profile.ProfilePicture : `http://localhost:5000${profile.ProfilePicture}`)
    : null;

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
      <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
        <div className="flex flex-col md:flex-row items-center gap-5 text-center md:text-left">
          <Avatar className="w-24 h-24 border-2 border-primary/20 shadow-md">
            {photoUrl ? <AvatarImage src={photoUrl} alt={profile.FullName} /> : null}
            <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <h2 className="text-2xl font-bold text-foreground">{profile.FullName}</h2>
              <Badge
                variant={profile.Status === "Active" ? "default" : "secondary"}
                className={profile.Status === "Active" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20" : ""}
              >
                {profile.Status || "Active"}
              </Badge>
            </div>

            <p className="text-sm font-medium text-muted-foreground flex items-center justify-center md:justify-start gap-1.5">
              <Briefcase className="w-4 h-4 text-primary" /> {profile.Designation || "Employee"}
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-muted-foreground pt-1">
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-primary" /> ID: <strong className="text-foreground">{profile.EmployeeCode}</strong>
              </span>
              <span className="flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-primary" /> {profile.DepartmentName}
              </span>
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-primary" /> {profile.Email}
              </span>
              {profile.Phone && (
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-primary" /> {profile.Phone}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2.5 shrink-0">
          <Button variant="outline" size="sm" onClick={onOpenEditModal} className="flex items-center gap-1.5">
            <Edit3 className="w-4 h-4" /> Edit Profile
          </Button>
          <Button variant="default" size="sm" onClick={onOpenChangePassword} className="flex items-center gap-1.5">
            <Key className="w-4 h-4" /> Change Password
          </Button>
        </div>
      </div>
    </div>
  );
}

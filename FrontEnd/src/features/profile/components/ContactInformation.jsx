import { Mail, Phone, MapPin } from "lucide-react";

export function ContactInformation({ profile }) {
  if (!profile) return null;

  const contactList = [
    { label: "Email Address", value: profile.Email },
    { label: "Phone Number", value: profile.Phone || "Not Provided" },
    { label: "Alternate Phone", value: profile.AlternatePhone || "Not Provided" },
    { label: "Address", value: profile.Address || "Not Provided" },
    { label: "City", value: profile.City || "Not Provided" },
    { label: "State", value: profile.State || "Not Provided" },
    { label: "Country", value: profile.Country || "Not Provided" },
    { label: "PIN / Zip Code", value: profile.PinCode || "Not Provided" },
  ];

  return (
    <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <h3 className="font-semibold text-base text-foreground flex items-center gap-2">
          <MapPin className="w-4 h-4 text-primary" /> Contact Information
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        {contactList.map((item, idx) => (
          <div key={idx} className="p-3 bg-accent/30 rounded-lg border border-border/50">
            <p className="text-xs text-muted-foreground font-medium">{item.label}</p>
            <p className="font-medium text-foreground mt-0.5">{item.value || "—"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

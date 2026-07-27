import { useState, useEffect } from "react";
import { Edit3, User, MapPin, ShieldAlert, Building } from "lucide-react";
import { Button } from "../../../app/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "../../../app/components/ui/dialog";

export function EditProfileModal({ open, onOpenChange, profile, onUpdateProfile, updating }) {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (profile) {
      setFormData({
        FirstName: profile.FirstName || "",
        LastName: profile.LastName || "",
        Gender: profile.Gender || "Male",
        DateOfBirth: profile.DateOfBirth || "",
        BloodGroup: profile.BloodGroup || "",
        MaritalStatus: profile.MaritalStatus || "Single",
        Nationality: profile.Nationality || "",
        Phone: profile.Phone || "",
        AlternatePhone: profile.AlternatePhone || "",
        Address: profile.Address || "",
        City: profile.City || "",
        State: profile.State || "",
        Country: profile.Country || "",
        PinCode: profile.PinCode || "",
        EmergencyContactName: profile.EmergencyContactName || "",
        EmergencyContactRelation: profile.EmergencyContactRelation || "",
        EmergencyContactPhone: profile.EmergencyContactPhone || "",
        BankName: profile.BankName || "",
        BankAccountHolder: profile.BankAccountHolder || "",
        BankAccountNumber: profile.BankAccountNumber || "",
        BankIFSC: profile.BankIFSC || "",
        BankBranch: profile.BankBranch || "",
      });
    }
  }, [profile, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await onUpdateProfile(formData);
    if (success) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-primary">
            <Edit3 className="w-5 h-5" /> Edit Employee Profile
          </DialogTitle>
          <DialogDescription>
            Update personal, contact, emergency, and bank account information.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-2">
          {/* Section 1: Personal Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5 border-b border-border pb-1">
              <User className="w-3.5 h-3.5" /> Personal Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-foreground">First Name *</label>
                <input
                  type="text"
                  name="FirstName"
                  value={formData.FirstName || ""}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-1.5 text-sm bg-accent/30 border border-input rounded-lg"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-foreground">Last Name *</label>
                <input
                  type="text"
                  name="LastName"
                  value={formData.LastName || ""}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-1.5 text-sm bg-accent/30 border border-input rounded-lg"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-foreground">Gender</label>
                <select
                  name="Gender"
                  value={formData.Gender || "Male"}
                  onChange={handleChange}
                  className="w-full px-3 py-1.5 text-sm bg-accent/30 border border-input rounded-lg"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-foreground">Date of Birth</label>
                <input
                  type="date"
                  name="DateOfBirth"
                  value={formData.DateOfBirth || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-1.5 text-sm bg-accent/30 border border-input rounded-lg"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-foreground">Blood Group</label>
                <input
                  type="text"
                  name="BloodGroup"
                  placeholder="e.g. O+, A+, B-"
                  value={formData.BloodGroup || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-1.5 text-sm bg-accent/30 border border-input rounded-lg"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-foreground">Marital Status</label>
                <select
                  name="MaritalStatus"
                  value={formData.MaritalStatus || "Single"}
                  onChange={handleChange}
                  className="w-full px-3 py-1.5 text-sm bg-accent/30 border border-input rounded-lg"
                >
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Divorced">Divorced</option>
                  <option value="Widowed">Widowed</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-medium text-foreground">Nationality</label>
                <input
                  type="text"
                  name="Nationality"
                  placeholder="e.g. American, Indian"
                  value={formData.Nationality || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-1.5 text-sm bg-accent/30 border border-input rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Contact Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5 border-b border-border pb-1">
              <MapPin className="w-3.5 h-3.5" /> Contact Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-foreground">Phone Number</label>
                <input
                  type="text"
                  name="Phone"
                  value={formData.Phone || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-1.5 text-sm bg-accent/30 border border-input rounded-lg"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-foreground">Alternate Phone</label>
                <input
                  type="text"
                  name="AlternatePhone"
                  value={formData.AlternatePhone || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-1.5 text-sm bg-accent/30 border border-input rounded-lg"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-medium text-foreground">Street Address</label>
                <textarea
                  name="Address"
                  rows={2}
                  value={formData.Address || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-1.5 text-sm bg-accent/30 border border-input rounded-lg resize-none"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-foreground">City</label>
                <input
                  type="text"
                  name="City"
                  value={formData.City || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-1.5 text-sm bg-accent/30 border border-input rounded-lg"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-foreground">State</label>
                <input
                  type="text"
                  name="State"
                  value={formData.State || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-1.5 text-sm bg-accent/30 border border-input rounded-lg"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-foreground">Country</label>
                <input
                  type="text"
                  name="Country"
                  value={formData.Country || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-1.5 text-sm bg-accent/30 border border-input rounded-lg"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-foreground">PIN Code</label>
                <input
                  type="text"
                  name="PinCode"
                  value={formData.PinCode || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-1.5 text-sm bg-accent/30 border border-input rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Emergency Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-500 flex items-center gap-1.5 border-b border-border pb-1">
              <ShieldAlert className="w-3.5 h-3.5" /> Emergency Contact
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-medium text-foreground">Contact Name</label>
                <input
                  type="text"
                  name="EmergencyContactName"
                  value={formData.EmergencyContactName || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-1.5 text-sm bg-accent/30 border border-input rounded-lg"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-foreground">Relationship</label>
                <input
                  type="text"
                  name="EmergencyContactRelation"
                  placeholder="e.g. Spouse, Parent, Sibling"
                  value={formData.EmergencyContactRelation || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-1.5 text-sm bg-accent/30 border border-input rounded-lg"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-foreground">Emergency Phone</label>
                <input
                  type="text"
                  name="EmergencyContactPhone"
                  value={formData.EmergencyContactPhone || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-1.5 text-sm bg-accent/30 border border-input rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Bank Account Information */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5 border-b border-border pb-1">
              <Building className="w-3.5 h-3.5" /> Bank & Salary Direct Deposit
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-foreground">Bank Name</label>
                <input
                  type="text"
                  name="BankName"
                  value={formData.BankName || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-1.5 text-sm bg-accent/30 border border-input rounded-lg"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-foreground">Account Holder Name</label>
                <input
                  type="text"
                  name="BankAccountHolder"
                  value={formData.BankAccountHolder || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-1.5 text-sm bg-accent/30 border border-input rounded-lg"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-foreground">Account Number</label>
                <input
                  type="text"
                  name="BankAccountNumber"
                  value={formData.BankAccountNumber || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-1.5 text-sm bg-accent/30 border border-input rounded-lg"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-foreground">IFSC Code</label>
                <input
                  type="text"
                  name="BankIFSC"
                  value={formData.BankIFSC || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-1.5 text-sm bg-accent/30 border border-input rounded-lg"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-medium text-foreground">Branch Name</label>
                <input
                  type="text"
                  name="BankBranch"
                  value={formData.BankBranch || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-1.5 text-sm bg-accent/30 border border-input rounded-lg"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="pt-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={updating}>
              {updating ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

import { useState } from "react";
import { User, AlertCircle, RefreshCw } from "lucide-react";
import { useProfile } from "../hooks/useProfile";
import { ProfileHeader } from "../components/ProfileHeader";
import { ProfilePicture } from "../components/ProfilePicture";
import { PersonalInformation } from "../components/PersonalInformation";
import { ContactInformation } from "../components/ContactInformation";
import { EmploymentInformation } from "../components/EmploymentInformation";
import { EmergencyContact } from "../components/EmergencyContact";
import { BankInformation } from "../components/BankInformation";
import { ChangePasswordModal } from "../components/ChangePasswordModal";
import { EditProfileModal } from "../components/EditProfileModal";
import { Button } from "../../../app/components/ui/button";

export function Profile() {
  const {
    profile,
    loading,
    updating,
    uploading,
    error,
    refreshProfile,
    updateProfile,
    uploadPhoto,
    deletePhoto,
    changePassword,
  } = useProfile();

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  if (loading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-medium text-muted-foreground">Loading employee profile...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[60vh] space-y-4 text-center">
        <AlertCircle className="w-12 h-12 text-destructive" />
        <h3 className="text-lg font-bold text-foreground">Failed to Load Profile</h3>
        <p className="text-sm text-muted-foreground max-w-md">{error || "Employee profile could not be retrieved."}</p>
        <Button onClick={refreshProfile} className="flex items-center gap-2">
          <RefreshCw className="w-4 h-4" /> Retry Loading
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <User className="w-6 h-6 text-primary" /> Employee Profile
          </h1>
          <p className="text-xs text-muted-foreground">
            Manage your personal information, contact info, emergency contacts, and security credentials.
          </p>
        </div>
      </div>

      {/* Profile Header Card */}
      <ProfileHeader
        profile={profile}
        onOpenChangePassword={() => setIsPasswordModalOpen(true)}
        onOpenEditModal={() => setIsEditModalOpen(true)}
      />

      {/* Two Column Layout (Desktop) / Single Column (Mobile) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (1 Col) */}
        <div className="space-y-6 lg:col-span-1">
          <ProfilePicture
            profile={profile}
            onUploadPhoto={uploadPhoto}
            onDeletePhoto={deletePhoto}
            uploading={uploading}
          />
          <EmergencyContact profile={profile} />
          <BankInformation profile={profile} />
        </div>

        {/* Right Column (2 Cols) */}
        <div className="space-y-6 lg:col-span-2">
          <PersonalInformation profile={profile} />
          <ContactInformation profile={profile} />
          <EmploymentInformation profile={profile} />
        </div>
      </div>

      {/* Modals */}
      <ChangePasswordModal
        open={isPasswordModalOpen}
        onOpenChange={setIsPasswordModalOpen}
        onChangePassword={changePassword}
        updating={updating}
      />

      <EditProfileModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        profile={profile}
        onUpdateProfile={updateProfile}
        updating={updating}
      />
    </div>
  );
}

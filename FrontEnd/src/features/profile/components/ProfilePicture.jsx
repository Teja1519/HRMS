import { useState, useRef } from "react";
import { Camera, Trash2, Upload, UserCheck } from "lucide-react";
import { Button } from "../../../app/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../../../app/components/ui/avatar";

export function ProfilePicture({ profile, onUploadPhoto, onDeletePhoto, uploading }) {
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(null);

  const photoUrl = preview || (profile?.ProfilePicture
    ? (profile.ProfilePicture.startsWith("http") ? profile.ProfilePicture : `http://localhost:5000${profile.ProfilePicture}`)
    : null);

  const initials = profile?.FullName
    ? profile.FullName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "EMP";

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const localPreviewUrl = URL.createObjectURL(file);
      setPreview(localPreviewUrl);
      const success = await onUploadPhoto(file);
      if (!success) {
        setPreview(null);
      }
    }
  };

  const handleRemove = async () => {
    setPreview(null);
    await onDeletePhoto();
  };

  return (
    <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4 text-center">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <h3 className="font-semibold text-sm text-foreground flex items-center gap-2">
          <Camera className="w-4 h-4 text-primary" /> Profile Photo
        </h3>
        <span className="text-[10px] text-muted-foreground">JPG/PNG, Max 5MB</span>
      </div>

      <div className="flex flex-col items-center gap-3">
        <div className="relative group">
          <Avatar className="w-32 h-32 border-4 border-accent shadow-md">
            {photoUrl ? <AvatarImage src={photoUrl} alt={profile?.FullName} /> : null}
            <AvatarFallback className="bg-primary text-primary-foreground text-3xl font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept="image/jpeg,image/png,image/jpg"
          className="hidden"
        />

        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 text-xs"
          >
            <Upload className="w-3.5 h-3.5" />
            {profile?.ProfilePicture ? "Replace Photo" : "Upload Photo"}
          </Button>

          {profile?.ProfilePicture && (
            <Button
              variant="ghost"
              size="sm"
              disabled={uploading}
              onClick={handleRemove}
              className="text-destructive hover:bg-destructive/10 text-xs flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" /> Remove
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

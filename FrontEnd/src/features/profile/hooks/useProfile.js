import { useState, useEffect, useCallback } from "react";
import { profileService } from "../services/profileService";
import { toast } from "sonner";

export function useProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await profileService.getProfile();
      setProfile(data);
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to load employee profile";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchProfile();
  }, [fetchProfile]);

  const updateProfile = async (updatedFields) => {
    setUpdating(true);
    try {
      const data = await profileService.updateProfile(updatedFields);
      setProfile(data);
      toast.success("Profile updated successfully");
      return true;
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to update profile";
      toast.error(msg);
      return false;
    } finally {
      setUpdating(false);
    }
  };

  const uploadPhoto = async (file) => {
    if (!file) return false;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Profile picture size must not exceed 5 MB");
      return false;
    }
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPG, JPEG, and PNG images are allowed");
      return false;
    }

    setUploading(true);
    try {
      const data = await profileService.uploadPhoto(file);
      setProfile(data);
      toast.success("Profile picture updated successfully");
      return true;
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to upload profile picture";
      toast.error(msg);
      return false;
    } finally {
      setUploading(false);
    }
  };

  const deletePhoto = async () => {
    setUploading(true);
    try {
      const data = await profileService.deletePhoto();
      setProfile(data);
      toast.success("Profile picture removed");
      return true;
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to remove profile picture";
      toast.error(msg);
      return false;
    } finally {
      setUploading(false);
    }
  };

  const changePassword = async (passwordData) => {
    setUpdating(true);
    try {
      await profileService.changePassword(passwordData);
      toast.success("Password changed successfully");
      return true;
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to change password";
      toast.error(msg);
      return false;
    } finally {
      setUpdating(false);
    }
  };

  return {
    profile,
    loading,
    updating,
    uploading,
    error,
    refreshProfile: fetchProfile,
    updateProfile,
    uploadPhoto,
    deletePhoto,
    changePassword,
  };
}

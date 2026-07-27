import api from "../../../app/lib/api";

export const profileService = {
  // Fetch current user's profile
  getProfile: async () => {
    const response = await api.get("/profile");
    return response.data?.data;
  },

  // Update profile details
  updateProfile: async (profileData) => {
    const response = await api.put("/profile", profileData);
    return response.data?.data;
  },

  // Upload profile photo
  uploadPhoto: async (file) => {
    const formData = new FormData();
    formData.append("photo", file);
    const response = await api.post("/profile/upload-photo", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data?.data;
  },

  // Remove profile photo
  deletePhoto: async () => {
    const response = await api.delete("/profile/photo");
    return response.data?.data;
  },

  // Change password
  changePassword: async (passwordData) => {
    const response = await api.put("/profile/change-password", passwordData);
    return response.data;
  },
};

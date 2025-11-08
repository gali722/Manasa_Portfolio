import axios from '../lib/axios';

export const profileService = {
  // Public endpoints
  getPublicProfile: async () => {
    const response = await axios.get('/public/profile');
    return response.data;
  },

  downloadResume: async () => {
    const response = await axios.get('/public/resume', {
      responseType: 'blob',
    });
    return response.data;
  },

  // Admin endpoints
  getAdminProfile: async () => {
    const response = await axios.get('/admin/profile');
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await axios.put('/admin/profile', profileData);
    return response.data;
  },

  uploadProfilePhoto: async (file) => {
    const formData = new FormData();
    formData.append('photo', file);
    const response = await axios.post('/admin/profile/photo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  uploadResume: async (file) => {
    const formData = new FormData();
    formData.append('resume', file);
    const response = await axios.post('/admin/profile/resume', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};

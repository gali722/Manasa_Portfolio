import axios from '../lib/axios';

export const educationService = {
  // Public endpoints
  getPublicEducation: async () => {
    const response = await axios.get('/public/education');
    return response.data;
  },

  // Admin endpoints
  getAdminEducation: async () => {
    const response = await axios.get('/admin/education');
    return response.data;
  },

  createEducation: async (educationData) => {
    const response = await axios.post('/admin/education', educationData);
    return response.data;
  },

  updateEducation: async (id, educationData) => {
    const response = await axios.put(`/admin/education/${id}`, educationData);
    return response.data;
  },

  deleteEducation: async (id) => {
    const response = await axios.delete(`/admin/education/${id}`);
    return response.data;
  },
};

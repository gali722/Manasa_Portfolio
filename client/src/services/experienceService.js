import axios from '../lib/axios';

export const experienceService = {
  // Public endpoints
  getPublicExperience: async () => {
    const response = await axios.get('/public/experience');
    return response.data;
  },

  // Admin endpoints
  getAdminExperience: async () => {
    const response = await axios.get('/admin/experience');
    return response.data;
  },

  createExperience: async (experienceData) => {
    const response = await axios.post('/admin/experience', experienceData);
    return response.data;
  },

  updateExperience: async (id, experienceData) => {
    const response = await axios.put(`/admin/experience/${id}`, experienceData);
    return response.data;
  },

  deleteExperience: async (id) => {
    const response = await axios.delete(`/admin/experience/${id}`);
    return response.data;
  },
};

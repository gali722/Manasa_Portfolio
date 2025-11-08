import axios from '../lib/axios';

export const certificationsService = {
  // Public endpoints
  getPublicCertifications: async () => {
    const response = await axios.get('/public/certifications');
    return response.data;
  },

  // Admin endpoints
  getAdminCertifications: async () => {
    const response = await axios.get('/admin/certifications');
    return response.data;
  },

  createCertification: async (certificationData) => {
    const response = await axios.post('/admin/certifications', certificationData);
    return response.data;
  },

  updateCertification: async (id, certificationData) => {
    const response = await axios.put(`/admin/certifications/${id}`, certificationData);
    return response.data;
  },

  deleteCertification: async (id) => {
    const response = await axios.delete(`/admin/certifications/${id}`);
    return response.data;
  },
};

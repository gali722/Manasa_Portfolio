import axios from '../lib/axios';

export const projectsService = {
  // Public endpoints
  getPublicProjects: async (filters = {}) => {
    const response = await axios.get('/public/projects', { params: filters });
    return response.data;
  },

  getPublicProject: async (id) => {
    const response = await axios.get(`/public/projects/${id}`);
    return response.data;
  },

  // Admin endpoints
  getAdminProjects: async () => {
    const response = await axios.get('/admin/projects');
    return response.data;
  },

  createProject: async (projectData) => {
    const response = await axios.post('/admin/projects', projectData);
    return response.data;
  },

  updateProject: async (id, projectData) => {
    const response = await axios.put(`/admin/projects/${id}`, projectData);
    return response.data;
  },

  deleteProject: async (id) => {
    const response = await axios.delete(`/admin/projects/${id}`);
    return response.data;
  },

  uploadProjectImages: async (id, files) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file);
    });
    const response = await axios.post(`/admin/projects/${id}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};

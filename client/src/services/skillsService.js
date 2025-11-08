import axios from '../lib/axios';

export const skillsService = {
  // Public endpoints
  getPublicSkills: async () => {
    const response = await axios.get('/public/skills');
    return response.data;
  },

  // Admin endpoints
  getAdminSkills: async () => {
    const response = await axios.get('/admin/skills');
    return response.data;
  },

  createSkill: async (skillData) => {
    const response = await axios.post('/admin/skills', skillData);
    return response.data;
  },

  updateSkill: async (id, skillData) => {
    const response = await axios.put(`/admin/skills/${id}`, skillData);
    return response.data;
  },

  deleteSkill: async (id) => {
    const response = await axios.delete(`/admin/skills/${id}`);
    return response.data;
  },

  reorderSkills: async (skillsOrder) => {
    const response = await axios.put('/admin/skills/reorder', { skillsOrder });
    return response.data;
  },
};

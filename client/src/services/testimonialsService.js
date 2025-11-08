import axios from '../lib/axios';

export const testimonialsService = {
  // Public endpoints
  getPublicTestimonials: async () => {
    const response = await axios.get('/public/testimonials');
    return response.data;
  },

  // Admin endpoints
  getAdminTestimonials: async () => {
    const response = await axios.get('/admin/testimonials');
    return response.data;
  },

  createTestimonial: async (testimonialData) => {
    const response = await axios.post('/admin/testimonials', testimonialData);
    return response.data;
  },

  updateTestimonial: async (id, testimonialData) => {
    const response = await axios.put(`/admin/testimonials/${id}`, testimonialData);
    return response.data;
  },

  deleteTestimonial: async (id) => {
    const response = await axios.delete(`/admin/testimonials/${id}`);
    return response.data;
  },

  reorderTestimonials: async (testimonialsOrder) => {
    const response = await axios.put('/admin/testimonials/reorder', { testimonialsOrder });
    return response.data;
  },
};

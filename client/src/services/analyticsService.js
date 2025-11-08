import axios from '../lib/axios';

export const analyticsService = {
  // Public endpoint
  trackPageView: async (data) => {
    const response = await axios.get('/public/analytics/track', { params: data });
    return response.data;
  },

  // Admin endpoints
  getAnalytics: async (params = {}) => {
    const response = await axios.get('/admin/analytics', { params });
    return response.data;
  },

  exportAnalytics: async (params = {}) => {
    const response = await axios.get('/admin/analytics/export', {
      params,
      responseType: 'blob',
    });
    return response.data;
  },
};

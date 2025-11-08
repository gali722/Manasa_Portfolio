import axios from '../lib/axios';

export const authService = {
  login: async (credentials) => {
    const response = await axios.post('/auth/login', credentials);
    return response.data;
  },

  logout: async () => {
    const response = await axios.post('/auth/logout');
    return response.data;
  },

  refreshToken: async (refreshToken) => {
    const response = await axios.post('/auth/refresh', { refreshToken });
    return response.data;
  },

  changePassword: async (passwordData) => {
    const response = await axios.post('/auth/change-password', passwordData);
    return response.data;
  },
};

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: `${API_URL}/api`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Send cookies with requests
});

// Request interceptor - Add auth token to requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized - Token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh token
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${API_URL}/api/auth/refresh`, {
            refreshToken,
          });

          const { token } = response.data;
          localStorage.setItem('authToken', token);

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, logout user
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/admin/login';
        return Promise.reject(refreshError);
      }
    }

    // Handle other errors
    const errorMessage = error.response?.data?.error?.message || error.message || 'An error occurred';
    
    // Create a custom error object
    const customError = new Error(errorMessage);
    customError.status = error.response?.status;
    customError.code = error.response?.data?.error?.code;
    customError.details = error.response?.data?.error?.details;

    return Promise.reject(customError);
  }
);

export default axiosInstance;

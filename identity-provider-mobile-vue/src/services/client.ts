import axios from 'axios';

// HARDCODED for debugging - bypass env vars completely
const API_BASE_URL = 'https://gnashingly-superadmirable-anahi.ngrok-free.dev/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  },
  withCredentials: false,
});

/**
 * Extracts a readable error message from an axios error
 */
export const getErrorMessage = (err: any): string => {
  if (err.response?.data) {
    const data = err.response.data;

    // 1. Check for 'message' field (AuthException, UserBlockedException)
    if (data.message) return data.message;

    // 2. Check for validation errors (MethodArgumentNotValidException)
    if (typeof data === 'object') {
      const values = Object.values(data);
      if (values.length > 0 && typeof values[0] === 'string') {
        return values[0];
      }
    }
  }

  return err.message || "Une erreur s'est produite";
};

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // Only redirect to login if we're not already on the login page
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;

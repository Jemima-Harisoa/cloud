import apiClient from './client';

const AUTH_API = '/auth';

const authService = {
  login: async (email, password) => {
    const response = await apiClient.post(`${AUTH_API}/login`, { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  register: async (email, password, firstName, lastName, phoneNumber) => {
    const response = await apiClient.post(`${AUTH_API}/register`, {
      email,
      password,
      firstName,
      lastName,
      phoneNumber,
    });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout: async () => {
    await apiClient.post(`${AUTH_API}/logout`);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  updateUser: async (userId, data) => {
    const response = await apiClient.put(`${AUTH_API}/user/${userId}`, data);
    localStorage.setItem('user', JSON.stringify(response.data));
    return response.data;
  },

  getUser: async (userId) => {
    const response = await apiClient.get(`${AUTH_API}/user/${userId}`);
    return response.data;
  },

  getBlockedUsers: async () => {
    const response = await apiClient.get(`${AUTH_API}/blocked-users`);
    return response.data;
  },

  unblockUser: async (userId) => {
    const response = await apiClient.post(`${AUTH_API}/unblock/${userId}`);
    return response.data;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
};

export default authService;

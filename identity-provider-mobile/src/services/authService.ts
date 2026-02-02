import apiClient from './client';

const AUTH_API = '/auth';

const authService = {
  login: async (email: string, password: string) => {
    const response = await apiClient.post(`${AUTH_API}/login`, { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  register: async (email: string, password: string, firstName: string, lastName: string, phoneNumber: string) => {
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

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
};

export default authService;

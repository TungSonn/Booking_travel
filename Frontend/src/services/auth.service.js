import api from './api';

export const authService = {
  register: (data)       => api.post('/auth/register', data),
  login: async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    return res.data;
  },
  logout: ()             => api.post('/auth/logout'),
  getMe: async () => {
    const res = await api.get('/auth/me');
    return res.data;
  },
  getUsers: async () => {
    const res = await api.get('/auth/users');
    return res.data;
  },
  updateProfile: (data)  => api.put('/auth/update-profile', data),
  forgotPassword: (email)=> api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.post(`/auth/reset-password/${token}`, { password }),
  verifyEmail: (token)   => api.get(`/auth/verify-email/${token}`),
  refreshToken: (token)  => api.post('/auth/refresh-token', { refreshToken: token }),
};

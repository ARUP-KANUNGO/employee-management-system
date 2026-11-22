import api from './api.js'

export const authService = {
  register: (payload) => api.post('/api/auth/register', payload).then((r) => r.data),
  login: (payload) => api.post('/api/auth/login', payload).then((r) => r.data),
  getMe: () => api.get('/api/auth/me').then((r) => r.data),
}

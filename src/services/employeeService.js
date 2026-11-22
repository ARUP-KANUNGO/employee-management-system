import api from './api.js'

const buildQuery = (params = {}) => {
  const sp = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') sp.append(k, v)
  })
  const qs = sp.toString()
  return qs ? `?${qs}` : ''
}

export const employeeService = {
  list: (params) => api.get(`/api/employees${buildQuery(params)}`).then((r) => r.data),
  get: (id) => api.get(`/api/employees/${id}`).then((r) => r.data),
  getMyProfile: () => api.get('/api/employees/me/profile').then((r) => r.data),
  stats: () => api.get('/api/employees/stats/summary').then((r) => r.data),
  create: (payload) => api.post('/api/employees', payload).then((r) => r.data),
  update: (id, payload) => api.put(`/api/employees/${id}`, payload).then((r) => r.data),
  updateMyProfile: (payload) => api.put('/api/employees/me/profile', payload).then((r) => r.data),
  remove: (id) => api.delete(`/api/employees/${id}`).then((r) => r.data),
}

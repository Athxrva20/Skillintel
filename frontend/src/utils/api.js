import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const api = axios.create({ baseURL: API_URL })

api.interceptors.request.use(config => {
  const token = localStorage.getItem('skillintel-token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export const jobsAPI = {
  search: (q, location, page) => api.get(`/api/jobs/search`, { params: { q, location, page } }),
  save: (job) => api.post(`/api/jobs/save`, { job }),
  getSaved: () => api.get(`/api/jobs/saved`)
}

export const skillsAPI = {
  getTop: (q) => api.get(`/api/skills/top`, { params: { q } }),
  getTrending: () => api.get(`/api/skills/trending`),
  getCategories: () => api.get(`/api/skills/categories`)
}

export const resumeAPI = {
  analyze: (formData) => api.post(`/api/resume/analyze`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  tailor: (resume_text, job_description) => api.post(`/api/resume/tailor`, { resume_text, job_description })
}

export const forecastAPI = {
  getSkills: (months) => api.get(`/api/forecast/skills`, { params: { months } }),
  getMarket: () => api.get(`/api/forecast/market`)
}

export const rolesAPI = {
  getAll: () => api.get(`/api/roles/`),
  getDetail: (name) => api.get(`/api/roles/${name}`),
  search: (q, skill) => api.get(`/api/roles/search`, { params: { q, skill } })
}

export default api
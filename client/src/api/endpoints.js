import axios from "axios";

// ✅ Base URL (works for Vite + backend)
axios.defaults.baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// ✅ Auto-attach token
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Auth API
export const authAPI = {
  login: (data) => axios.post('/auth/login', data),
  register: (data) => axios.post('/auth/register', data),
  getMe: () => axios.get('/auth/me') // ✅ matches AuthContext
};

// ✅ Appointments API
export const appointmentAPI = {
  create: (data) => axios.post('/appointments', data),
  getMyAppointments: () => axios.get('/appointments/my-appointments'),
  getAllAppointments: (params) => axios.get('/appointments', { params }),
  update: (id, data) => axios.put(`/appointments/${id}`, data),
  delete: (id) => axios.delete(`/appointments/${id}`)
};

// ✅ Triage API
export const triageAPI = {
  submit: (data) => axios.post('/triage', data),
  getMyHistory: () => axios.get('/triage/my-history'),
  getAllTriages: (params) => axios.get('/triage', { params }),
  getById: (id) => axios.get(`/triage/${id}`),
  respond: (id, data) => axios.put(`/triage/${id}/respond`, data)
};

// ✅ Articles API
export const articleAPI = {
  getAll: (params) => axios.get('/articles', { params }),
  getById: (id) => axios.get(`/articles/${id}`),
  getByCategory: (category) => axios.get(`/articles/category/${category}`),
  create: (data) => axios.post('/articles', data),
  update: (id, data) => axios.put(`/articles/${id}`, data),
  delete: (id) => axios.delete(`/articles/${id}`)
};

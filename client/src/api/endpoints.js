import axios from "axios";

// ✅ Base URL (works for Vite + backend)
axios.defaults.baseURL = `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api`;

// ✅ Auto-attach token
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Handle 401 errors (auto-logout)
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ✅ Auth API
export const authAPI = {
  login: (data) => axios.post('/auth/login', data),
  register: (data) => axios.post('/auth/register', data),
  getMe: () => axios.get('/auth/me')
};

// ✅ Appointments API
export const appointmentAPI = {
  create: (data) => axios.post('/appointments', data),
  createAppointment: (data) => axios.post('/appointments', data), // Alias for compatibility
  getMyAppointments: () => axios.get('/appointments/my-appointments'),
  getAllAppointments: (params) => axios.get('/appointments', { params }),
  update: (id, data) => axios.put(`/appointments/${id}`, data),
  updateAppointment: (id, data) => axios.put(`/appointments/${id}`, data), // Alias
  delete: (id) => axios.delete(`/appointments/${id}`),
  deleteAppointment: (id) => axios.delete(`/appointments/${id}`) // Alias
};

// ✅ Triage API
export const triageAPI = {
  submit: (data) => axios.post('/triage', data),
  submitTriage: (data) => axios.post('/triage', data), // Alias for compatibility
  getMyHistory: () => axios.get('/triage/my-history'),
  getAllTriages: (params) => axios.get('/triage', { params }),
  getById: (id) => axios.get(`/triage/${id}`),
  respond: (id, data) => axios.put(`/triage/${id}/respond`, data),
  respondToTriage: (id, data) => axios.put(`/triage/${id}/respond`, data) // Alias
};

// ✅ Chat API (NEW - Real-time messaging)
export const chatAPI = {
  getConversations: () => axios.get('/chat/conversations'),
  getMessages: (userId) => axios.get(`/chat/messages/${userId}`),
  sendMessage: (data) => axios.post('/chat/messages', data),
  getUnreadCount: () => axios.get('/chat/unread-count'),
  getAvailableUsers: () => axios.get('/chat/available-users')
};
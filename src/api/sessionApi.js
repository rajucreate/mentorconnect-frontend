import api from './axios';

export const getMySessions = () => api.get('/sessions/my');
export const getMentorSessions = () => api.get('/sessions/mentor');
export const getAdminSessions = () => api.get('/admin/sessions');
export const bookSession = (payload) => api.post('/sessions/book', payload);

export const updateSessionStatus = (sessionId, status, payload = null) =>
  api.put(`/sessions/${sessionId}/status`, payload, { params: { status } });

export const updateAdminSessionStatus = (sessionId, status) =>
  api.put(`/admin/session/${sessionId}/status`, null, { params: { status } });

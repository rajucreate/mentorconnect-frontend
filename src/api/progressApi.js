import api from './axios';

export const createProgress = (payload) => api.post('/progress', payload);

export const updateProgress = (progressId, payload) =>
  api.put(`/progress/${progressId}`, payload);

export const getProgressByMatch = (matchId) =>
  api.get(`/progress/match/${matchId}`);

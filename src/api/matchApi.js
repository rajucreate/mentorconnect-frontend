import api from './axios';

export const getMatchedMentors = () => api.get('/match/mentors');
export const createMatch = (mentorId) => api.post('/match/create', { mentorId: Number(mentorId) });

export const getMyMatches = () => api.get('/match/my');

export const getAdminMatches = () => api.get('/admin/matches');
export const updateAdminMatchStatus = (matchId, status) =>
  api.put(`/admin/match/${matchId}/status`, null, { params: { status } });

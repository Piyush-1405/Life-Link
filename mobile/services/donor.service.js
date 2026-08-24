import api from './api';

export const getProfile = async () => {
  const response = await api.get('/donors/profile');
  return response.data;
};

export const updateProfile = async (data) => {
  const response = await api.patch('/donors/profile', data);
  return response.data;
};

export const toggleAvailability = async (isAvailable) => {
  const response = await api.patch('/donors/availability', { isAvailable });
  return response.data;
};

export const getEligibleRequests = async () => {
  const response = await api.get('/donors/eligible-requests');
  return response.data;
};

export const respondToRequest = async (requestId, action) => {
  const response = await api.post(`/donors/requests/${requestId}/respond`, { action });
  return response.data;
};

export const getDonationHistory = async () => {
  const response = await api.get('/donors/history');
  return response.data;
};

import api from './api';

export const createRequest = async (data) => {
  const response = await api.post('/requests', data);
  return response.data;
};

export const getMyRequests = async () => {
  const response = await api.get('/requests/my');
  return response.data;
};

export const getRequest = async (id) => {
  const response = await api.get(`/requests/${id}`);
  return response.data;
};

export const cancelRequest = async (id) => {
  const response = await api.patch(`/requests/${id}/cancel`);
  return response.data;
};

export const getTimeline = async (id) => {
  const response = await api.get(`/requests/${id}/timeline`);
  return response.data;
};

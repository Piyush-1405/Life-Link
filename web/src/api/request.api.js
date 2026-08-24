import axiosInstance from './axiosInstance';

export const createRequest = (data) => axiosInstance.post('/requests', data);
export const getRequest = (id) => axiosInstance.get(`/requests/${id}`);
export const getRequests = (params) => axiosInstance.get('/requests', { params });
export const cancelRequest = (id) => axiosInstance.post(`/requests/${id}/cancel`);
export const assignHospital = (id, hospitalId) => axiosInstance.post(`/requests/${id}/assign`, { hospitalId });
export const transitionStatus = (id, data) => axiosInstance.post(`/requests/${id}/status`, data);
export const getTimeline = (id) => axiosInstance.get(`/requests/${id}/timeline`);

import axiosInstance from './axiosInstance';

export const createDonation = (data) => axiosInstance.post('/donations', data);
export const getDonation = (id) => axiosInstance.get(`/donations/${id}`);
export const getDonations = (params) => axiosInstance.get('/donations', { params });
export const transitionStatus = (id, data) => axiosInstance.post(`/donations/${id}/status`, data);
export const completeDonation = (id, data) => axiosInstance.post(`/donations/${id}/complete`, data);
